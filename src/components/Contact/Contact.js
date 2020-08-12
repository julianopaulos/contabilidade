import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import './style.css';

import userIcon from '../assets/icons/user.png';
import mailIcon from '../assets/icons/mail.png';

import api from '../../services/api.js';


export default function Contact() {
    document.title = "Contato";
    const history = useHistory();
    const [display, setDisplay] = useState({display:''});
    const [disableButton, setDisableButton] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bodyMessage, setBodyMessage] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(()=>{
        
        document.querySelector("textarea").classList.add("animating");
        document.querySelector("div.contact-container").classList.add("contact-container","animating");
        document.querySelectorAll("input").forEach(function(element){
            element.classList.add("animating");
        });
    },[history]);

    async function handleSubmit(e)
    {
        e.preventDefault();
        if(
            name.search(/[A-Za-z]/)===-1 || 
            email.search(/^[a-z0-9.]+@[a-z0-9]/)===-1 ||
            email.length<17 ||
            bodyMessage.length<4 ||
            name.length<3
        )
        {
            setStatusMessage("Digite todos os dados corretamente!");
            setTimeout(()=>{
                setStatusMessage("");
                setDisableButton("");
            },1500);
        }
        else
        {
            setDisplay({display: 'none'}); 
            setDisableButton("disabled");
            setStatusMessage("Aguarde...");
            const data = {
                name, 
                email, 
                message:bodyMessage
            }
            await api.post("/email",data)
            .then((response)=>{
                if(response.data.message)
                {
                    setStatusMessage(response.data.message);
                    setTimeout(()=>{
                        setStatusMessage("");
                        setDisplay({display: ''});
                        setDisableButton("");
                    },2500);
                }
                else
                {
                    setStatusMessage("Ops, Algo deu errado! Verifique seus dados e tente novamente!");
                    setTimeout(()=>{
                        setStatusMessage("");
                        setDisplay({display: ''});
                        setStatusMessage("");
                        setDisableButton("");
                    },2500);
                }
            })
            .catch((error)=>
            {
                console.error(error);
                setStatusMessage("Ops, Algo deu errado! Verifique seus dados e tente novamente!");
                setTimeout(()=>{
                    setStatusMessage("");
                    setDisplay({display: ''});
                    setStatusMessage("");
                    setDisableButton("");
                },2500);
            });
        }
    }

    return (
        <div className="todo-contact">
            <Header/>
            <div className="contact-container" data-animation="top">
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
                                data-animation="left"
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
                                data-animation="left"
                            />
                        </label>
                        
                        <label>
                            <textarea 
                                name="message" 
                                rows="4" 
                                placeholder="Sua Mensagem..."
                                onKeyUp={(e)=>setBodyMessage(e.target.value)} 
                                data-animation="left"
                            />
                        </label>
                        <button type="submit" disabled={disableButton} style={display}>Enviar E-mail</button>
                        
                    </form>
                    <br/><h3 className="message">{statusMessage}</h3>
                </div>
            </div>
        <Footer/>
        </div>
    )
}
