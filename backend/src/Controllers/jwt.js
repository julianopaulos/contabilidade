const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const secret = crypto.createHash('ssl3-md5').update("f4QqXJD1RAsuUK0Gr6SR").digest("hex")

const sign = payload => jwt.sign(payload, secret)
const verify = token => jwt.verify(token, secret)
module.exports = {
    sign,
    verify
}


