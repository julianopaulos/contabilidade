import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import InputMask from 'react-input-mask';


import userIcon from '../assets/icons/user.png';
import mailIcon from '../assets/icons/mail.png';
import phoneIcon from '../assets/icons/phone.png';
import passwordIcon from '../assets/icons/password.png';
import openEyeIcon from '../assets/icons/eye.svg';
import closedEyeIcon from '../assets/icons/eye-off.svg';

import api from '../../services/api';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';


import './style.css';

export default function Register() {
    document.title="Cadastrar";
    const history = useHistory();
    const [statusMessage,setStatusMessage] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [password,setPassword] = useState("");
    const [eyeIcon, setEyeIcon] = useState(closedEyeIcon);

    const [displayButton, setDisplayButton] = useState({display:''});

    async function redirect()
    {
        await history.push("/Login");
    }


    function handleEyeIcon()
    {
        var fieldPass = document.querySelector("input[name='password']");
        if(eyeIcon === openEyeIcon)
        {
            setEyeIcon(closedEyeIcon);
            fieldPass.type = "password";
        }
        else
        {
            setEyeIcon(openEyeIcon);
            fieldPass.type = "text";
        }
    }
    async function register(e)
    {
        if(
            name.search(/[A-Za-z]/)===-1 || 
            email.search(/^[a-z0-9.]+@[a-z0-9]/)===-1 ||
            email.length<17 ||
            phone.search(/[0-9]/)===-1 || 
            password.length<=3 ||
            phone.split(/[0-9]/).length<=11
        )
        {
            e.preventDefault();
            setStatusMessage("Digite todos os campos do formulário corretamente!");
            setTimeout(()=>{
                setStatusMessage("");
            },2000);
        }
        else
        {
            setDisplayButton({display:'none'});
            setStatusMessage("Aguarde...");
            e.preventDefault();
            const data = {
                name: name,
                email: email,
                phone: phone,
                password: password
            }

            
            await api.post("register",data)
            .then((response)=>{
                setDisplayButton({display:''});
                setStatusMessage(response.data.message);
                if(response.data.router!==undefined)
                {
                    history.push(`/${response.data.router}`);
                }
                else
                {
                    setStatusMessage("Ops! Algo deu errado!");
                    setTimeout(()=>{
                        setStatusMessage("");
                    },2000);
                }
                
            })
            .catch((e)=>{
                setDisplayButton({display:''});
                console.log(e);
                if(e.router)
                {
                    setStatusMessage(e.message);
                    history.push(`/${e.router}`);
                }
                else
                {
                    setStatusMessage("Ops! Algo deu errado!");
                    setTimeout(()=>{
                        setStatusMessage("");
                    },2000);
                }
            });
        }
    }

    return (
        <div className="todo">
            <Header/>
            <div className="register-container">
                <div>
                <div className="register-header">
                    Faça seu cadastro<br/> agora mesmo!
                </div>
                <form className="form-register" onSubmit={(e)=>register(e)}>
                    <label>
                        <input 
                            onChange={(e)=>setName(e.target.value)} 
                            type="text" 
                            name="name" 
                            placeholder="Seu nome completo"
                            style={{
                                background: `url(${userIcon})no-repeat 10px 8px`,
                                backgroundColor: '#ffffff'
                            }}
                        />
                    </label>

                    <label>
                        <input 
                            onChange={(e)=>setEmail(e.target.value)} 
                            type="email" 
                            name="email" 
                            placeholder="Seu endereço de e-mail"
                            autoComplete="username"
                            style={{
                                background: `url(${mailIcon})no-repeat 10px 8px`,
                                backgroundColor: '#ffffff'
                            }}
                        />
                    </label>
                    <label>
                        <InputMask 
                            mask="(99) 9 9999-9999" 
                            placeholder="Seu número de celular" 
                            onChange={(e)=>setPhone(e.target.value)} 
                            name="phone"  
                            style={{
                                background: `url(${phoneIcon})no-repeat 10px 8px`,
                                backgroundColor: '#ffffff'
                            }}
                        />
                    </label>

                    <label style={{display:"flex",alignItems:"center"}}>
                        <input 
                            onChange={(e)=>setPassword(e.target.value)} 
                            type="password" 
                            name="password" 
                            style={{
                                background: `url(${passwordIcon})no-repeat 10px 8px`,
                                backgroundColor: '#ffffff'
                            }}
                            placeholder="Crie sua senha"
                            autoComplete="current-password"
                        />
                        <span onClick={handleEyeIcon}>
                            <img 
                                className="eye-icon"  
                                src={eyeIcon} 
                                style={{width:'20px'}} 
                                alt="Eye"
                            />
                        </span>
                    </label>
                    <button type="submit" style={displayButton}>Cadastrar</button>
                    <span>Já tem sua conta? <u onClick={()=>redirect()}>Entrar</u></span>
                </form>
                <h3 className="message">{statusMessage}</h3>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
