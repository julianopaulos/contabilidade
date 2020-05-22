import React, {useState} from 'react'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import './style.css';


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
        if(name !== "" && email!=="" && message!=="")
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
                    setUserMessage("Ops, Algo deu errado! Tente novamente!");
                    setTimeout(()=>{
                        setUserMessage("");
                    },2500);
                }
            })
            .catch(e=>console.log(e));
        }
        else
        {
            setUserMessage("Digite todos os dados corretamente!");
            setTimeout(()=>{
                setUserMessage("");
            },1500);
        }
    }

    return (
        <div className="todo-contact">
            <Header/>
            <div className="contact-container">
                <div>
                    <p>
                        Entre em contato para esclarecer suas dúvidas!
                    </p>
                    <form className="contact-form" onSubmit={(e)=>handleSubmit(e)}>
                        <label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Seu nome"
                                onKeyUp={(e)=>setName(e.target.value)} 
                            />
                        </label>
                        <label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Seu E-mail"
                                onKeyUp={(e)=>setEmail(e.target.value)} 
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
                        <br/><h3>{userMessage}</h3>
                    </form>
                </div>
            </div>
        <Footer/>
        </div>
    )
}
