/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 11:04:05
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-08 14:52:07
 */
const { History } = require('dp-model');
const Ip = require('./ip');


let logc = {};
logc.createHistory = async(req, content = '未知') => {
    try {
        let data = {};
        let res_ip = await Ip(req);
        data.ip = res_ip.ip;
        data.ip_location = res_ip.ip_location;
        data.user = req.ddpUser || '未知';
        data.description = content;
        await History(data).save();
    } catch (err) {}
}


logc.noSpace = (val) => {
    return (val || '').replace(/(^\s+|\s+$)/g, '');
}

module.exports = logc;