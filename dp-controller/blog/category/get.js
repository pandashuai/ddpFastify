/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 09:40:27
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:30:37
 */
const { Handle: { ddpError, ddpSuccess } } = require('dp-utils');
const { Blog: { Category } } = require('dp-model');
// 列表
exports.lists = async({ query: { page = 1, per_page = 10, keyword = '' } }, reply) => {
    // 过滤条件
    const options = {
        sort: { _id: 1 },
        page: Number(page),
        limit: Number(per_page)
    };

    const keywordReg = new RegExp(keyword);
    let querys = {
        "$or": [
            { 'name': keywordReg },
            { 'slug': keywordReg },
            { 'description': keywordReg }
        ]
    };
    try {
        let datas = await Category.paginate(querys, options);
        const result = {
            pagination: {
                total: datas.total,
                current_page: options.page,
                total_page: datas.pages,
                per_page: options.limit
            },
            data: datas.docs
        }
        ddpSuccess({ reply, message: '分类列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '分类列表获取失败' });
    }
}


exports.find = async({ query: { id = null } }, reply) => {
    if (!id || id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }

    try {
        let result = await Category.findById(id);
        if (!result) {
            return ddpError({ reply, message: '分类不存在!' });
        }
        delete result.update_at;
        ddpSuccess({ reply, result, message: '分类获取成功' });
    } catch (err) {
        ddpError({ reply, err, message: '分类获取失败' });
    }
}