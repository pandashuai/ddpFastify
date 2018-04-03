/*
 * @Author: 邓登攀
 * @Date:   2018-01-29 16:34:44
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-08 10:55:10
 */

const path = require('path');
const fs = require('fs');


let dir = fs.readdirSync(path.join(__dirname, './'));
const noJs = (val) => {
    return (val || '').replace(/\.js$/, '');
}
const gs = (val) => {
    val = noJs(val).split('-');
    for (let i = 0; i < val.length; i++) {
        val[i] = (val[i] || '').substring(0, 1).toUpperCase() + (val[i] || '').substring(1);
    }
    return val.join('');
}
let opt = {}
for (let i = 0; i < dir.length; i++) {
    const filename = gs(dir[i]);
    if (filename !== 'Index') {
        opt[filename] = require('./' + dir[i])
    }

}

module.exports = opt