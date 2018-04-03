/*
 *
 * 七牛控制器
 *
 */

const qn = require('qn');
const config = require('dp-config');
const { Handle: { handleRequest, ddpError, ddpSuccess }, Logc: { createHistory } } = require('dp-utils');
const qiniuCtrl = {};
const qiniu = qn.create({
    accessKey: config.QINIU.accessKey,
    secretKey: config.QINIU.secretKey,
    bucket: config.QINIU.bucket
})

exports.uptoken = (request, reply) => {
    return ddpSuccess({ reply, message: '七牛token获取成功', result: qiniu.uploadToken() })
}
exports.lists = ({ query: data }, reply) => {
    data.bucket = data.bucket || config.QINIU.bucket;
    data.prefix = data.prefix || '/'
    qiniu.list({
        bucket: config.QINIU.bucket,
        delimiter: '/',
        prefix: data.prefix,
    }, function(err, data, dd) {
        if (err) {
            return ddpError({ reply, err, message: '七牛列表获取失败' })
        }
        result = data;
        return ddpSuccess({ reply, message: '七牛列表获取成功', result })
    })
}
exports.del = (request, reply) => {
    let { body: data, body: { filename } } = request;
    if (!filename) {
        return ddpError({ reply, err, message: '缺少有效参数' })
    }
    qiniu.delete(filename, function(err, data) {
        if (err) {
            return ddpError({ reply, err, message: '资源删除失败' })
        }
        createHistory(request, '删除七牛资源')
        return ddpSuccess({ reply, message: '资源删除成功' })
    })
}