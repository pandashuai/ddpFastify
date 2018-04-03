/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 09:16:36
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:34:41
 */


const { Rbac: { Role } } = require('dp-model');
const { Handle: { ddpError, ddpSuccess } } = require('dp-utils');
exports.lists = async({ query: { page = 1, per_page = 10, state = null, keyword = '' } }, reply) => {

    // 过滤条件
    const options = {
        sort: { _id: 1 },
        page: Number(page),
        limit: Number(per_page),
        populate: 'node'
    };

    // 查询参数
    let querys = {
        'name': new RegExp(keyword)
    };

    // 按照type查询
    if (['0', '1'].includes(state)) {
        querys.state = state;
    };
    try {
        let datas = await Role.paginate(querys, options);
        const result = {
            pagination: {
                total: datas.total,
                current_page: options.page,
                total_page: datas.pages,
                per_page: options.limit
            },
            data: datas.docs
        }
        ddpSuccess({ reply, message: '角色列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '角色列表获取失败' });
    }
}


exports.find = async({ query: { id = null } }, reply) => {

    if (!id || id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }

    try {
        let result = await Role.findById(id);
        if (!result) {
            return ddpError({ reply, message: '没有该角色存在！' });
        }
        result.password = '';
        delete result.update_at;
        ddpSuccess({ reply, result, message: '获取该角色成功' });
    } catch (err) {
        ddpError({ reply, err, message: '角色获取失败' });
    }
}