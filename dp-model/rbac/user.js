/*
 * @Author: 邓登攀
 * @Date:   2018-01-29 14:22:44
 * @Last Modified by:   邓登攀
 * @Last Modified time: 2018-02-05 10:22:10
 */


const mongoose = require('dp-config/mongodb').mongoose;
const { autoIncrement } = require('mongoose-plugin-autoinc');
const mongoosePaginate = require('mongoose-paginate');

// 用户模型
const userSchema = new mongoose.Schema({
    // 用户名
    user: { required: true, type: String },
    // 密码
    password: { required: true, type: String },
    // 所属角色
    role: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    // 头像
    cover: { type: String, default: '' },
    // 描述
    description: { type: String, default: '' },
    // 状态 0：不启用 1启用
    state: { type: Number, default: 1 },
    // 发布日期
    create_at: { type: Date, default: Date.now },
    // 最后修改日期
    update_at: { type: Date, default: Date.now }
});

// 翻页 + 自增ID插件配置
userSchema.plugin(mongoosePaginate);
userSchema.plugin(autoIncrement, {
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

// 时间更新
userSchema.pre('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});

// 用户模型
const User = mongoose.model('User', userSchema);

// export
module.exports = User;