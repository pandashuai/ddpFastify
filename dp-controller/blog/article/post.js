/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 13:30:19
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 14:41:30
 */
const { Handle: { handleRequest, ddpError, ddpSuccess }, Logc: { noSpace, createHistory }, BaiduSeoPush: { baiduSeoPush, baiduSeoUpdate, baiduSeoDelete } } = require('dp-utils');
const { Blog: { Article } } = require('dp-model');
const config = require('dp-config')
    // 创建
exports.create = async(request, reply) => {
    let { body: data } = request;
    data.title = noSpace(data.title);
    data.content = noSpace(data.content);
    // 验证
    if (!data.title || !data.content) {
        return ddpError({ reply, message: '[标题|内容]不允许为空' });
    };
    try {
        const result = await Article(data).save();
        createHistory(request, '创建文章 title: ' + data.title);
        if (data.state === 1) {
            baiduSeoPush(`${config.INFO.site}/article/${result.id}`)
        }
        ddpSuccess({ reply, result: data, message: '文章发布成功' });
    } catch (err) {
        ddpError({ reply, err, message: '文章发布失败' });
    }
}

// 删除
exports.del = async(request, reply) => {
    let { body: datas } = request;
    if (!datas || datas.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        await Article.remove({ '_id': { $in: datas } });
        let urls = datas.map(val => `${config.INFO.site}/article/${val.id}`).join('\n');
        // 删除百度推送相应的文章
        baiduSeoDelete(urls);
        createHistory(request, '删除文章');
        ddpSuccess({ reply, message: '文章删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '文章删除失败' });
    }
}


// 编辑
exports.edit = async(request, reply) => {
    let { body: data, body: { _id } } = request;
    if (!_id || _id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }
    data.title = noSpace(data.title);
    data.content = noSpace(data.content);
    if (!data.title || !data.content) {
        return ddpError({ reply, message: '内容不合法' });
    };
    // 修正信息
    delete data.meta
    delete data.create_at
    delete data.update_at
    try {
        let result = await Article.findByIdAndUpdate(_id, data, { new: true });
        if (data.state === 1) {
            baiduSeoUpdate(`${config.INFO.site}/article/${result.id}`)
        } else {
            baiduSeoDelete(`${config.INFO.site}/article/${result.id}`);
        }
        createHistory(request, '修改文章 id:' + _id)
        ddpSuccess({ reply, result, message: '文章修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '文章修改失败' });
    }
}

// // 修改文章状态
// exports.status = async(request, reply) => {
// let { body: { datas, state } } = request;
//     if (!datas || !datas.length || Object.is(state, null) || Object.is(state, NaN) || ![0, 1, -1].includes(state)) {
//         return ddpError({ reply, message: '缺少有效参数或参数无效' });
//     };
//     try {
//         let result = await Article.update({ '_id': { $in: datas } }, { $set: { state } }, { multi: true })
// createHistory(request, '修改文章状态');
//         ddpSuccess({ reply, result, message: '修改文章状态操作成功' });
//     } catch (err) {
//         ddpError({ reply, err, message: '修改文章状态操作失败' });
//     }
// }