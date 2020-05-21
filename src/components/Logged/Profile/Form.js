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
        if(name && email && phone)
        {
            let data = [];
            if(pass)
            {
                data={
                    "name":name,
                    "email": email,
                    "phone":phone,
                    "password":pass
                }
            }
            data={
                "name":name,
                "email": email,
                "phone":phone
            }
            
            api.put("/update",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((res)=>{
                setMessage(res.data);
                setTimeout(()=>{
                    setMessage("");
                },2000);
            })
            .catch(e=>console.log(e))
        }
        else
        {
            alert("Insira os campos do formulário");
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
                    <button type="submit">Atualizar</button>
                    <h3>{message}</h3>
            </form>
        </div>
    );
}