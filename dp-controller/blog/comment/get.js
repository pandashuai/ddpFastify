/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 16:29:18
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:30:15
 */
const { Auth: { authIsVerified }, Handle: { ddpError, ddpSuccess } } = require('dp-utils');
const { Blog: { Comment } } = require('dp-model');
// 列表
exports.lists = async(request, reply) => {
    let { sort = -1, page = 1, per_page = 88, keyword = '', post_id, state } = request.query;

    sort = Number(sort);
    state = !Object.is(state, undefined) ? Number(state) : null;
    // 过滤条件
    const options = {
        sort: { _id: sort },
        page: Number(page),
        limit: Number(per_page)
    };

    // 排序字段
    if ([1, -1].includes(sort)) {
        options.sort = { _id: sort };
    } else if (Object.is(sort, 2)) {
        options.sort = { likes: -1 };
    };

    // 查询参数
    let querys = {};

    // 查询各种状态
    if (!Object.is(state, NaN) && [-2, -1, 1, 0].includes(state)) {
        querys.state = state;
    };

    // 如果是前台请求，则重置公开状态和发布状态
    if (!await authIsVerified(request)) {
        querys.state = 1;
    };

    // 关键词查询
    if (keyword) {
        const keywordReg = new RegExp(keyword);
        querys['$or'] = [
            { 'content': keywordReg },
            { 'author.name': keywordReg },
            { 'author.email': keywordReg }
        ]
    };

    // 通过post-id过滤
    if (!Object.is(post_id, undefined)) {
        querys.post_id = post_id
    }
    try {
        let datas = await Comment.paginate(querys, options);
        const result = {
            pagination: {
                total: datas.total,
                current_page: options.page,
                total_page: datas.pages,
                per_page: options.limit
            },
            data: datas.docs
        }
        ddpSuccess({ reply, message: '评论列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '评论列表获取失败' });
    }
};
exports.find = async({ query: { id = null } }, reply) => {

    if (!id || id.length !== 24) {
        return ddpError({ reply, message: '缺少[id]参数！' });
    }

    try {
        let result = await Comment.findById(id);
        if (!result) {
            return ddpError({ reply, message: '评论不存在!' });
        }
        ddpSuccess({ reply, result, message: '评论获取成功' });
    } catch (err) {
        ddpError({ reply, err, message: '评论获取失败' });
    }
}