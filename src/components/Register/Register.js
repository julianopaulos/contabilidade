import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import InputMask from 'react-input-mask';


import userIcon from '../assets/icons/user.png';
import mailIcon from '../assets/icons/mail.png';
import phoneIcon from '../assets/icons/phone.png';
import passwordIcon from '../assets/icons/password.png';

import api from '../../services/api';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';


import './style.css';

export default function Register() {
    document.title="Cadastrar";
    const history = useHistory();
    const [message,setMessage] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [pass,setPass] = useState("");

    const [display, setDisplay] = useState({
        display:''
    });

    async function redirect()
    {
        await history.push("/Login");
    }

    async function register(e)
    {
        if(
            name.search(/[A-Za-z]/)===-1 || 
            email.search(/^[a-z0-9.]+@[a-z0-9]/)===-1 ||
            email.length<17 ||
            phone.search(/[0-9]/)===-1 || 
            pass.length<=3 ||
            phone.split(/[0-9]/).length<=11
        )
        {
            e.preventDefault();
            setMessage("Digite todos os campos do formulário corretamente!");
        }
        else
        {
            setDisplay({
                display:'none'
            });
            setMessage("Aguarde...");
            e.preventDefault();
            const data = {
                name: name,
                email: email,
                phone: phone,
                password: pass
            }

            
            await api.post("register",data)
            .then((response)=>{
                setDisplay({
                    display:''
                });
                setMessage(response.data.message);
                if(response.data.router!==undefined)
                {
                    history.push(`/${response.data.router}`);
                }
                else
                {
                    setMessage("Ops! Algo deu errado!");
                    setTimeout(()=>{
                        setMessage("");
                    },2000);
                }
                
            })
            .catch((error)=>{
                setDisplay({
                    display:''
                });
                console.log(error);
                if(error.router)
                {
                    setMessage(error.message);
                    history.push(`/${error.router}`);
                }
                else
                {
                    setMessage("Ops! Algo deu errado!");
                    setTimeout(()=>{
                        setMessage("");
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

                    <label>
                        <input 
                            onChange={(e)=>setPass(e.target.value)} 
                            type="password" 
                            name="password" 
                            style={{
                                background: `url(${passwordIcon})no-repeat 10px 8px`,
                                backgroundColor: '#ffffff'
                            }}
                            placeholder="Crie sua senha"
                            autoComplete="current-password"
                        />
                    </label>
                    <button type="submit" style={display}>Cadastrar</button>
                    <span>Já tem sua conta? <u onClick={()=>redirect()}>Entrar</u></span>
                </form>
                <h3 className="message">{message}</h3>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
