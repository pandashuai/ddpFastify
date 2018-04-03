/* 公共解析器 */
const config = require('dp-config')

// 0: 错误提醒， 2： 没权限
exports.ddpError = ({ code = 0, reply, message = '请求失败', err = null }) => {
    reply.send({ code, message, debug: config.DEV ? err : null });
};

exports.ddpSuccess = ({ reply, code = 1, message = '请求成功', result = null }) => {
    reply.send({ code, message, result });
};