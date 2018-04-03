/*
 * @Author: 邓登攀
 * @Date:   2018-02-05 09:31:40
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-04-03 09:51:10
 */

const { Rbac: { User } } = require('dp-model');
const { Handle: { ddpError, ddpSuccess }, Logc: { noSpace, createHistory } } = require('dp-utils');
const crypto = require('crypto');
// 创建用户
exports.create = async(request, reply) => {
    let { body: data, body: { user, password } } = request;
    data.user = user = noSpace(user);
    data.password = password = noSpace(password);
    if (!user || !password) {
        return ddpError({ reply, message: '[用户名|密码]为空!' });
    }
    try {
        const findUser = await User.find({ user });
        if (findUser.length > 0) {
            return ddpError({ reply, message: '用户名已被占用' });
        }
        data.password = crypto.createHash('md5').update(password || '123456').digest('hex')
        await User(data).save();
        createHistory(request, '创建用户 user: ' + user)
        ddpSuccess({ reply, result: data, message: '创建用户成功' });
    } catch (err) {
        ddpError({ reply, err, message: '创建用户失败' });
    }
}


// 删除用户 users: []
exports.del = async(request, reply) => {
    let { body: users } = request;
    if (!users || users.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        let findUsers = await User.find({ '_id': { $in: users } });
        if (!findUsers || findUsers.length <= 0) {
            return ddpError({ reply, message: '用户不存在！' });
        }
        for (let i = 0; i < findUsers.length; i++) {
            if (findUsers[i].user === 'admin') {
                return ddpError({ reply, message: `未执行，${findUsers[i].user}用户不能删除！` });
            }
        }
        await User.remove({ '_id': { $in: users } });
        createHistory(request, '删除用户');
        ddpSuccess({ reply, message: '用户删除成功' });
    } catch (err) {
        ddpError({ reply, err, message: '用户删除失败' });
    }
}

// 编辑用户
exports.edit = async(request, reply) => {
    let { body: user, body: { _id, password } } = request;
    if (!_id || _id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }
    try {
        if (password) {
            user.password = crypto.createHash('md5').update(password).digest('hex')
        } else {
            delete user.password
        }
        let result = await User.findByIdAndUpdate(_id, user, { new: true });
        createHistory(request, '修改用户 id: ' + _id);
        ddpSuccess({ reply, result, message: '用户修改成功' });
    } catch (err) {
        ddpError({ reply, err, message: '用户修改失败' });
    }
}