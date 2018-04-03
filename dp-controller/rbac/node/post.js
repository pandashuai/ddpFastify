/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 09:18:25
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:12:28
 */

const { Rbac: { Node, Role } } = require('dp-model');
const { Handle: { ddpError, ddpSuccess }, Logc: { noSpace, createHistory } } = require('dp-utils');
// 创建权限
exports.create = async(request, reply) => {
    let { body: data } = request;
    data.name = noSpace(data.name);
    data.classname = noSpace(data.classname);
    data.route = noSpace(data.route);
    data.method = noSpace(data.method);
    let { name, classname, route, method } = data;
    if (!name || !classname || !route || !method) {
        return ddpError({ reply, message: '[权限名|所属分类|权限路由|方法名]为空!' });
    }

    try {
        const findData = await Node.find({ route: data.route, method: data.method });
        if (findData.length > 0) {
            return ddpError({ reply, message: '该节点已被占用' });
        }
        await Node(data).save();
        createHistory(request, '创建权限 rotue: ' + data.route + ' method: ' + data.method);
        ddpSuccess({ reply, result: data, message: '创建权限成功' });
    } catch (err) {
        ddpError({ reply, err, message: '创建权限失败' });
    }
}


// 删除权限 datas: []
exports.del = async(request, reply) => {
    let { body: datas } = request;
    if (!datas || datas.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        // 删除相关联表操作 start
        let res_role = await Role.find({ 'node': { $in: datas } });
        if (res_role.length > 0) {
            datas.map(val => {
                res_role.map(async roleVal => {
                    const index = roleVal.node.indexOf(val._id || val);
                    if (index != '-1') {
                        roleVal.node.splice(index, 1);
                        await roleVal.save()
                    }
                })
            });
        }
        // 删除相关联表操作 end
        await Node.remove({ '_id': { $in: datas } });
        createHistory(request, '删除权限');
        ddpSuccess({ reply, message: '权限删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '权限删除失败' });
    }
}

// 编辑权限
exports.edit = async(request, reply) => {
    let { body: data, body: { _id } } = request;
    if (!_id || _id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }
    try {
        let result = await Node.findByIdAndUpdate(_id, data, { new: true });
        createHistory(request, '修改权限 id:' + _id);
        ddpSuccess({ reply, result, message: '权限修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '权限修改失败' });
    }
}