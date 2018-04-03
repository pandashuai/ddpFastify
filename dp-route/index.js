const { INFO } = require('dp-config');
const controller = require('dp-controller');
const { Auth: { isRoot } } = require('dp-utils');
const routes = async(fastify, options) => {
    // 头部注册与跨域
    fastify.addHook('preHandler', ({ headers: { origin = '' }, raw: { method } }, reply, next) => {
        if (origin) {
            if (origin.includes('pandashuai.com') || origin.includes('localhost')) {
                reply.header('Access-Control-Allow-Origin', origin);
            } else {
                reply.code(200).send({ code: 0, message: '不允许使用该api服务' })
            }
        }
        // reply.header('Access-Control-Allow-Origin', '*');
        reply.header('Access-Control-Allow-Headers', 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With');
        // reply.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');

        // // OPTIONS
        if (method === 'OPTIONS') {
            return reply.code(200).send();
        };
        next();
    });

    fastify.get('/', async(request, reply) => {
        INFO.date = new Date();
        return { code: 1, result: INFO, message: '网络通畅!' };
    });
    // login
    fastify.post('/login', controller.login.post.login);
    // auth
    fastify.post('/auth', controller.login.post.auth);
    // history
    fastify.get('/history/lists', { beforeHandler: isRoot }, controller.history.get.lists);
    fastify.post('/history/del', { beforeHandler: isRoot }, controller.history.post.del);

    // thirdparty
    fastify.get('/thirdparty/qiniu/uptoken', { beforeHandler: isRoot }, controller.thirdparty.qiniu.uptoken);
    fastify.get('/thirdparty/qiniu/lists', { beforeHandler: isRoot }, controller.thirdparty.qiniu.lists);
    fastify.post('/thirdparty/qiniu/del', { beforeHandler: isRoot }, controller.thirdparty.qiniu.del);


    // >announcement
    fastify.post('/blog/announcement/create', { beforeHandler: isRoot }, controller.blog.announcement.post.create);
    fastify.post('/blog/announcement/del', { beforeHandler: isRoot }, controller.blog.announcement.post.del);
    fastify.post('/blog/announcement/edit', { beforeHandler: isRoot }, controller.blog.announcement.post.edit);
    fastify.get('/blog/announcement/lists', controller.blog.announcement.get.lists);
    // >tag
    fastify.post('/blog/tag/create', { beforeHandler: isRoot }, controller.blog.tag.post.create);
    fastify.post('/blog/tag/del', { beforeHandler: isRoot }, controller.blog.tag.post.del);
    fastify.post('/blog/tag/edit', { beforeHandler: isRoot }, controller.blog.tag.post.edit);
    fastify.get('/blog/tag/lists', controller.blog.tag.get.lists);
    fastify.get('/blog/tag/find', controller.blog.tag.get.find);
    // >category
    fastify.post('/blog/category/create', { beforeHandler: isRoot }, controller.blog.category.post.create);
    fastify.post('/blog/category/del', { beforeHandler: isRoot }, controller.blog.category.post.del);
    fastify.post('/blog/category/edit', { beforeHandler: isRoot }, controller.blog.category.post.edit);
    fastify.post('/blog/category/navstatus', { beforeHandler: isRoot }, controller.blog.category.post.navStatus);
    fastify.get('/blog/category/lists', controller.blog.category.get.lists);
    fastify.get('/blog/category/find', controller.blog.category.get.find);
    // >like
    fastify.post('/blog/like', controller.blog.like.post);
    // >option
    fastify.get('/blog/option/lists', controller.blog.option.get.lists);
    fastify.post('/blog/option/edit', { beforeHandler: isRoot }, controller.blog.option.post.edit);
    // >article
    fastify.post('/blog/article/create', { beforeHandler: isRoot }, controller.blog.article.post.create);
    fastify.post('/blog/article/del', { beforeHandler: isRoot }, controller.blog.article.post.del);
    fastify.post('/blog/article/edit', { beforeHandler: isRoot }, controller.blog.article.post.edit);
    // fastify.post('/blog/article/status', { beforeHandler: isRoot }, controller.blog.article.post.status);
    fastify.get('/blog/article/lists', controller.blog.article.get.lists);
    fastify.get('/blog/article/find', controller.blog.article.get.find);
    // >comment
    fastify.post('/blog/comment/create', controller.blog.comment.post.create);
    fastify.post('/blog/comment/del', { beforeHandler: isRoot }, controller.blog.comment.post.del);
    // fastify.post('/blog/comment/edit', { beforeHandler: isRoot }, controller.blog.comment.post.edit);
    fastify.post('/blog/comment/status', { beforeHandler: isRoot }, controller.blog.comment.post.status);
    fastify.get('/blog/comment/lists', controller.blog.comment.get.lists);
    fastify.get('/blog/comment/find', controller.blog.comment.get.find);

    // rbac
    // >user
    fastify.post('/rbac/user/create', { beforeHandler: isRoot }, controller.rbac.user.post.create)
    fastify.post('/rbac/user/del', { beforeHandler: isRoot }, controller.rbac.user.post.del)
    fastify.post('/rbac/user/edit', { beforeHandler: isRoot }, controller.rbac.user.post.edit)
    fastify.get('/rbac/user/lists', { beforeHandler: isRoot }, controller.rbac.user.get.lists)
    fastify.get('/rbac/user/find', { beforeHandler: isRoot }, controller.rbac.user.get.find)
        // >role
    fastify.post('/rbac/role/create', { beforeHandler: isRoot }, controller.rbac.role.post.create)
    fastify.post('/rbac/role/del', { beforeHandler: isRoot }, controller.rbac.role.post.del)
    fastify.post('/rbac/role/edit', { beforeHandler: isRoot }, controller.rbac.role.post.edit)
    fastify.get('/rbac/role/lists', { beforeHandler: isRoot }, controller.rbac.role.get.lists)
    fastify.get('/rbac/role/find', { beforeHandler: isRoot }, controller.rbac.role.get.find)
        // >node
    fastify.post('/rbac/node/create', { beforeHandler: isRoot }, controller.rbac.node.post.create)
    fastify.post('/rbac/node/del', { beforeHandler: isRoot }, controller.rbac.node.post.del)
    fastify.post('/rbac/node/edit', { beforeHandler: isRoot }, controller.rbac.node.post.edit)
    fastify.get('/rbac/node/lists', { beforeHandler: isRoot }, controller.rbac.node.get.lists)
    fastify.get('/rbac/node/find', { beforeHandler: isRoot }, controller.rbac.node.get.find)
    fastify.get('/rbac/node/nodeclass', { beforeHandler: isRoot }, controller.rbac.node.get.nodeclass)

    fastify.all('*', (request, reply) => {
        return reply.code(404).send({
            code: 0,
            message: '无效的API请求(end)'
        })
    });
}

module.exports = routes