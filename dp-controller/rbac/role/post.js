/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 09:18:25
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:15:46
 */

const { Rbac: { User, Role } } = require('dp-model');
const { Handle: { ddpError, ddpSuccess }, Logc: { noSpace, createHistory } } = require('dp-utils');
// 创建角色
exports.create = async(request, reply) => {
    let { body: data, body: { name } } = request;
    data.name = name = noSpace(name);
    if (!name) {
        return ddpError({ reply, message: '[角色名]为空!' });
    }
    try {
        const findData = await Role.find({ name });
        if (findData.length > 0) {
            return ddpError({ reply, message: '角色名已被占用' });
        }
        await Role(data).save();
        createHistory(request, '创建角色 name: ' + name)
        ddpSuccess({ reply, result: data, message: '创建角色成功' });
    } catch (err) {
        ddpError({ reply, err, message: '创建角色失败' });
    }
}


// 删除角色 datas: []
exports.del = async(request, reply) => {
    let { body: datas } = request;
    if (!datas || datas.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        let findDatas = await Role.find({ '_id': { $in: datas } });
        if (!findDatas || findDatas.length <= 0) {
            return ddpError({ reply, message: '角色不存在！' });
        }
        for (let i = 0; i < findDatas.length; i++) {
            if (findDatas[i].name === 'guest') {
                return ddpError({ reply, message: `未执行，${findDatas[i].name}角色不能删除！` });
            }
        }
        // 删除相关联表操作 start
        let res_user = await User.find({ 'role': { $in: datas } });
        if (res_user.length > 0) {
            datas.map(val => {
                res_user.map(async userVal => {
                    const index = userVal.node.indexOf(val._id || val);
                    if (index != '-1') {
                        userVal.node.splice(index, 1);
                        await userVal.save()
                    }
                })
            });
        }
        // 删除相关联表操作 end		
        await Role.remove({ '_id': { $in: datas } });
        createHistory(request, '删除角色');
        ddpSuccess({ reply, message: '角色删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '角色删除失败' });
    }
}

// 编辑角色
exports.edit = async(request, reply) => {
    let { body: data, body: { _id } } = request;
    if (!_id || _id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }
    try {
        let result = await Role.findByIdAndUpdate(_id, data, { new: true });
        createHistory(request, '修改角色 id: ' + _id);
        ddpSuccess({ reply, result, message: '角色修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '角色修改失败' });
    }
}