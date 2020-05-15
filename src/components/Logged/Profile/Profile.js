import React,{useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


import InputMask from 'react-input-mask';

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
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [pass,setPass] = useState("");

    const [message,setMessage] = useState("");
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
                    setName(req.data.name);
                    setEmail(req.data.email);
                    setPhone(req.data.phone);
                    api.get("/img",{
                        headers:{
                            Authorization: sessionStorage.getItem("token")
                        }
                    })
                    .then((res)=>{
                        if(res.data.url)
                        {
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


    async function handleUpdate(e)
    {
        e.preventDefault();
        if(name && email && phone)
        {
            let data = [];
            if(pass)
            {
                data={
                    "name":name,
                    "email": email,
                    "phone":phone,
                    "password":pass
                }
            }
            data={
                "name":name,
                "email": email,
                "phone":phone
            }
            
            api.put("/update",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((res)=>{
                setMessage(res.data);
                setTimeout(()=>{
                    setMessage("");
                },2000);
            })
            .catch(e=>console.log(e))
        }
        else
        {
            alert("Insira os campos do formulário");
        }
        
    }


    async function handleImg(e)
    {
        
        e.preventDefault();
        const formData = new FormData();
        formData.append("img",img);

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
                    setUserImg(res.data.url);
                    handleModal();
                }
            })
            .catch(e=>console.log(e))
        })
        .catch(e=>console.log(e))
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
                <Card className="container-img">
                    <div>
                        <img src={userImg} style={{borderRadius:'50%'}} id="user_icon" alt="userProfile"/>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2" >
                                Olá, {data.name}
                            </Typography>
                        </CardContent>
                    </div>
                </Card>
            );
        } 
        
        else
        {
            return (
                <Card className="container-img">
                    <div>
                        <CardMedia id="user_icon"                
                            title="Adicione uma imagem de perfil"
                            image={user_icon}
                            onClick={()=>handleModal()}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2" >
                                Olá, {data.name}
                            </Typography>
                        </CardContent>
                    </div>
                </Card>
            );
        }
     
        
        
    }

    function formContainer()
    {
        return (
            <div className="container-data">
                <h3>Atualize seus dados caso sinta a necessidade</h3>
                <form className="form-profile" onSubmit={(e)=>handleUpdate(e)}>
                        <label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Seu E-mail"
                                autoComplete="username"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <InputMask 
                                mask="(99) 9 9999-9999" 
                                placeholder="Seu celular" 
                                name="phone"  
                                value={phone}
                                onChange={(e)=>setPhone(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Insira Sua Nova Senha"
                                autoComplete="current-password"
                                onChange={(e)=>setPass(e.target.value)}
                            />
                        </label>
                        <button type="submit">Atualizar</button>
                        <h3>{message}</h3>
                </form>
            </div>
        );
    }

   return(
    <div className="todo-profile">
        <Header/>
            {modalContainer()}
            <div className="profile-container">
                
                {containerImg()}
                {formContainer()}
            </div>           
        <Footer/>
    </div>
    );
}