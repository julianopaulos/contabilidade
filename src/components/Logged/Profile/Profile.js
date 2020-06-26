import React,{useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import Form from './Form';



import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';



import user_icon from './user_icon.png';


import api from '../../../services/api';

import Header from '../Header/Header';
import Footer from '../../Footer/Footer';


import './style.css';

export default function Profile()
{
    
    const history = useHistory();
    document.title = "Perfil";
    const [style,setStyle] = useState(
        {
            'display': 'none'
        }
    );
    const [userImg, setUserImg] = useState();
    const [img,setImg] = useState();
    const [data,setData] = useState([]);

    const [message, setMessage] = useState("");
   

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
                    setData(req.data);
                    
                    api.get("/img",{
                        headers:{
                            Authorization: sessionStorage.getItem("token")
                        }
                    })
                    .then((res)=>{
                        if(res.data.url)
                        {
                            console.log(res.data.url);
                            setUserImg(res.data.url);
                        }
                        
                    })
                    .catch(e=>console.log(e))
                }
            })
            .catch((error)=>{console.log(error)});
        }
        catch(e)
        {
            console.log(e);
        }
    },[history]);


    

    async function handleImg(e)
    {
        
        e.preventDefault();
        if(img.size<2097152)
        {
            const formData = new FormData();
            formData.append("img",img);
            setMessage("Aguarde...")
            await api.post("/img",formData, {
                headers: {
                    authorization: sessionStorage.getItem("token"),
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
                }
            })
            .then(()=>{
                api.get("/img",{
                    headers:{
                        Authorization: sessionStorage.getItem("token")
                    }
                })
                .then((res)=>{
                    if(res.data.url)
                    {
                        setMessage("Foto cadastrada!");
                        setTimeout(()=>{
                            setMessage("");
                        },2500);
                        setUserImg(res.data.url);
                        handleModal();
                    }
                })
                .catch((e)=>{
                    console.log(e);
                    setMessage("Ops! Algo deu errado!")
                    setTimeout(()=>{
                        setMessage("");
                    },2000);
                })
            })
            .catch(e=>{
                console.log(e);setMessage("Ops! Algo deu errado!")
                setTimeout(()=>{
                    setMessage("");
                },2000);
            });
        }
        else
        {
            setMessage("A Imagem excedeu o tamanho máximo, que é de 2MB!");
            setTimeout(()=>{
                setMessage("");
            },3500);
        }
        
    }
    
    
    function handleModal(e)
    {   
        if(e)
        {
            e.preventDefault();
        }
        if(style.display === 'none')
        {
            setStyle({'display':'flex'});
        }
        else
        {
            setStyle({'display':'none'});
        }
    }

    function modalContainer()
    {
        if(img)
        {
            let preview = new FileReader();
            preview.onload=function(e){
                document.querySelector("img[name=user_img]").src=e.target.result;
            }
            preview.readAsDataURL(img);
        }
        if(img===undefined)
        {
            return(
                <div className="modal-content" style={style}>
                
                    <div className="form-modal">
                        
                        <div onClick={(e)=>handleModal(e)} id="close">x</div>
                        <Divider/>
                        <form onSubmit={(e)=>handleImg(e)} encType="multipart/form-data">
                            <input type="file" name="userImg" onChange={(e)=>setImg(e.target.files[0])} />
                            
                            <Divider/>
                            <button type="submit">Ok</button>
                            <button id="cancel" onClick={(e)=>handleModal(e)}>Cancelar</button>
                            <br/><h3>{message}</h3>
                        </form>
                    </div>
                </div>
            );
        }
        else
        {
            return(
                <div className="modal-content" style={style}>    
                    <div className="form-modal">    
                        <div onClick={(e)=>handleModal(e)} id="close">x</div>
                        <Divider/>
                        <form onSubmit={(e)=>handleImg(e)} encType="multipart/form-data">
                            <input type="file" name="userImg" onChange={(e)=>setImg(e.target.files[0])} />
                            <img name="user_img" alt="user" id="user_img"/>
                            <Divider/>
                            <button type="submit">Ok</button>
                            <button id="cancel" onClick={(e)=>handleModal(e)}>Cancelar</button>
                            <br/><h3>{message}</h3>
                        </form>
                    </div>
                </div>
            );
        }
        
    }

    

    function containerImg()
    {
        if(userImg!==undefined)
        {
            return (
                <div className="todo_img">
                    <div  className="container-img">
                        <img 
                            src={userImg} 
                            id="user_icon" 
                            alt="userProfile"
                            title="Foto de perfil"
                        />
                    </div>
                    <CardContent className="user_name">
                        <Typography gutterBottom variant="h5" component="h2" >
                            Olá, {data.name}
                        </Typography>
                    </CardContent>
                </div>
            );
        } 
        else
        {
            return (      
                <div className="todo_img">
                    <div className="container-img">
                        <CardMedia id="user_icon"                
                            title="Adicione uma imagem de perfil"
                            image={user_icon}
                            onClick={()=>handleModal()}
                        />
                    </div>
                    <CardContent className="user_name">
                        <Typography gutterBottom variant="h5" component="h2" >
                            Olá, {data.name}
                        </Typography>
                    </CardContent>
                </div>
            );
        }
     
        
        
    }

   return(
    <div className="todo-profile">
        <Header/>
            {modalContainer()}
            <a id="license" href='https://br.freepik.com/fotos-vetores-gratis/brochura' target="__blank">Brochura vetor criado por katemangostar - br.freepik.com</a>
            <div className="profile-container">
                {containerImg()}
                <Form/>
            </div>           
        <Footer/>
    </div>
    );
}