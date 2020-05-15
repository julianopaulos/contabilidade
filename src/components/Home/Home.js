import React from 'react';
import {Carousel} from 'react-responsive-carousel';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './style.css';
const img1 = require("../assets/images/img1.jpg");
const img2 = require("../assets/images/img2.jpg");
const img3 = require("../assets/images/img3.jpg");



export default function Home()
{
    document.title = "Home";
    return(
        <div>
            <Header/>
            <div className="home-container">
                <Carousel>
                    <div>
                        <img src={img1} alt="1° imagem" />
                        <div className="legend">
                            <h3>Cuidando das finanças</h3>
                            Administre suas rendas e seus gastos de forma organizada e segura.
                        </div>
                    </div>
                    <div>
                        <img src={img2} alt="2° imagem" />
                        <div className="legend">
                            <h3>Evite gastos</h3>
                            Crie metas de gastos durante o seu mês para poupar mais.
                        </div>
                    </div>
                    <div>
                        <img src={img3} alt="3° imagem" />
                        <div className="legend">
                            <h3>Veja seu progresso</h3>
                            Veja todo o seu histórico  desde quando começou.
                        </div>
                    </div>
                </Carousel>
            </div>
            <Footer/>
        </div>
    );
}