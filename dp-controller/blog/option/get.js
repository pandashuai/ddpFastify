/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 11:22:16
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 14:53:12
 */
const { Handle: { handleRequest, ddpError, ddpSuccess } } = require('dp-utils');
const { Blog: { Option } } = require('dp-model');
exports.lists = async(request, reply) => {
    try {
        let result = await Option.findOne({});
        result = result || {};
        ddpSuccess({ reply, result, message: '配置项获取成功' });
    } catch (err) {
        ddpError({ reply, err, message: '配置项获取失败' });
    }
}