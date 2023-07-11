const fse = require('fs-extra');
const concat  = require('concat');

(async function build() {
const files_es5 = [
'./www/runtime-es5.js',
'./www/polyfills-es5.js',
'./www/scripts.js',
'./www/main-es5.js',
'./www/0-es5.js',
'./www/1-es5.js',
'./www/2-es5.js',
'./www/3-es5.js',
'./www/4-es5.js',
'./www/5-es5.js',
'./www/6-es5.js',
'./www/7-es5.js',
'./www/8-es5.js',
'./www/9-es5.js',
'./www/10-es5.js'
]
const files_es2015 = [
  './www/runtime-es2015.js',
  './www/polyfills-es2015.js',
  './www/scripts.js',
  './www/main-es2015.js',
  './www/0-es2015.js',
  './www/1-es2015.js',
  './www/2-es2015.js',
  './www/3-es2015.js',
  './www/4-es2015.js',
  './www/5-es2015.js',
  './www/6-es2015.js',
  './www/7-es2015.js',
  './www/8-es2015.js',
  './www/9-es2015.js',
  './www/10-es2015.js'
  ]
await fse.ensureDir('angular-elements')
await concat(files_es5,'angular-elements/sinovadclient_es5.js')
await concat(files_es2015,'angular-elements/sinovadclient_es2015.js')
await concat(['./www/styles.css'],'angular-elements/styles.css')
await concat(['./www/assets/css/custom-styles.css'],'angular-elements/custom-styles.css')
})()
