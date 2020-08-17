const jwt = require('./jwt');
const connection = require("../database/connection");
const cryptographe = require("../services/crypt");

module.exports={
    
    async index(req,res)
    {
        try
        {
            let message = "Logado com sucesso!";
            let router = "Logged";
            const [,hash] = req.headers.authorization.split(' ');   
            const credentials = Buffer.from(hash,"base64").toString();
            const [email,password] = credentials.split(':');
            const data = await connection('user').select("*")
                .where("email",email)
                .where("pass",cryptographe.cript(password))
                .limit(1).first();
            if(!data)
            {
                message = "Usuário ou senha incorretos!";
                return res.status(203).json({message});
            }
            data.pass = undefined;
            const token = jwt.sign({user_id : data.id});
            return res.status(200).json({data,token,message,router});
        }
        catch(error)
        {
            return res.status(400).send(error);
        }
    },

    async create(req,res)
    {  
        const {name,email,phone,password} = req.body; 
        let pass = cryptographe.cript(password);
        try
        {   
            let id = 0;
            const data = await connection('user').select("*").where("email",email).where("pass",pass);
            if(data.length===0)
            {
                [id] = await connection('user').insert({
                    name, 
                    email,
                    phone,
                    pass
                });
            }
            else
            {
                return res.status(203).json({message:"E-mail já cadastrado!"});
            }
            const token = jwt.sign({user_id : id});
            return res.status(201).json({id,token});
        }
        catch(error){
            return res.status(400).send(error);
        }
    },
    async find(req,res)
    {
        try
        {
            const [,token] = req.headers.authorization.split(" ");      
            
            try
            {
                const payload = jwt.verify(token);
                if(Number.isInteger(payload.user_id))
                {
                    const data = await connection("user")
                    .join("user_account","user.id","user_account.id_user")
                    .select("*")
                    .where("user.id",payload.user_id).first();
                    if(data)
                    {
                        data.pass = undefined;
                        return res.status(200).json(data);
                    }
                    
                    const data_user = await connection("user")
                        .select("*")
                        .where("id",payload.user_id)
                        .first();
                    if(data_user)
                    {
                        data_user.pass = undefined;
                        return res.status(200).json(data_user);    
                    }
                    return res.status(204).send("Usuário não encontrado!");
                }
                return res.status(401).send(payload);
            }
            catch(error)
            {
                return res.status(400).send(error);
            }
        }
        catch(error)
        {
            return res.status(400).send(error);
        }
    },


    async update(req,res)
    {
        try
        {
            const {name,email,phone,password} = req.body;
            const token = req.headers.authorization;  
            const payload = jwt.verify(token);    
            if(Number.isInteger(payload.user_id))
            {
                const id = await connection("user").select("id").where("email",email).first();
                if(((id && id.id===payload.user_id) || !id.id) && password)
                {        
                    let pass = cryptographe.cript(password);
                    await connection("user").update({'name':name,'email':email,phone:phone,'pass':pass})
                    .where("id",payload.user_id);
                    return res.status(200).json("Dados alterados com sucesso!");
                }
                if(((id && id.id===payload.user_id) || !id.id) && !password)
                {
                    await connection("user").update({'name':name,'email':email,'phone':phone})
                    .where("id",payload.user_id);
                    return res.status(200).json("Dados alterados com sucesso!"); 
                }
                return res.status(203).json("E-mail já utilizado!");
            }
            return res.status(401).send(payload);
        }
        catch(error)
        {
            return res.status(400).send(error);
        }
    }
};