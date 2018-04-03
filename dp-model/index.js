const path = require('path');
const fs = require('fs');

const initPath = './';
let dir = fs.readdirSync(path.join(__dirname, initPath));
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
    const filename = dir[i];
    if (filename !== 'index.js') {
        if (/\.js$/.test(filename)) {
            opt[gs(dir[i])] = require(initPath + filename)
        } else {
            const childPath = `${initPath}${dir[i]}`;
            let childDir = fs.readdirSync(path.join(__dirname, childPath));
            opt[gs(dir[i])] = {};
            for (let j = 0; j < childDir.length; j++) {
                opt[gs(dir[i])][gs(childDir[j])] = require(`${childPath}/${childDir[j]}`)
            }
        }
    }
}
module.exports = opt