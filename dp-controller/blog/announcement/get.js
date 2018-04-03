/*
 * @Author: 邓登攀
 * @Date:   2018-02-05 17:51:32
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-03-28 15:49:26
 */
const { Blog: { Announcement } } = require('dp-model');
const { Auth: { authIsVerified }, Handle: { ddpError, ddpSuccess } } = require('dp-utils');

// 列表
exports.lists = async(request, reply) => {
    let { page = 1, per_page = 10, state, keyword = '' } = request.query;

    // 过滤条件
    const options = {
        sort: { _id: -1 },
        page: Number(page),
        limit: Number(per_page)
    };

    // 查询参数
    let querys = {
        'content': new RegExp(keyword)
    };

    // 按照type查询
    if (['0', '1'].includes(state)) {
        querys.state = state;
    };

    // 如果是前台请求，则重置公开状态和发布状态
    if (!await authIsVerified(request)) {
        querys.state = 1;
    }

    try {
        let datas = await Announcement.paginate(querys, options);
        const result = {
            pagination: {
                total: datas.total,
                current_page: options.page,
                total_page: datas.pages,
                per_page: options.limit
            },
            data: datas.docs
        }
        ddpSuccess({ reply, message: '公告列表获取成功', result });
    } catch (err) {
        ddpError({ reply, err, message: '公告列表获取失败' });
    }
}