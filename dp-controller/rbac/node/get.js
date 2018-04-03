/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 10:25:40
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:34:01
 */

const { Handle: { ddpError, ddpSuccess } } = require('dp-utils');
const { Rbac: { Node } } = require('dp-model');
exports.lists = async({ query: { page = 1, per_page = 10, state = null, keyword = '', method = '', classname = '' } }, reply) => {
    // 过滤条件
    const options = {
        sort: { _id: 1 },
        page: Number(page),
        limit: Number(per_page)
    };

    // 查询参数
    const expreg = new RegExp(keyword);
    let querys = {
        '$or': [{
            'name': expreg
        }, {
            'route': expreg
        }],
        'method': new RegExp(method),
        'classname': new RegExp(classname)
    };
    // 按照type查询
    if (['0', '1'].includes(state)) {
        querys.state = state;
    };

    try {
        let datas = await Node.paginate(querys, options);
        const result = {
            pagination: {
                total: datas.total,
                current_page: options.page,
                total_page: datas.pages,
                per_page: options.limit
            },
            data: datas.docs
        }
        ddpSuccess({ reply, message: '权限列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '权限列表获取失败' });
    }
}


exports.find = async({ query: { id = null } }, reply) => {
    if (!id || id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }

    try {
        let result = await Node.findById(id);
        if (!result) {
            return ddpError({ reply, message: '没有该权限存在！' });
        }
        delete result.update_at;
        ddpSuccess({ reply, result, message: '获取该权限成功' });
    } catch (err) {
        ddpError({ reply, err, message: '权限获取失败' });
    }
}


exports.nodeclass = async(request, reply) => {
    try {
        let result = await Node.aggregate([{ $group: { _id: "$classname" } }]);
        result = result.map(val => val._id);
        ddpSuccess({ reply, result, message: '获取权限分类成功' });
    } catch (err) {
        ddpError({ reply, err, message: '获取权限分类失败' });
    }
}