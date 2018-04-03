/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 09:12:42
 * @Last Modified by:   邓登攀
 * @Last Modified time: 2018-02-09 10:35:28
 */
const mongoose = require('dp-config/mongodb').mongoose;
const { autoIncrement } = require('mongoose-plugin-autoinc');
const mongoosePaginate = require('mongoose-paginate');

// 权限模型
const nodeSchema = new mongoose.Schema({
    // 权限名
    name: { required: true, type: String },
    // 所属分类
    classname: { required: true, type: String },
    // 权限路由
    route: { required: true, type: String },
    // 请求方法
    method: { required: true, type: String },
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
nodeSchema.plugin(mongoosePaginate);
nodeSchema.plugin(autoIncrement, {
    model: 'Node',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});


// 时间更新
nodeSchema.pre('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});


// 用户模型
const Node = mongoose.model('Node', nodeSchema);

// export
module.exports = Node;