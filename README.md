
# node-xsltproc

[![Build Status](https://travis-ci.org/ticapix/node-xsltproc.svg?branch=master)](https://travis-ci.org/ticapix/node-xsltproc)

## Getting started

First install xsltproc. If not already installed on your system, read [installing an XSLT processor](http://www.sagehill.net/docbookxsl/InstallingAProcessor.html).

Install the module with: `npm install node-xsltproc --save`

### Options

#### xsltproc options

- `xsltproc_path` : specify the path for xsltproc

#### transform options

- `debug` : add extra verbose message (default: false)
- `stringparams` : add stringparam (default: {})
- `metadata` : whether metadata should be parsed from xsltproc output (default: true)

### Exemples

#### using an optional path for xsltproc

```javascript
const xsltproc = require('node-xsltproc');

xsltproc({xsltproc_path: '/home/user/local/bin'}).transform('test/fixtures/page.xml').then((data) => {
	console.log('metadata', data.metadata);
	console.log('output', data.result);
});
```

```text
metadata { message: '',
  functions:
   [ { id: 0,
       fctName: 'page',
       count: 1,
       total: 5,
       avg_100us: 5,
       source: 'page.xsl',
       line: 5 } ],
  includes: [ 'page.xml', 'variables.dtd', 'page.xsl', 'menu.xsl' ] }
output <h1>My</h1> <h2>page content</h2>
```

#### using stylesheet+xml files

```javascript
const xsltproc = require('node-xsltproc');

xsltproc().transform(['test/fixtures/menu.xsl', 'test/fixtures/menu.xml']).then((data) => {
	console.log(data.metadata);
	console.log(data.result);
});
```

#### using stringparam

```javascript
const xsltproc = require('node-xsltproc');

xsltproc().transform('test/fixtures/params.xml'), {stringparams: {n: '42'}}).then((data) => {
  console.log(data.metadata);
  console.log(data.result);
});
```
