/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 09:14:20
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 14:59:07
 */

const { Handle: { ddpError, ddpSuccess }, Logc: { noSpace, createHistory }, BaiduSeoPush: { baiduSeoPush, baiduSeoUpdate, baiduSeoDelete } } = require('dp-utils');
const { Blog: { Tag } } = require('dp-model');
const config = require('dp-config')
    // 创建
exports.create = async(request, reply) => {
    let { body: data, body: { slug } } = request;
    data.slug = slug = noSpace(slug)
    data.name = noSpace(data.name)
    if (slug == undefined || slug == null) {
        return ddpError({ reply, message: '缺少slug' });
    };
    try {
        let findData = await Tag.find({ slug });
        if (findData && findData.length > 0) {
            return ddpError({ reply, message: 'slug已被占用' })
        }
        await Tag(data).save();
        baiduSeoPush(`${config.INFO.site}/tag/${data.slug}`)
        createHistory(request, '创建标签 name: ' + data.name)
        ddpSuccess({ reply, result: data, message: '标签发布成功' });
    } catch (err) {
        ddpError({ reply, err, message: '标签发布失败' });
    }
}

// 删除
exports.del = async(request, reply) => {
    let { body: datas } = request;
    if (!datas || datas.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        await Tag.remove({ '_id': { $in: datas } });
        let urls = datas.map(val => `${config.INFO.site}/tag/${val.slug}`).join('\n');
        baiduSeoDelete(urls);
        createHistory(request, '删除标签');
        ddpSuccess({ reply, message: '标签删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '标签删除失败' });
    }
}


// 编辑
exports.edit = async(request, reply) => {
    let { body: data, body: { _id, slug } } = request;
    if (!_id || _id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }
    if (!slug) {
        return ddpError({ reply, message: 'slug不允许为空！' });
    };
    try {
        let findData = await Tag.find({ slug });
        if (findData && findData.length > 0 && _id != findData[0]._id) {
            return ddpError({ reply, message: 'slug已被占用' })
        }
        let result = await Tag.findByIdAndUpdate(_id, data, { new: true });
        baiduSeoUpdate(`${config.INFO.site}/tag/${slug}`)
        createHistory(request, '修改标签 id: ' + _id);
        ddpSuccess({ reply, result, message: '标签修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '标签修改失败' });
    }
}