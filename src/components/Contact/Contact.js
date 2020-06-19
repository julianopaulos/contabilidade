import React, {useState} from 'react'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import './style.css';

import userIcon from '../assets/icons/user.png';
import mailIcon from '../assets/icons/mail.png';

import api from '../../services/api.js';


export default function Contact() {
    document.title = "Contato";
    const [display, setDisplay] = useState({
        display:''  
    });
    const [disable, setDisable] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [userMessage, setUserMessage] = useState("");

    async function handleSubmit(e)
    {
        e.preventDefault();
        if(
            name.search(/[A-Za-z]/)===-1 || 
            email.search(/^[a-z0-9.]+@[a-z0-9]/)===-1 ||
            email.length<17 ||
            message.length<4 ||
            name.length<3
        )
        {
            setUserMessage("Digite todos os dados corretamente!");
            setTimeout(()=>{
                setUserMessage("");
                setDisable("");
            },1500);
        }
        else
        {
            setDisplay({
                display: 'none'
            }); 
            setDisable("disabled");
            setUserMessage("Aguarde...");
            const data = {
                name, 
                email, 
                message
            }
            await api.post("/email",data)
            .then((res)=>{
                if(res.data.message)
                {
                    setUserMessage(res.data.message);
                    setTimeout(()=>{
                        setUserMessage("");
                        setDisplay({
                            display: ''
                        });
                        setDisable("");
                    },2500);
                }
                else
                {
                    setUserMessage("Ops, Algo deu errado! Verifique seus dados e tente novamente!");
                    setTimeout(()=>{
                        setUserMessage("");
                        setDisplay({
                            display: ''
                        });
                        setUserMessage("");
                        setDisable("");
                    },2500);
                }
            })
            .catch((e)=>
            {
                console.log(e);
                setUserMessage("Ops, Algo deu errado! Verifique seus dados e tente novamente!");
                setTimeout(()=>{
                    setUserMessage("");
                    setDisplay({
                        display: ''
                    });
                    setUserMessage("");
                    setDisable("");
                },2500);
            });
        }
    }

    return (
        <div className="todo-contact">
            <Header/>
            <div className="contact-container">
                <div>
                    <div className="contact-header">
                        Entre em contato para esclarecer suas dúvidas!
                    </div>
                    <form className="contact-form" onSubmit={(e)=>handleSubmit(e)}>
                        <label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Seu nome"
                                onKeyUp={(e)=>setName(e.target.value)} 
                                style={{
                                    background: `url(${userIcon})no-repeat 10px 8px`,
                                    backgroundColor: '#ffffff'
                                }}
                            />
                        </label>
                        <label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Seu E-mail"
                                onKeyUp={(e)=>setEmail(e.target.value)} 
                                style={{
                                    background: `url(${mailIcon})no-repeat 10px 8px`,
                                    backgroundColor: '#ffffff'
                                }}
                            />
                        </label>
                        
                        <label>
                            <textarea 
                                name="message" 
                                rows="4" 
                                placeholder="Sua Mensagem..."
                                onKeyUp={(e)=>setMessage(e.target.value)} 
                            />
                        </label>
                        <button type="submit" disabled={disable} style={display}>Enviar E-mail</button>
                        
                    </form>
                    <br/><h3 className="message">{userMessage}</h3>
                </div>
            </div>
        <Footer/>
        </div>
    )
}
