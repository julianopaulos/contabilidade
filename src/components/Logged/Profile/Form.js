import React,{useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import InputMask from 'react-input-mask';

import openedEyeIcon from '../../assets/icons/eye.svg';
import closedEyeIcon from '../../assets/icons/eye-off.svg';

import api from '../../../services/api';

export default function Form()
{
    const history = useHistory();

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [password,setPassword] = useState("");
    const [statusMessage,setStatusMessage] = useState("");
    const [eyeIcon, setEyeIcon] = useState(closedEyeIcon);

    const [display,setDisplay] = useState({display:''});

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
        catch(e){console.log(e);}
    },[history]);

    function handleEyeIcon()
    {
        var fieldPass = document.querySelector("input[name='password']");
        if(eyeIcon === openedEyeIcon)
        {
            setEyeIcon(closedEyeIcon);
            fieldPass.type = "password";
        }
        else
        {
            setEyeIcon(openedEyeIcon);
            fieldPass.type = "text";
        }
    }

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
            setStatusMessage("Insira os campos do formulário corretamente!");
            setTimeout(()=>setStatusMessage(""),3000);
        }
        else
        {
            setDisplay({display:'none'});
            setStatusMessage("Processando...");
            let data = [];
            if(password && password.length>=3)
            {
                data={
                    "name":name,
                    "email": email,
                    "phone":phone,
                    "password":password
                }
            }
            else if (password && password.length<=3)
            {
                setDisplay({display:''});
                setStatusMessage("Ops! Algo deu errado!");
                setTimeout(()=>setStatusMessage(""),2000);
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
                    setDisplay({display:''});
                    setStatusMessage(res.data);
                    setTimeout(()=>setStatusMessage(""),3000);
                }
                else
                {
                    setDisplay({display:''});
                    setStatusMessage("Ops! Algo deu errado!");
                    setTimeout(()=>setStatusMessage(""),2000);
                }
            })
            .catch((e)=>{
                console.log(e);
                setStatusMessage("Ops! Algo deu errado!");
                setTimeout(()=>{
                    setDisplay({display:''});
                    setStatusMessage("");
                },2000);
            })
        }
        
    }



    return (
        <form className="form-profile" onSubmit={(e)=>handleUpdate(e)}>
            <label>
                <input 
                    type="text" 
                    name="name" 
                    id="input_name"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                    data-animation="left"
                />
            </label>

            <label>
                <input 
                    type="email" 
                    name="email" 
                    id="input_mail"
                    placeholder="Seu E-mail"
                    autoComplete="username"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    data-animation="left"
                />
            </label>
            <label>
                <InputMask 
                    mask="(99) 9 9999-9999" 
                    placeholder="Seu celular" 
                    name="phone"  
                    id="input_phone"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    required
                    data-animation="left"
                />
            </label>
            <label style={{display:"flex",alignItems:"center"}}>
                <input 
                    type="password" 
                    name="password" 
                    id="input_pass"
                    placeholder="Insira Sua Nova Senha"
                    autoComplete="current-password"
                    onChange={(e)=>setPassword(e.target.value)}
                    data-animation="left"
                />
                <span toggle="#password" onClick={handleEyeIcon}>
                    <img 
                        className="eye-icon"  
                        src={eyeIcon} 
                        style={{width:'20px', marginTop:"-32px"}} 
                        alt="Eye"    
                    />
                </span>
            </label>
            <button type="submit" style={display}>Atualizar dados</button>
            <h3 id="message">{statusMessage}</h3>
        </form>
        
    );
}