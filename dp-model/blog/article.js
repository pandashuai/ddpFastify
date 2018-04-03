/*
 *
 * 文章数据模型
 *
 */

const mongoose = require('dp-config/mongodb').mongoose;
const { autoIncrement } = require('mongoose-plugin-autoinc');
const mongoosePaginate = require('mongoose-paginate');

// 文章模型
const articleSchema = new mongoose.Schema({

    // 文章标题
    title: { type: String, required: true, validate: /\S+/ },

    // 文章关键字（SEO）
    keywords: [{ type: String }],

    // 文章描述
    description: String,

    // 文章内容
    content: { type: String, required: true, validate: /\S+/ },

    // 缩略图
    thumb: String,

    // 文章发布状态 => -1回收站，0草稿，1已发布
    state: { type: Number, default: 1 },
    
    // 发布日期
    create_at: { type: Date, default: Date.now },

    // 最后修改日期
    update_at: { type: Date, default: Date.now },

    // 文章标签
    tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

    // 文章分类
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],

    // 其他元信息
    meta: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 }
    },

    // 自定义扩展
    extends: [{
        name: { type: String, validate: /\S+/ },
        value: { type: String, validate: /\S+/ }
    }]
});

articleSchema.set('toObject', { getters: true });

// 翻页 + 自增ID插件配置
articleSchema.plugin(mongoosePaginate)
articleSchema.plugin(autoIncrement, {
    model: 'Article',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

// 时间更新
articleSchema.pre('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: Date.now() });
    next();
});

// 列表时用的文章内容虚拟属性
articleSchema.virtual('t_content').get(function() {
    const content = this.content;
    return !!content ? content.substring(0, 130) : content;
});

// 文章模型
const Article = mongoose.model('Article', articleSchema);

// export
module.exports = Article;