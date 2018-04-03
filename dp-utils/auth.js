/* auth验证方法 */

const config = require('dp-config');
const jwt = require('jsonwebtoken');
const { Rbac: { User, Role } } = require('dp-model');
// 验证Auth
const authToken = req => {
    if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (Object.is(parts.length, 2) && Object.is(parts[0], config.AUTH.keyname)) {
            return parts[1];
        }
    }
    return false;
};

// 验证权限
const authIsVerified = async req => {
    const token = authToken(req);
    if (token) {
        try {
            const param = decodedToken(token);
            const data = await User.findOne({ user: param.data.user, password: param.data.password, state: 1 });
            if (data && param.exp > Math.floor(Date.now() / 1000)) {
                const role = data.role || [];
                let node = [];
                if (role.length > 0) {
                    // 查找所属用户的所有角色
                    for (let i = 0; i < role.length; i++) {
                        const resRole = await Role.findById(role[i]).populate(['node']);
                        if (resRole && resRole.state === 1 && resRole.node.length > 0) {
                            // 查找所属角色的所有节点
                            for (let j = 0; j < resRole.node.length; j++) {
                                const resNode = resRole.node[j];
                                // 节点状态为正常使用的
                                if (resNode.state === 1) {
                                    const tmp_obj = {
                                            method: resNode.method,
                                            route: resNode.route
                                        }
                                        // 去重
                                    if (node.indexOf(tmp_obj) == '-1') {
                                        node.push(tmp_obj)
                                    }
                                }
                            }
                        }
                    }
                }
                return {
                    user: data.user,
                    cover: data.cover,
                    node
                };
            }
        } catch (err) {}
    }
    return false;
};


const decodedToken = token => jwt.verify(token, config.AUTH.jwtTokenSecret);


const isRoot = async(request, reply, done) => {
    const root = await authIsVerified(request);
    if (!root) {
        return reply.code(200).send({ code: 2, message: '没有权限1！' })
    }
    request.ddpUser = root.user;
    if (root.user === 'admin') {
        return true;
    }

    if (root.node.length <= 0) {
        return reply.code(200).send({ code: 2, message: '没有权限2！' })
    }


    const { url, method } = request.raw;
    for (let i = 0; i < root.node.length; i++) {
        const rootRoute = root.node[i];
        // 注意：验证不严谨，之后改善
        if (url.indexOf(rootRoute.route) != '-1' && rootRoute.method === method) {
            return true;
        }
    }
    return reply.code(200).send({ code: 2, message: '没有权限3！' });
}
module.exports.authIsVerified = authIsVerified;
module.exports.isRoot = isRoot;