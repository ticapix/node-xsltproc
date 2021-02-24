const assert = require('assert');
const path = require('path');
const xsltproc = require(path.join('..', 'src'));

const fixtures_path = path.join(__dirname, 'fixtures');

describe('xsltproc', function() {
	describe('failure', () => {
		it('should fail if binary not available', () => {
			assert.throws(() => xsltproc({xsltproc_path: '/'}), Error);
		});
		it('call transform with not existing file', () => {
			let filename = 'file_which_do_not_exists';
			return xsltproc().transform(filename).catch((error) => {
				assert.strictEqual(error.file, filename);
			});
		});
		it('check stringparams are string', () => {
			return xsltproc().transform(path.join(fixtures_path, 'params.xml'), {stringparams: {n: 42}}).catch((error) => {
				assert.strictEqual(error.message, "value of 'n' must be a string");
			});
		});
	});
	describe('transform', () => {
		it('check includes', () => {
			return xsltproc().transform(path.join(fixtures_path, 'page.xml')).then((data) => {
				assert.strictEqual(data.result, '<h1>My</h1> <h2>page content</h2>\n');
				assert.strictEqual(data.metadata.message, '');
				assert.deepStrictEqual(data.metadata.includes, ['page.xml', 'variables.dtd', 'page.xsl', 'menu.xsl']);
				assert.strictEqual(data.metadata.functions[0].fctName, 'page');
			});
		});
		it('check message', () => {
			let files = [path.join(fixtures_path, 'menu.xsl'), path.join(fixtures_path, 'menu.xml')];
			return xsltproc().transform(files).then((data) => {
				assert.notStrictEqual(data.metadata.message.indexOf('warning: failed to load external entity'), -1);
				assert.notStrictEqual(data.metadata.message.indexOf('fakefile.dtd'), -1);
				assert.deepStrictEqual(data.metadata.includes, ['menu.xsl', 'menu.xml']);
				assert.strictEqual(data.metadata.functions[0].fctName, 'menu');
			});
		});
		it('check params', () => {
			return xsltproc().transform(path.join(fixtures_path, 'params.xml'), {debug: true, stringparams: {n: '42'}}).then((data) => {
				assert.strictEqual(data.result, 'n=42');
				assert.strictEqual(data.metadata.message, '');
				assert.deepStrictEqual(data.metadata.includes, ['params.xml', 'params.xsl']);
				assert.strictEqual(data.metadata.functions[0].fctName, '@*|*');
			});
		});
	});
});
