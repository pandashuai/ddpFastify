/*
 * @Author: 邓登攀
 * @Date:   2018-02-05 17:51:32
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:32:33
 */
const { History } = require('dp-model');
const { Handle: { ddpError, ddpSuccess } } = require('dp-utils');

// 列表
exports.lists = async({ query: { page = 1, per_page = 10, keyword = '' } }, reply) => {
    // 过滤条件
    const options = {
        sort: { _id: -1 },
        page: Number(page),
        limit: Number(per_page)
    };

    // 查询参数
    let querys = {};
    if (keyword) {
        const keywordReg = new RegExp(keyword);
        querys.$or = [
            { 'user': new RegExp(keywordReg) },
            { 'description': new RegExp(keywordReg) }
        ]
    }
    try {
        let datas = await History.paginate(querys, options);
        const result = {
            pagination: {
                total: datas.total,
                current_page: options.page,
                total_page: datas.pages,
                per_page: options.limit
            },
            data: datas.docs
        }
        ddpSuccess({ reply, message: '历史记录列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '历史记录列表获取失败' });
    }
}