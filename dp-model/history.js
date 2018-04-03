/*
 * @Author: 邓登攀
 * @Date:   2018-02-07 09:12:42
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-08 13:45:14
 */
const mongoose = require('dp-config/mongodb').mongoose;
const { autoIncrement } = require('mongoose-plugin-autoinc');
const mongoosePaginate = require('mongoose-paginate');

// 历史记录模型
const historySchema = new mongoose.Schema({
    // 用户名
    user: { required: true, type: String },
    // IP地址
    ip: { type: String },
    // ip物理地址
    ip_location: { type: Object },
    // 描述
    description: { type: String, default: '' },
    // 发布日期
    create_at: { type: Date, default: Date.now },
    // 最后修改日期
    update_at: { type: Date, default: Date.now }
});

// 翻页 + 自增ID插件配置
historySchema.plugin(mongoosePaginate);
historySchema.plugin(autoIncrement, {
    model: 'History',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});


// 时间更新
historySchema.pre('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});


// export
module.exports = mongoose.model('history', historySchema);