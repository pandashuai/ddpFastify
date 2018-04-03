/*
 * @Author: 邓登攀
 * @Date:   2018-02-05 11:56:22
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:36:13
 */

const { Rbac: { User } } = require('dp-model');
const { Handle: { ddpError, ddpSuccess } } = require('dp-utils');
exports.lists = async({ query: { page = 1, per_page = 10, state = null, keyword = '' } }, reply) => {
    // 过滤条件
    const options = {
        sort: { _id: 1 },
        page: Number(page),
        limit: Number(per_page),
        populate: 'role'
    };

    // 查询参数
    let querys = {
        'user': new RegExp(keyword)
    };

    // 按照type查询
    if (['0', '1'].includes(state)) {
        querys.state = state;
    };
    try {
        let users = await User.paginate(querys, options);
        const result = {
            pagination: {
                total: users.total,
                current_page: options.page,
                total_page: users.pages,
                per_page: options.limit
            },
            data: users.docs
        }
        ddpSuccess({ reply, message: '用户列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '用户列表获取失败' });
    }
}


exports.find = async({ query: { id = null } }, reply) => {

    if (!id || id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }

    try {
        let result = await User.findById(id).populate('role');
        if (!result) {
            return ddpError({ reply, message: '没有该用户存在！' });
        }
        result.password = '';
        delete result.update_at;
        ddpSuccess({ reply, result, message: '获取该用户成功' });
    } catch (err) {
        ddpError({ reply, err, message: '用户获取失败' });
    }
}