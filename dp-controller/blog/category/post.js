/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 09:40:20
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 14:44:16
 */
const { Handle: { ddpError, ddpSuccess }, Logc: { noSpace, createHistory }, BaiduSeoPush: { baiduSeoPush, baiduSeoUpdate, baiduSeoDelete } } = require('dp-utils');
const { Blog: { Category } } = require('dp-model');
const config = require('dp-config')
    // 创建
exports.create = async(request, reply) => {
    let { body: data, body: { slug } } = request;
    data.slug = slug = noSpace(slug)
    data.name = noSpace(data.name)
    if (slug == undefined || slug == null || !slug) {
        return ddpError({ reply, message: '缺少slug' });
    };
    try {
        let findData = await Category.find({ slug });
        if (findData && findData.length > 0) {
            return ddpError({ reply, message: 'slug已被占用' })
        }
        await Category(data).save();
        baiduSeoPush(`${config.INFO.site}/category/${data.slug}`)
        createHistory(request, '创建分类 name: ' + data.name);
        ddpSuccess({ reply, result: data, message: '分类发布成功' });
    } catch (err) {
        ddpError({ reply, err, message: '分类发布失败' });
    }
}

// 删除
exports.del = async(request, reply) => {
    let { body: datas } = request;
    if (!datas || datas.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        await Category.remove({ '_id': { $in: datas } });
        let urls = datas.map(val => `${config.INFO.site}/category/${val.slug}`).join('\n');
        baiduSeoDelete(urls);
        createHistory(request, '删除分类');
        ddpSuccess({ reply, message: '分类删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '分类删除失败' });
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
        let findData = await Category.find({ slug });
        // console.log(findData, 99)
        if (findData && findData.length > 0 && _id != findData[0]._id) {
            return ddpError({ reply, message: 'slug已被占用' })
        }
        let result = await Category.findByIdAndUpdate(_id, data, { new: true });
        baiduSeoUpdate(`${config.INFO.site}/category/${slug}`)
        createHistory(request, '修改分类 id:' + _id);
        ddpSuccess({ reply, result, message: '分类修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '分类修改失败' });
    }
}

// 修改is_nav状态
exports.navStatus = async(request, reply) => {
    let { body: { datas, state } } = request;
    state = Object.is(state, undefined) ? null : Number(state);
    if (!datas || !datas.length || Object.is(state, null) || Object.is(state, NaN) || ![0, 1].includes(state)) {
        return ddpError({ reply, message: '缺少有效参数或参数无效' });
    };
    try {
        let result = await Category.update({ '_id': { $in: datas } }, { $set: { is_nav: state } }, { multi: true })
        createHistory(request, '修改分类is_nav状态');
        ddpSuccess({ reply, result, message: '修改is_nav状态操作成功' });
    } catch (err) {
        ddpError({ reply, err, message: '修改is_nav状态操作失败' });
    }
}