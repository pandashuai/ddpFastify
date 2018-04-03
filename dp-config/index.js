const argv = require('yargs').argv;
let config = {};
config.DEV = process.env.NODE_ENV === 'development' ? true : false;

// mongoDB配置
config.MONGODB = `mongodb://${argv.db_username || 'yourUser'}:${argv.db_password || 'yourPwd'}@47.95.250.195:${argv.dbport || '27017'}/ddpApi`;

// 七牛配置
config.QINIU = {
    accessKey: argv.qn_accessKey || 'your_qn_accessKey',
    secretKey: argv.qn_secretKey || 'your_qn_secretKey',
    bucket: argv.qn_bucket || 'your_qn_bucket',

};

// 验证权限的key
config.AUTH = {
    jwtTokenSecret: argv.auth_key || 'your_auth_key',
    keyname: 'pandashuai'
};
// 百度推送
config.BAIDU = {
    site: argv.baidu_site || 'your_site',
    token: argv.baidu_token || 'your_token'
};

// 阿里云-IP查询
config.ALIYUN = {
    ip: argv.aliyun_ip_auth || 'your_key'
};

// 垃圾评论过滤
config.AKISMET = {
    key: argv.akismet_key || 'your_key',
    blog: argv.akismet_blog || 'your_blog'
};

// 
config.APP = {
    ROOT_PATH: __dirname,
    LIMIT: 16,
    PORT: 8001
};

// 首页信息
config.INFO = {
    name: 'Api服务',
    version: '1.2.0',
    author: '邓登攀',
    age: '95后',
    skill: 'WEB, Node开发人员',
    like: '编程,宅在家',
    site: 'http://blog.pandashuai.com',
    github: 'https://github.com/pandashuai',
    mail: '1663998104@qq.com',
    cover: 'http://res.pandashuai.com/T1o4llXk0XXXXXXXXX.jpg',
    powered: ['Nodejs', 'Express', 'MongoDB', 'Nuxt.js', 'Vue', 'Html', 'Js', 'Css', 'Nginx'],
    content: ''
};

module.exports = config