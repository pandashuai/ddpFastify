/*
 *
 * 喜欢功能控制器
 *
 */
const { Handle: { ddpError, ddpSuccess } } = require('dp-utils');
const { Blog: { Comment, Article, Option } } = require('dp-model');

module.exports = async({ body: { id, type } }, reply) => {
    if (![1, 2].includes(type)) {
        ddpError({ reply, message: '喜欢失败，原因我不说' });
    }
    try {
        let mk = false;
        if (Object.is(type, 1)) {
            mk = Comment
        } else if (Object.is(id, 0)) {
            mk = Option
        } else {
            mk = Article
        }

        let findData = await mk.findOne((() => (Object.is(id, 0)) ? {} : { id })());
        if (Object.is(type, 1)) {
            findData.likes++;
        } else {
            findData.meta.likes++;
        }
        await findData.save();
        ddpSuccess({ reply, message: '爱你么么扎' });
    } catch (err) {
        ddpError({ reply, err, message: '喜欢失败' });
    }
}