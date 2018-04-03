/*
 * @Author: 邓登攀
 * @Date:   2018-02-05 17:43:52
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:02:55
 */
const { History } = require('dp-model');
const { Handle: { ddpError, ddpSuccess }, Logc: { createHistory } } = require('dp-utils');
// 创建
// exports.create = async({ body: data }, res) => {
//     data.user = noSpace(data.user);
//     data.description = noSpace(data.description);
//     if (!data.user) {
//         ddpError({ res, message: '内容为空！' });
//         return false;
//     };
//     try {
//         await History(data).save();
//         ddpSuccess({ res, result: data, message: '历史记录发布成功' });
//     } catch (err) {
//         ddpError({ res, err, message: '历史记录发布失败' });
//     }
// }

// 删除
exports.del = async(request, reply) => {
    try {
        await History.remove();
        await createHistory(request, '清空了历史记录')
        ddpSuccess({ reply, message: '历史记录删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '历史记录删除失败' });
    }
}