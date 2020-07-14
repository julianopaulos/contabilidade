const jwt = require("./jwt");
const connection = require("../database/connection");


module.exports={
    async index(req,res)
    {
        try
        {
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            if(Number.isInteger(payload.user_id))
            {
                const id = await connection("user_account").select("id").where("id_user",payload.user_id).first();
                
                if(id)
                {
                    const id_user_account = id.id;
                    if(id_user_account)
                    {
                        const data = await connection("user_expenses").select("*")
                        .where("id_user_account",id_user_account)
                        .orderBy("date_expense","desc");
                        if(data)
                        {
                            data.map(d=>{
                                return d.id_user_account = undefined;
                            });
                            return res.status(200).json(data); 
                        }
                        return res.send("Nenhuma despesa encontrada!");
                    }
                    
                    return res.json("Sem conta cadastrada!");
                    
                }
                
                return res.json("Sem conta cadastrada!");
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
            const {value, description,date_expense} = req.body;
            //let id = Number(Math.floor(Math.random()*100000+1)+""+Math.floor(Math.random()*100+1));   
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            if(Number.isInteger(payload.user_id))
            {
                const [data] = await connection("user_account").select("*").where("id_user",payload.user_id);
                const id_user_account = data.id; 
                
                if(id_user_account && value>0)
                {
                    const [id] = await connection("user_expenses").insert({
                        id_user_account,
                        value,
                        description,
                        date_expense
                    })
                    return res.status(201).json({id,value,description,date_expense});
                }
                return res.json("Algo deu errado!");
            }
            return res.status(401).send(payload);
        }
        catch(e)
        {
            return res.status(400).send(e);
        }
    },

    async update(req,res)
    {
        try
        {
            const {value, description,date_expense} = req.body;
            
            const id_expense = req.headers.id_expense;
            
            const token = req.headers.authorization;

            const payload = jwt.verify(token);

            if(Number.isInteger(payload.user_id))
            {
                const id_account = await connection("user_account")
                    .select("id")
                    .where("id_user",payload.user_id)
                    .first();
                if(id_account.id)
                {
                    const data = await connection("user_expenses")
                        .select("*")
                        .where("id",id_expense)
                        .where("id_user_account",id_account.id).first();
                    
                    if(data.id)
                    {
                        await connection("user_expenses")
                        .update({"value":Number(value),"description":description,"date_expense":`${date_expense.replace(/-/g,"/","/")}`})
                        .where("id",id_expense);
                        return res.status(202).json({message:"Dados alterados com sucesso!"});
                    }
                    return res.send("Não foram encontradas despesas!");
                }
                return res.send("Conta não encontrada!");
            }
            return res.status(401).json(payload);
        }
        catch(e)
        {
            return res.status(400).send(e);
        }
    },

    async delete(req,res)
    {
        try
        {
            const id_expense = req.headers.id_expense;
            const token = req.headers.authorization;
            const payload = await jwt.verify(token);
            if(Number.isInteger(payload.user_id))
            {
                const id_account = await connection("user_account").select("*").where("id_user",payload.user_id).first();
                const id_user_account = id_account.id;

                if(id_user_account)
                {
                    const data = await connection("user_expenses")
                    .where("id_user_account",id_user_account)
                    .where("id",id_expense)
                    .del();
                    return res.status(204).json(data);
                }
                return res.send("Despesa não encontrada");
            }
            return res.status(401).send(payload);
        }
        catch(e)
        {
            let router = "Home";
            return res.status(400).send({e,router});
        }
    }
    
}