/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 14:13:36
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:55:05
 */

const { Auth: { authIsVerified }, Handle: { ddpError, ddpSuccess } } = require('dp-utils');
const { Blog: { Article, Tag, Category } } = require('dp-model');
// 列表
exports.lists = async(request, reply) => {
    let { page = 1, per_page = 10, state = null, keyword = '', category, category_slug = null, tag, tag_slug = null, date, hot } = request.query;

    // 过滤条件
    const options = {
        sort: { _id: -1 },
        page: Number(page || 1),
        limit: Number(per_page || 10),
        populate: ['category', 'tag'],
        select: '-password -content'
    };

    // 查询参数
    let querys = {};

    // 按照state查询
    if (['0', '1', '-1'].includes(state)) {
        querys.state = state;
    };



    // 关键词查询
    if (keyword) {
        const keywordReg = new RegExp(keyword);
        querys['$or'] = [
            { 'title': keywordReg },
            { 'content': keywordReg },
            { 'description': keywordReg }
        ]
    };
    // 标签id查询
    if (tag) {
        querys.tag = tag;
    };

    // 分类id查询
    if (category) {
        querys.category = category;
    };

    // 热评查询
    if (!!hot) {
        options.sort = {
            'meta.comments': -1,
            'meta.likes': -1
        };
    };

    // 时间查询

    if (date) {
        const getDate = new Date(date);
        if (!Object.is(getDate.toString(), 'Invalid Date')) {
            querys.create_at = {
                "$gte": new Date((getDate / 1000 + 60 * 60 * 8) * 1000),
                "$lt": new Date((getDate / 1000 + 60 * 60 * 32) * 1000)
            };
        }
        // console.log(querys.create_at, 3333333)
    };

    // 如果是前台请求，则重置公开状态和发布状态
    if (!await authIsVerified(request)) {
        querys.state = 1;
    };

    try {
        // 分类别名查询 - 根据别名查询到id，然后根据id查询
        if (category_slug) {
            let category = await Category.find({ slug: category_slug })
            if (!category || category.length <= 0) {
                return ddpError({ reply, message: '分类不存在' });
            }
            querys.category = category[0]._id;
        };
        // 标签别名查询 - 根据别名查询到id，然后根据id查询
        if (tag_slug) {
            let tag = await Tag.find({ slug: tag_slug })
            if (!tag || tag.length <= 0) {
                return ddpError({ reply, message: '标签不存在' });
            }
            querys.tag = tag[0]._id;
        };
        let datas = await Article.paginate(querys, options);
        const result = {
            pagination: {
                total: datas.total,
                current_page: options.page,
                total_page: datas.pages,
                per_page: options.limit
            },
            data: datas.docs
        }
        ddpSuccess({ reply, message: '文章列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '文章列表获取失败' });
    }
}


exports.find = async({ query: { id = null } }, reply) => {
    const isId = Object.is(Number(id), NaN);
    try {
        let findData = [];
        if (isId) {
            findData = await Article.findById(id).populate('category tag');

        } else {
            findData = await Article.findOne({ id: id, state: 1 }).populate('category tag').exec();
            findData.meta.views += 1;
            await findData.save();
        }

        if (!isId && findData.tag.length) {
            let result = await Article.find({ state: 1, tag: { $in: findData.tag.map(t => t._id) } }, 'id title description thumb -_id');
            findData.related = result;
        }

        ddpSuccess({ reply, result: findData, message: '文章获取成功' });
    } catch (err) {
        ddpError({ reply, err, message: '标签获取失败' });
    }
}