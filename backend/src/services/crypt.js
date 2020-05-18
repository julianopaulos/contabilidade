const crypto = require("crypto");


const cript = (pass) =>{
    return  crypto.createHash("md5").update(pass).digest('hex')    
}


const descript = (pass)=>{
    const decipher = crypto.createDecipher("md5","24759383");
    decipher.update(pass,"hex","utf8");
    return decipher.final("utf8"); 
}

module.exports = {
    cript,
    descript
}