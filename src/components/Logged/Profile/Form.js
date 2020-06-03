import React,{useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import InputMask from 'react-input-mask';

import api from '../../../services/api';

export default function Form()
{
    const history = useHistory();

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [pass,setPass] = useState("");
    const [message,setMessage] = useState("");


    const [display,setDisplay] = useState({
        display:''
    });

    useEffect(()=>{
        try
        {
            api.get("/user",{
                headers:{
                    authorization:"Bearer "+sessionStorage.getItem("token")
                }
            }).then((req)=>{
                if(req.data.router)
                {
                    sessionStorage.clear();
                    history.push(`/${req.data.router}`);
                }
                else
                {
                    setName(req.data.name);
                    setEmail(req.data.email);
                    setPhone(req.data.phone);
                }
            })
            .catch((error)=>{console.log(error)});
        }
        catch(e)
        {
            console.log(e);
        }
    },[history]);


    async function handleUpdate(e)
    {
        e.preventDefault();
        
        if(
            name.search(/[A-Za-z]/)===-1 || 
            email.search(/^[a-z0-9.]+@[a-z0-9]/)===-1 ||
            email.length<17 ||
            phone.search(/[0-9]/)===-1 || 
            phone.split(/[0-9]/).length<=11
        )
        {
            setMessage("Insira os campos do formulário corretamente!");
            setTimeout(()=>{
                setMessage("");
            },3000);
        }
        else
        {
            setDisplay({
                display:'none'
            });
            setMessage("Processando...");
            let data = [];
            if(pass && pass.length>=3)
            {
                data={
                    "name":name,
                    "email": email,
                    "phone":phone,
                    "password":pass
                }
            }
            else
            {
                data={
                    "name":name,
                    "email": email,
                    "phone":phone
                }
            }
            
            api.put("/update",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((res)=>{
                if(res.data)
                {
                    setDisplay({
                        display:''
                    });
                    setMessage(res.data);
                    setTimeout(()=>{
                        setMessage("");
                    },3000);
                }
                else
                {
                    setDisplay({
                        display:''
                    });
                    setMessage("Ops! Algo deu errado!");
                    setTimeout(()=>{
                        setMessage("");
                    },2000);
                }
            })
            .catch((e)=>{
                console.log(e);
                setMessage("Ops! Algo deu errado!");
                setTimeout(()=>{
                    setDisplay({
                        display:''
                    });
                    setMessage("");
                },2000);
            })
        }
        
    }



    return (
        <div className="container-data">
            <h3>Atualize seus dados caso sinta a necessidade</h3>
            <form className="form-profile" onSubmit={(e)=>handleUpdate(e)}>
                    <label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Seu E-mail"
                            autoComplete="username"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <InputMask 
                            mask="(99) 9 9999-9999" 
                            placeholder="Seu celular" 
                            name="phone"  
                            value={phone}
                            onChange={(e)=>setPhone(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Insira Sua Nova Senha"
                            autoComplete="current-password"
                            onChange={(e)=>setPass(e.target.value)}
                        />
                    </label>
                    <button type="submit" style={display}>Atualizar</button>
                    <h3>{message}</h3>
            </form>
        </div>
    );
}