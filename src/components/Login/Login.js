import React, {useState} from 'react'
import {useHistory} from 'react-router-dom';

import mailIcon from '../assets/icons/mail.png';
import passwordIcon from '../assets/icons/password.png';
import openEyeIcon from '../assets/icons/eye.svg';
import closedEyeIcon from '../assets/icons/eye-off.svg';

import api from '../../services/api';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';


import './style.css';
export default function Login() {
    document.title="Login";
    const history = useHistory();
    const[email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[statusMessage,setStatusMessage] = useState("");
    const [displayButton, setDisplayButton] = useState({display:''});
    const [eyeIcon, setEyeIcon] = useState(closedEyeIcon);
    
    async function redirect()
    {
        await history.push("/Register");
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
    async function handleSubmit(e)
    {
        
        if(!email || !password)
        {
            e.preventDefault();
            setStatusMessage("Digite todos os campos necessários!");
            setTimeout(()=>{
                setStatusMessage("");
            },2000);
        }
        else
        {
            try
            {
                e.preventDefault();
                const abortController = new AbortController();
                const signal = abortController.signal;
                setDisplayButton({display:'none'});
                setStatusMessage("Aguarde...");
                await api.get('login',
                {
                    auth: {username:email, password: password},
                    signal: signal
                })
                .then((request)=>{
                    setStatusMessage(request.data.message); 
                    if(request.data.router)
                    {
                        setDisplayButton({display:''});
                        setTimeout(()=>{
                            sessionStorage.setItem("token",request.data.token);
                            history.push(`/${request.data.router}`);
                        },300);
                        return function cleanup()
                        {
                            abortController.abort();
                        }
                    }  
                    setTimeout(()=>{
                        setStatusMessage("");
                    },2000);
                })
                .catch((e)=>
                {
                    console.log(e);
                    setDisplayButton({display:''}); 
                    setStatusMessage("Ops! Algo deu errado!");
                    setTimeout(()=>{
                        setStatusMessage("");
                    },2000);
                });
            }
            catch(e){
                console.log(e);
            }
            
        }
    }
    return (
        <div className="todo-login">
            <Header/>
            <div className="login-container">
                <div>
                    <div className="login-header">
                        Bem-vindo de volta!
                    </div>
                    <form className="form-login" onSubmit={(e)=>handleSubmit(e)} method="post" datatype="text/plain">
                        <label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Seu E-mail" 
                                autoComplete="username"
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                                style={{
                                    background: `url(${mailIcon})no-repeat 10px 8px`,
                                    backgroundColor: '#ffffff'
                                }}
                            />
                        </label>
                        <label style={{display:"flex",alignItems:"center"}}>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Insira Sua Senha"
                                autoComplete="current-password"
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                                style={{
                                    background: `url(${passwordIcon})no-repeat 10px 8px`,
                                    backgroundColor: '#ffffff'
                                }}
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
                        <button type="submit" style={displayButton}>Entrar</button>
                        <span>Ainda não tem uma conta? 
                            <u onClick={()=>redirect()} title="Cadastrar">Cadastre-se</u>
                        </span>
                    </form>
                    <h3 className="message">{statusMessage}</h3>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
