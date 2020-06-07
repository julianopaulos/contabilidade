const express = require("express");

const multer = require("multer");
const configMulter = require("./services/multer");




const ControllerUser = require('./Controllers/ControllerUser');
const ControllerImg = require("./Controllers/ControllerImg");
const ControllerAccount = require("./Controllers/ControllerAccount");
const ControllerExpense = require("./Controllers/ControllerExpense");
const ControllerUserExpense = require("./Controllers/ControllerUserExpense");
const ControllerEmail = require("./Controllers/ControllerEmail");

const { celebrate, Joi, Segments } = require("celebrate");
const routes = express.Router();



//##CONTROLLER DE E-MAILS DE CONTATO
routes.post("/email",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required().min(17).max(50),
        message: Joi.string().required().min(3).max(300)
    })
}),ControllerEmail.main);



//##CONTROLE DE USUÁRIOS


routes.get("/user",celebrate({
    [Segments.HEADERS]:Joi.object().keys({
        authorization : Joi.string().required()
    }).unknown()
}),ControllerUser.find);


routes.get("/login",celebrate({
    [Segments.HEADERS]:Joi.object().keys({
        auth: 
            [
                {
                    username: Joi.string().required(),
                    password: Joi.string().required(),
                }
            ]
    }).unknown()
}), ControllerUser.index);

routes.post("/register",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required().min(17).max(50),
        phone: Joi.string().required().min(10).max(20),
        password: Joi.string().required().min(4).max(25)
    }).unknown()
}), ControllerUser.create);


routes.put("/update",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization:Joi.string().required()
    }).unknown(),
    [Segments.BODY]:Joi.object({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required().min(13).max(50),
        phone: Joi.string().required().min(10).max(20),
        password: Joi.string().min(4).max(25)
    }).unknown()
}), ControllerUser.update);




//##FOTO DE PERFIL DO USUÁRIO

routes.post("/img",multer(configMulter).single("img"),celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerImg.create);

routes.get("/img",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerImg.index);






//##CONTROLE DAS CONTAS FINANCEIRAS DOS USUÁRIOS

routes.get("/account",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerAccount.index);

routes.post("/account",celebrate({
    [Segments.BODY]: Joi.object({
        
        total_income: Joi.number().required().min(0).max(15000000),
        meta: Joi.number().required().min(0).max(15000000)
    }).unknown(),
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerAccount.create);



//##CONTROLE DE DESPESAS DOS USUÁRIOS


routes.get("/expense",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerExpense.index);

routes.get("/edit",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.QUERY]:Joi.object({
        id:Joi.number().required()
    })
}),ControllerUserExpense.index);

routes.get("/filter",celebrate({
    [Segments.QUERY]: Joi.object({
        initDate: Joi.string().required().min(5).max(15),
        finalDate: Joi.string().required().min(5).max(15)
    }).unknown(),
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerUserExpense.findByDate);

routes.post("/expense",celebrate({
    [Segments.BODY]: Joi.object({
        value: Joi.number().required().min(0).max(100000000000),
        description: Joi.string().required().min(3).max(200),
        date_expense: Joi.string().required().min(5).max(15)
    }).unknown(),
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}),ControllerExpense.create);


routes.put("/expense",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required(),
        id_expense: Joi.number().required()
    }).unknown(),
    [Segments.BODY]:Joi.object({
        description: Joi.string().required().min(3).max(200),
        value: Joi.number().required().min(0).max(100000000000),
        date_expense: Joi.string().required().min(5).max(15)
    })
}),ControllerExpense.update);


routes.delete("/expense",celebrate({
    [Segments.HEADERS]:Joi.object({
        authorization: Joi.string().required(),
        id_expense: Joi.number().required()
    }).unknown()
}),ControllerExpense.delete);


/*routes.put("/update",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required()
    }).unknown()
}), ControllerUser.update);

routes.delete("/delete",celebrate({
    [Segments.BODY]:Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.string().required()
    }).unknown()
}), ControllerUser.delete);*/

module.exports = routes;