import React from 'react'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import './style.css';

export default function Contact() {
    document.title = "Contato";
    return (
        <div className="todo-contact">
            <Header/>
            <div className="contact-container">
                <div>
                    <p>
                        Entre em contato para esclarecer suas dúvidas!
                    </p>
                    <form className="contact-form" >
                        <label><input type="text" name="name" placeholder="Seu nome"/></label>
                        <label><input type="email" name="email" placeholder="Seu E-mail"/></label>
                        
                        <label><textarea name="message" rows="4" placeholder="Sua Mensagem..."/></label>
                        <button type="submit">Enviar E-mail</button>
                    </form>
                </div>
            </div>
        <Footer/>
        </div>
    )
}
