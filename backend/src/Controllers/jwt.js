const jwt = require('jsonwebtoken');

const secret = "f4QqXJD1RAsuUK0Gr6SR";


const sign = payload => jwt.sign(payload, secret)
const verify = token => jwt.verify(token, secret)
module.exports = {
    sign,
    verify
}


