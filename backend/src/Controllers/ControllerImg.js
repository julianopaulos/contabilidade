const connection = require("../database/connection");   
const jwt = require("./jwt");
module.exports = {
    async index(req,res)
    {
        try{
            const token = req.headers.authorization;
            const payload = jwt.verify(token);
            if(Number.isInteger(payload.user_id))
            {
                const [data] = await connection("user_img").select("*").where("id_user",payload.user_id);
                if(data)
                {
                    return res.status(200).send(data);
                }
                return res.send("Imagem não encontrada!");
            }
            return res.status(401).send(payload);
        }
        catch(e)
        {
            return res.status(400).send(e);
        }
    },

    async create(req,res)
    { 
        try
        {
            //res.json([req.headers.authorization,req.file]);
            //let id = Number(Math.floor(Math.random()*1000+1)+""+Math.floor(Math.random()*100+1));
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            if(Number.isInteger(payload.user_id))
            {
                const {filename, size} = req.file;
                
                const [data] = await connection("user_img").select("*").where("id_user",payload.user_id);
                if(!data)
                {
                    const id_user = payload.user_id;
                    
                    await connection("user_img").insert({
                        id_user,
                        name: filename,
                        size,
                        url: `http://localhost:3333/files/${filename}`
                    })
                    
                }
                return res.status(201).json(req.file);
            }
            return res.status(401).send(payload);
        }
        catch(e)
        {
            return res.status(400).send(e);
        }      
    }

}