const fse = require('fs-extra');
const concat  = require('concat');

(async function build() {
const files = [
'./www/main.js',
'./www/polyfills.js',
'./www/runtime.js',
'./www/common.js',
'./www/31.js',
'./www/107.js',
'./www/115.js',
'./www/132.js',
'./www/135.js',
'./www/144.js',
'./www/163.js',
'./www/185.js',
'./www/191.js',
'./www/200.js',
'./www/219.js',
'./www/221.js',
'./www/278.js',
'./www/321.js',
'./www/333.js',
'./www/340.js',
'./www/371.js',
'./www/460.js',
'./www/467.js',
'./www/479.js',
'./www/686.js',
'./www/695.js',
'./www/721.js',
'./www/832.js',
'./www/867.js',
'./www/994.js'
]
await fse.ensureDir('angular-elements')
await concat(files,'angular-elements/ems.js')
await concat(['./www/styles.css'],'angular-elements/ems.css')
await concat(['./www/web.config'],'angular-elements/web.config')
})()
