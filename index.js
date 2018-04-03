// 路径简化 可以少打 ../
require('app-module-path').addPath(__dirname + '/');
// 实例化fastify框架
const fastify = require('fastify')();
// 公共参数配置
const dpConfig = require('dp-config');
// 注入mongo数据库
require('dp-config/mongodb').connect();

// 注入路由
fastify.register(require('dp-route'));

// 注意！以下是注册一个用户账号用来测试，上线请删除 start
const { Rbac: { User } } = require('dp-model');
const crypto = require('crypto');
(async() => {
    try {
        let data = {
            user: 'admin',
            password: crypto.createHash('md5').update('123456').digest('hex'),
            cover: 'http://res.pandashuai.com/T1o4llXk0XXXXXXXXX.jpg'
        }
        const findUser = await User.find({ user: data.user });
        if (findUser.length > 0) {
            return console.log({ code: 0, message: '没有写入，因用户名已被占用' });
        }
        await User(data).save();
        console.log({ code: 1, message: '创建用户成功 用户: admin 密码：123456' });
    } catch (err) {
        console.log({ code: 0, message: '创建用户失败，查看mongo数据库的配置' });
    };
})();
// 注意！以下是注册一个用户账号用来测试，上线请删除 end

// 监听端口
(async() => {
    try {
        await fastify.listen(dpConfig.APP.PORT, '0.0.0.0');
        console.log(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        console.log(`server listening error`, err);
        process.exit(1)
    }
})();