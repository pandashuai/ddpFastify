/*
 * @Author: 邓登攀
 * @Date:   2018-02-06 13:30:19
 * @Last Modified by: 邓登攀
 * @Last Modified time: 2018-04-03 10:46:45
 */
const geoip = require('geoip-lite');
const config = require('dp-config');
const { Handle: { handleRequest, ddpError, ddpSuccess }, Auth, Akismet: { akismetClient }, Ip, Logc: { noSpace, createHistory } } = require('dp-utils');
const { Blog: { Comment, Article, Option } } = require('dp-model');
// 创建
exports.create = async(request, reply) => {
    let { body: data } = request;
    data.author.name = noSpace(data.author.name);
    data.author.email = noSpace(data.author.email);
    data.author.site = noSpace(data.author.site);
    if (!data.author.name || !data.author.email) {
        ddpError({ reply, message: '发表失败！[姓名|邮箱]不允为空！' });
    }
    const siteReg = /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    const emailReg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (data.author.site && /\S+/.test(data.author.site)) {
        ddpError({ reply, message: '发表失败！填写的[链接]格式不对！' });
    }
    if (!emailReg.test(data.author.email)) {
        ddpError({ reply, message: '发表失败！填写的[邮箱]格式不对！' });
    }
    if (!/\S+/.test(data.author.name)) {
        ddpError({ reply, message: '发表失败！填写的[姓名]格式不对！' });
    }
    // 查询IP
    let res_ip = await Ip(request);

    data.ip = res_ip.ip;
    data.ip_location = res_ip.ip_location;

    data.likes = 0;
    data.is_top = false;
    data.agent = request.headers['user-agent'] || data.agent;
    const permalink = config.INFO.site + (Object.is(data.post_id, 0) ? '/guestbook' : `/article/${data.post_id}`);
    try {
        await akismetClient.checkSpam({
            user_ip: data.ip,
            user_agent: data.agent,
            referrer: request.headers.referer,
            permalink,
            comment_type: 'comment',
            comment_author: data.author.name,
            comment_author_email: data.author.email,
            comment_author_url: data.author.site,
            comment_content: data.content,
            is_test: config.DEV
                // 使用设置的黑名单ip/邮箱/关键词过滤
        });
        let res_option = await Option.findOne();
        const { keywords, mails, ips } = res_option.blacklist;
        if (ips.includes(data.ip)) {
            return ddpError({ reply, message: '发布失败![ip]已列入黑名单' });
        }
        if (mails.includes(data.author.email)) {
            return ddpError({ reply, message: '发布失败![邮箱]已列入黑名单' });
        }
        if (keywords.length && eval(`/${keywords.join('|')}/ig`).test(data.content)) {
            return ddpError({ reply, message: '发布失败![内容]里面可能涉及非法信息！' });
        }
        await Comment(data).save();
        ddpSuccess({ reply, result: data, message: '评论发布成功' });
        updateArticleCommentCount([data.post_id])
    } catch (err) {
        ddpError({ reply, err, message: '评论发布失败！未知错误' });
    }
}

// 删除
exports.del = async(request, reply) => {
    let { body: datas } = request;
    if (!datas || datas.length <= 0) {
        return ddpError({ reply, message: '缺少有效参数' });
    };
    try {
        await Comment.remove({ '_id': { $in: datas } });
        createHistory(request, '删除评论')
        ddpSuccess({ reply, message: '评论删除成功' });
        let postIds = [];
        datas.map(val => {
            if (postIds.indexOf(val.post_id) == '-1') postIds.push(val.post_id);
        });
        if (postIds > 0) {
            updateArticleCommentCount(postIds);
        }
    } catch (err) {
        ddpError({ reply, err, message: '评论删除成功' });
    }
}


// 编辑
// exports.edit = async(request, reply) => {
//     let { body: data, body: { _id } } = request;
//     if (!_id || _id.length !== 24) {
//         return ddpError({ reply, message: '缺少[id]参数！' });
//     }
//     try {
//         let result = await Comment.findByIdAndUpdate(_id, data, { new: true });
//         createHistory(request, '修改评论 id:' + _id);
//         ddpSuccess({ reply, result, message: '评论修改成功' });
//         if (data.post_id) {
//             updateArticleCommentCount([data.post_id]);
//         }

//     } catch (err) {
//         ddpError({ reply, err, message: '评论修改失败' });
//     }
// }

// 修改评论状态
exports.status = async(request, reply) => {
    let { body: { datas, state } } = request;
    state = Object.is(state, undefined) ? null : Number(state);
    // 验证 comments0待审核/1通过正常/-1已删除/-2垃圾评论
    if (!datas || !datas.length || Object.is(state, null) || Object.is(state, NaN) || ![-1, -2, 0, 1].includes(state)) {
        ddpError({ reply, message: '缺少有效参数或参数无效' });
        return false;
    };
    try {
        let result = await Comment.update({ '_id': { $in: datas } }, { $set: { state } }, { multi: true });
        createHistory(request, '修改评论状态');
        ddpSuccess({ reply, result, message: '修改评论状态操作成功' });
        let postIds = [];
        datas.map(val => {
            if (postIds.indexOf(val.post_id) == '-1') postIds.push(val.post_id);
        });
        if (postIds > 0) {
            updateArticleCommentCount(postIds);
        }
    } catch (err) {
        ddpError({ reply, err, message: '修改评论状态操作失败' });
    }
}



// 更新当前所受影响的评论的评论聚合数据
const updateArticleCommentCount = async(post_ids = []) => {
    post_ids = [...new Set(post_ids)].filter(id => !!id);
    if (post_ids.length) {
        try {
            let counts = await Comment.aggregate([
                { $match: { state: 1, post_id: { $in: post_ids } } },
                { $group: { _id: "$post_id", num_tutorial: { $sum: 1 } } }
            ])

            if (counts.length === 0) {
                await Article.update({ id: post_ids[0] }, { $set: { 'meta.comments': 0 } });
            } else {
                counts.forEach(async count => {
                    await Article.update({ id: count._id }, { $set: { 'meta.comments': count.num_tutorial } })
                });
            }
        } catch (err) {
            console.warn('更新评论count聚合数据前，查询失败', err);
        }
    }
};