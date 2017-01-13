"use strict";
const execFile = require('child_process').execFile;
const execFileSync = require('child_process').execFileSync;
const assert = require('assert');
const path = require('path');

/* 
utility to parse the stdout of xsltproc with the --load-trace and --profile options
regexp built from the output analysis and libxslt source code https://git.gnome.org/browse/libxslt/tree/libxslt/xsltutils.c
*/

function XsltProcParser(output, pathPrefix) {
	pathPrefix = pathPrefix || '';
	function parseXsltOutputLoadTrace(line) {
		//ex: Loaded URL="www/templates/runAbove.dtd" ID="(null)"
		let ans = /URL="([^"]+)"/.exec(line);
		return ans[1];
	}

	function parseXsltOutputProfileFunctionCalls(lines) {
		// ex:     5                /page                                    1      9      9
		// because the pattern can be on several lines, we need to concat back all lines and search for all pattern in the concatened string
		let str = lines.join(' ');
		let regexp = /(\d+)\s+(\S+)\s+(\d+)\s+(\d+)\s+(\d+)/g; // don't remove the g flag to prevent looping
		let ans, results = [];
		while ((ans = regexp.exec(str)) !== null) {
			results.push({id: parseInt(ans[1], 10), fctName: ans[2], count: parseInt(ans[3], 10), total: parseInt(ans[4], 10), avg_100us: parseInt(ans[5], 10)});
		}
		return results;
	}

	function parseXsltOutputProfileFunctionIndex(pathPrefix, fcts, lines) {
		// ex: [6] /page (www/xsl/runAbove.xsl:9)
		for (let i = 0; i < lines.length; ++i) {
			let ans = /\[(\d+)\]\s(\S+)\s\(([^:]+):(\d+)\)/.exec(lines[i]);
			if (ans === null) {
				continue;
			}
			let id = parseInt(ans[1], 10);
			assert.equal(fcts[id].id, id, 'fail to match function indexes while parsing xsltproc output');
			fcts[id].fctName = ans[2];
			fcts[id].source = path.relative(pathPrefix, ans[3]);
			fcts[id].line = parseInt(ans[4], 10);
		}
		return fcts;
	}

	let lines = output.split('\n');
	let start = 0, end = 0;
	let result = {message: '', functions: {}, includes: new Set()};
	// extract error message from --load-trace output
	while (start < lines.length && !(/number\s+match\s+name\s+mode\s+Calls\s+Tot 100us Avg/.test(lines[start]))) {
		if (lines[start].startsWith('Loaded')) { // extract --load-trace output
			result.includes.add(path.relative(pathPrefix, parseXsltOutputLoadTrace(lines[start])));
		} else { // error message
			result.message += `${lines[start]}\n`;
		}
		++start;
	}
	result.includes = Array.from(result.includes); // because JSON.sringify won't work on a Set
	// extract --profile output
	// based on the code from https://git.gnome.org/browse/libxslt/tree/libxslt/xsltutils.c
	// extract the funct calls section
	end = start;
	while (end < lines.length && !(/\s+Total\s+\d+\s+\d+/.test(lines[end]))) {
		++end;
	}
	result.functions = parseXsltOutputProfileFunctionCalls(lines.slice(start, ++end)); // don't change it to end++ as we need the extra line
	// extract the funct calls section	
	start = end;
	while (start < lines.length && !lines[start].startsWith('Index by function name')) {
		++start;
	}
	result.functions = parseXsltOutputProfileFunctionIndex(pathPrefix, result.functions, lines.slice(start, lines.length)); 
	return result;
}

function xsltproc(options) {
	options = options || {};
	let xsltproc_bin = path.join(options.xsltproc_path || '', 'xsltproc');
	try {
		let ans = execFileSync(xsltproc_bin, ['--version']);
	} catch (ex) {
		throw new Error(`error in executing ${xsltproc_bin}`);
	}
	function transform(filepath, run_options) {
		run_options = run_options || {};
		run_options.stringparams = run_options.stringparams || {};
		run_options.debug = run_options.debug === undefined ? false : run_options.debug;
		return new Promise((resolve, reject) => {
			let args = ['--load-trace', '--profile', '--output',  '-'];
			let basedir;
			if (filepath.constructor === Array) {
				args = args.concat(filepath);
				basedir = path.dirname(filepath[0]);
			} else {
				args.push(filepath);
				basedir = path.dirname(filepath);
			}
			for (let key in run_options.stringparams) {
				let value = run_options.stringparams[key];
				assert.equal(true, typeof value === 'string' || value instanceof String, `value of '${key}' must be a string`);
				args = args.concat(['--stringparam', key, value]);
			}
			if (run_options.debug) {
				console.log('exec:', xsltproc_bin, args.join(' '));
			}
			execFile(xsltproc_bin, args, (error, stdout, stderr) => {
				if (error !== null) {
					return reject({file: filepath, message: stderr});
        	    }
        	    let metadata = XsltProcParser(stderr, basedir);
            	return resolve({result: stdout, metadata: metadata});
            });
		});
	}
	return {
		transform: transform
	};
}

module.exports = xsltproc;
