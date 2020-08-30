const crypto = require("crypto");


const cript = (pass) =>{
    return  crypto.createHash("ssl3-md5").update(pass).digest('hex')    
}


const descript = (pass)=>{
    const decipher = crypto.createDecipher("ssl3-md5","f4QqXJD1RAsuUK0Gr6SR");
    decipher.update(pass,"hex","utf8");
    return decipher.final("utf8"); 
}

module.exports = {
    cript,
    descript
}