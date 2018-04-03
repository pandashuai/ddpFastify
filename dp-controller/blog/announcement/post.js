/*
 * @Author: 邓登攀
 * @Date:   2018-02-05 17:43:52
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 18:16:14
 */
const { Blog: { Announcement } } = require('dp-model');
const { Handle: { ddpError, ddpSuccess }, Logc: { noSpace, createHistory } } = require('dp-utils');
// 创建
exports.create = async(request, reply) => {
    let { body: data } = request;
    data.content = noSpace(data.content);
    if (!data.content) {
        ddpError({ reply, message: '内容为空！' });
        return false;
    };
    try {
        await Announcement(data).save();
        createHistory(request, '创建公告');
        ddpSuccess({ reply, result: data, message: '公告发布成功' });
    } catch (err) {
        ddpError({ reply, err, message: '公告发布失败' });
    }
}

// 删除
exports.del = async(request, reply) => {
    let { body: datas } = request;
    if (!datas || datas.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        await Announcement.remove({ '_id': { $in: datas } });
        createHistory(request, '删除公告');
        ddpSuccess({ reply, message: '公告删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '公告删除失败' });
    }
}


// 编辑
exports.edit = async(request, res) => {
    let { body: data, body: { _id } } = request;
    if (!_id || _id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }
    data.content = noSpace(data.content);
    if (!data.content) {
        ddpError({ reply, message: '内容为空！' });
        return false;
    };
    try {
        let result = await Announcement.findByIdAndUpdate(_id, data, { new: true });
        createHistory(request, '修改公告->id:' + _id);
        ddpSuccess({ reply, result, message: '公告修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '公告修改失败' });
    }
}