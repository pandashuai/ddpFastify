/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 09:12:42
 * @Last Modified by:   邓登攀
 * @Last Modified time: 2018-02-07 09:15:29
 */
const mongoose = require('dp-config/mongodb').mongoose;
const { autoIncrement } = require('mongoose-plugin-autoinc');
const mongoosePaginate = require('mongoose-paginate');

// 角色模型
const roleSchema = new mongoose.Schema({
    // 用户名
    name: { required: true, type: String },
    // 所属角色
    node: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }],
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
roleSchema.plugin(mongoosePaginate);
roleSchema.plugin(autoIncrement, {
    model: 'Role',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

// 时间更新
roleSchema.pre('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});

// 用户模型
const Role = mongoose.model('Role', roleSchema);

// export
module.exports = Role;