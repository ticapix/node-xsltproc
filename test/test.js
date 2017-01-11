const assert = require('assert');
const path = require('path');
const xsltproc = require(path.join('..', 'src'));

describe('xsltproc', function() {
	it('should fail if binary not available', function() {
		assert.throws(() => xsltproc({xsltproc_path: '/'}), Error);
    });
    
	it('call transform with not existing file', function() {
		let filename = 'file_which_do_not_exists';
		return xsltproc().transform(filename).catch((error) => {
			assert.equal(error.file, filename);
		});
    });
});
