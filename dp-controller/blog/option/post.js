/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 11:30:14
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 14:53:46
 */
const { Handle: { handleRequest, ddpError, ddpSuccess }, Logc: { createHistory } } = require('dp-utils');
const { Blog: { Option } } = require('dp-model');
exports.edit = async(request, reply) => {
    let { body: data, body: { _id = null } } = request;
    if (!_id) delete data._id;
    // 检测黑名单和ping地址列表不能存入空元素
    data.ping_sites = (data.ping_sites || []).filter(t => !!t);
    data.blacklist.ips = (data.blacklist.ips || []).filter(t => !!t);
    data.blacklist.mails = (data.blacklist.mails || []).filter(t => !!t);
    data.blacklist.keywords = (data.blacklist.keywords || []).filter(t => !!t);
    try {
        if (!!_id) {
            await Option.findByIdAndUpdate(_id, data, { new: true })
        } else {
            await new Option(data).save()
        }
        createHistory(request, '修改配置项')
        ddpSuccess({ reply, result: data, message: '配置项修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '配置项修改失败' });
    }
}