/*
 * @Author: 邓登攀
 * @Date:   2018-02-26 14:34:20
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:05:14
 */

const config = require('dp-config')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Handle: { ddpError, ddpSuccess }, Auth: { authIsVerified }, Logc: { createHistory } } = require('dp-utils');
const { Rbac: { User }, History } = require('dp-model');
module.exports.login = async(request, reply) => {
    let { user, password } = request.body;
    try {
        const data = await User.findOne({ user, password: crypto.createHash('md5').update(password).digest('hex'), state: 1 })
        if (data) {
            const token = jwt.sign({
                data: {
                    user: data.user,
                    password: data.password
                },
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 1)
            }, config.AUTH.jwtTokenSecret);
            request.ddpUser = data.user;
            createHistory(request, '登陆成功 user: ' + data.user);
            ddpSuccess({ reply, result: { token }, code: 3, message: '登陆成功' });
        } else {
            ddpError({ reply, message: '来者何人!' });
        }
    } catch (err) {
        console.log(err)
        ddpError({ reply, err, message: '登录失败' });
    }

};

// module.exports.auth = ()
module.exports.auth = async(request, reply) => {
    try {
        let result = await authIsVerified(request);
        if (!result) {
            return ddpError({ reply, message: '验证失败' });
        }
        return ddpSuccess({ reply, result, code: 3, message: '验证成功' });
    } catch (err) {
        ddpError({ reply, err, message: '验证失败' });
    }
};