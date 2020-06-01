import React, {useState} from 'react'
import {useHistory} from 'react-router-dom';

import api from '../../services/api';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

import './style.css';
export default function Login() {
    document.title="Login";
    const history = useHistory();
    const[message,setMessage] = useState("");
    const[email, setEmail] = useState("");
    const [pass,setPass] = useState("");
    const [display, setDisplay] = useState({
        display:''
    });
    
    async function redirect()
    {
        await history.push("/Register");
    }


    async function handleSubmit(e)
    {
        if(!email || !pass)
        {
            e.preventDefault();
            setMessage("Digite todos os campos necessários!");
        }
        else
        {
            e.preventDefault();
            setDisplay({
                display:'none'
            });
            setMessage("Aguarde...");
            await api.get('login',
            {
                auth: {username:email, password: pass}
            })
            .then((request)=>{
                setMessage(request.data.message); 
                if(request.data.router)
                {
                    setDisplay({
                        display:''
                    });
                    setTimeout(()=>{
                        sessionStorage.setItem("token",request.data.token);
                        history.push(`/${request.data.router}`);
                    },300);
                }
                
            })
            .catch((e)=>
            {
                console.log(e);
                setDisplay({
                    display:''
                }); 
                setMessage("Ops! Algo deu errado!");
                setTimeout(()=>{
                    setMessage("");
                },2000);
            });
        }
    }

    return (
        <div className="todo-login">
            <Header/>
            <div className="login-container center">
                <div>
                    <p>Bem-vindo de volta! <EmojiEmotionsIcon id="smile"/></p>
                    <form className="form-login" onSubmit={(e)=>handleSubmit(e)} method="post" datatype="text/plain">
                        <label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Seu E-mail" 
                                autoComplete="username"
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Insira Sua Senha"
                                autoComplete="current-password"
                                onChange={(e)=>setPass(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit" style={display}>Entrar</button>
                    </form>
                    
                    <div className="question" onClick={()=>redirect()}> 
                            Ainda não tem uma conta?
                    </div>
                    
                    <h2 className="message">{message}</h2>
                    
                </div>
            </div>
            <Footer/>
        </div>
    )
}
