/* 阿里云 ip 查询方法 */

const https = require('https');
const config = require('dp-config');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const geoip = require('geoip-lite');
// 验证权限
const queryIpInfo = req => {
    const ip = (req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.raw.connection.remoteAddress ||
        req.raw.socket.remoteAddress ||
        req.raw.connection.socket.remoteAddress ||
        req.raw.ip ||
        req.raw.ips[0]).replace('::ffff:', '') || '127.0.0.1';
    let opt = {
        ip: ip === '::1' ? '127.0.0.1' : ip,
        ip_location: {
            city: '',
            country: ''
        }
    };

    let data = null;
    let success = false;
    return new Promise((resolve, reject) => {
        const yreq = https.request({
            hostname: 'dm-81.data.aliyun.com',
            path: `/rest/160601/ip/getIpInfo.json?ip=${ip}`,
            port: 443,
            method: 'GET',
            protocol: 'https:',
            headers: {
                'Authorization': `APPCODE ${config.ALIYUN.ip}`,
            }
        }, res => {
            if (res.statusCode == 200) {
                success = true;
            }
            res.setEncoding('utf-8');
            res.on('data', chunk => {
                data = JSON.parse(chunk);
            });
            res.on('end', () => {
                if (success && data && data.code === 0) {
                    opt.ip_location.city = data.data.city;
                    opt.ip_location.country = data.data.country_id
                    resolve(opt);
                } else {
                    opt.ip_location = geoip.lookup(opt.ip);
                    resolve(opt);
                }
            });
        });
        yreq.on('error', err => {
            opt.ip_location = geoip.lookup(opt.ip);
            resolve(opt);
        });
        yreq.end();
    })
};

module.exports = queryIpInfo;