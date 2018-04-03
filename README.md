# 基于fastify框架所写的api接口调用服务

开发环境

 - node 注:版本需支持`ES6`
 - mongoDB

快速开始

在dp-config/index.js按照提示填写所需参数，其中mongoDB配置必填

```

npm install

npm run dev

```

注： 可以配合[ddpAdmin](https://github.com/pandashuai/ddpAdmin)后台使用

# 目前有以下api接口,如下

无需权限就可以交互

| 方法 | 路由 | 说明 |
| --- | --- | --- |
| GET | / | 首页 |
| POST | /login | 登录 |
| POST | /auth | 权限验证 |
| GET | /blog/announcement/lists | 博客公告列表 |
| GET | /blog/tag/lists | 博客标签列表 |
| GET | /blog/tag/find | 获取博客单个标签 |
| GET | /blog/category/lists | 博客分类列表 |
| POST | /blog/like | 执行博客点赞的功能 |
| GET | /blog/option/lists | 博客共同配置 |
| GET | /blog/article/lists | 博客文章列表 |
| GET | /blog/article/find | 获取博客单个文章 |
| GET | /blog/comment/lists | 博客评论列表 |
| GET | /blog/comment/find | 获取博客单个评论 |


需权限才可以交互

| 方法 | 路由 | 说明 |
| --- | --- | --- |
| GET | /history/lists | 历史记录列表 |
| POST | /history/del | 清空历史记录 |
| GET | /thirdparty/qiniu/uptoken | 获取七牛平台上传key(需配置) |
| GET | /thirdparty/qiniu/lists | 获取七牛平台资源列表 |
| POST | /thirdparty/qiniu/del | 删除七牛平台资源 |
| POST | /blog/announcement/create | 创建博客公告 |
| POST | /blog/announcement/del | 删除博客公告 |
| POST | /blog/announcement/edit | 更新博客公告 |
| POST | /blog/tag/create | 创建博客标签 |
| POST | /blog/tag/del | 删除博客标签 |
| POST | /blog/tag/edit | 更新博客标签 |
| POST | /blog/category/create | 创建博客分类 |
| POST | /blog/category/del | 删除博客分类 |
| POST | /blog/category/edit | 更新博客分类 |
| POST | /blog/category/navstatus | 让该分类单独独立起来，适应于判断是否显示在导航栏中 |
| POST | /blog/option/edit | 配置博客公共配置 |
| POST | /blog/article/create | 创建博客文章 |
| POST | /blog/article/del | 删除博客文章 |
| POST | /blog/article/edit | 更新博客文章 |
| POST | /blog/comment/create | 创建博客评论 |
| POST | /blog/comment/del | 删除博客评论 |
| POST | /blog/comment/status | 更新博客评论状态 |
| POST | /rbac/user/create | 创建用户 |
| POST | /rbac/user/del | 删除用户 |
| POST | /rbac/user/edit | 更新用户 |
| GET | /rbac/user/lists | 用户列表 |
| GET | /rbac/user/find | 获取单个用户 |
| POST | /rbac/role/create | 创建角色 |
| POST | /rbac/role/del | 删除角色 |
| POST | /rbac/role/edit | 更新角色 |
| GET | /rbac/role/lists | 角色列表 |
| GET | /rbac/role/find | 获取单个角色 |
| POST | /rbac/node/create | 创建路由节点 |
| POST | /rbac/node/del | 删除路由节点 |
| POST | /rbac/node/edit | 更新路由节点 |
| GET | /rbac/node/lists | 路由节点列表 |
| GET | /rbac/node/find | 获取单个路由节点 |
| GET | /rbac/node/nodeclass | 路由节点列表分类 |

权限访问

需在请求的`headers`添加`authorization`属性，值为在`dp-config`文件里`config.AUTH.keyname`值和登录生成的token，表现形式为
```
headers: {
    authorization: config.AUTH.keyname + ' ' + token // 空格分割
}
```

其他的请自行探索，感觉可以的话就在右上角star一下吧