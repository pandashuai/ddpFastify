// API分发至控制器
// thirdparty
exports.thirdparty = {
    qiniu: require('./third_party/qiniu/route')
};
// blog
exports.blog = {
    announcement: {
        post: require('./blog/announcement/post'),
        get: require('./blog/announcement/get')
    },
    tag: {
        post: require('./blog/tag/post'),
        get: require('./blog/tag/get')
    },
    category: {
        post: require('./blog/category/post'),
        get: require('./blog/category/get')
    },
    like: {
        post: require('./blog/like/post')
    },
    option: {
        get: require('./blog/option/get'),
        post: require('./blog/option/post')
    },
    article: {
        post: require('./blog/article/post'),
        get: require('./blog/article/get')
    },
    comment: {
        post: require('./blog/comment/post'),
        get: require('./blog/comment/get')
    }
};

// rbac
exports.rbac = {
    user: {
        post: require('./rbac/user/post'),
        get: require('./rbac/user/get')
    },
    role: {
        post: require('./rbac/role/post'),
        get: require('./rbac/role/get')
    },
    node: {
        post: require('./rbac/node/post'),
        get: require('./rbac/node/get')
    }
};
// history
exports.history = {
    get: require('./history/get'),
    post: require('./history/post')
}

// login
exports.login = {
    post: require('./login/post')
};