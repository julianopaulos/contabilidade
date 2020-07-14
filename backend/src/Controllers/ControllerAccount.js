const jwt = require('./jwt');
const connection = require("../database/connection");

module.exports ={
    async index(req,res)
    {   
        try
        {
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            if(Number.isInteger(payload.user_id))
            {
                const account = await connection('user_account').select("*").where("id_user",payload.user_id).first();
                (account)?res.status(200).json(account):res.json("Sem conta cadastrada");
            }
            return res.status(401).json(payload);
        }
        catch(e)
        {
            const message = "Conta financeira inexistente";
            const router = "Login";
            return res.status(400).send({message,router},"erro");
        }
    },
    async create(req,res)
    {
        try
        {
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            const {total_income,meta} = req.body; 
            if(Number.isInteger(payload.user_id))
            {
                const id_user = payload.user_id;

                const data = await connection("user_account").select("*").where("id_user",id_user).first();

                if(!data)
                {
                    await connection('user_account').insert({
                        id_user,
                        total_income,
                        meta
                    });
                    const data_account = {total_income,meta};
                    return res.status(201).send(data_account);
                }
                const message = "Conta já  cadastrada!";
                return res.send(message);
            }
            return res.status(401).send(payload);
        }
        catch(e)
        {
            const message = "Algo deu errado";
            const router = "Login";
            return res.status(400).send({message,router});
        }
    }
}
/*const [,token] = req.headers.authorization.split("Bearer");
            const payload = await jwt.verify(token);
            const user = await connection('user_account').select("*").where("id",payload.user_id).first();
            user.pass = undefined;
            req.auth = user;
            
            return res.json(req.auth);
*/