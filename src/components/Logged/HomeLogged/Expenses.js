import React, {useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import api from '../../../services/api';

export default function Expenses(props)
{

    const history = useHistory();
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [expense,setExpense] = useState([]);

    const [message, setMessage] = useState("");
    const [display,setDisplay] = useState({
        display:''
    });
    
    useEffect(()=>{
        api.get("/user",{
            headers:{
                authorization: "Bearer "+sessionStorage.getItem("token")
            }
        })
        .then((req)=>{
            if(req.data.router)
            {
                sessionStorage.clear();
                history.push(`/${req.data.router}`);
            }
            
            api.get("/expense",{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((req)=>{
                
                if(req.data)
                {
                    setExpense(req.data);
                }
            })
            .catch(e=>console.log(e));
        })
        .catch(e=>console.log(e))
    },[history]);





    async function handleCreateExpense(e)
    {
        e.preventDefault();
        if(!description || !value || value<0)
        {
            alert("Digite os dados Corretamente!");
        }
        else
        {
            setDisplay({
                display:'none'
            });
            setMessage("Processando...");

            let d = new Date();
            let day = d.getDate();
            let month = ((d.getMonth()+1)<10)?"0"+(d.getMonth()+1): d.getMonth()+1;
            let year = d.getFullYear();
            if(value.indexOf(",")!==-1)
            {
                alert("Os números devem ser separados por ponto");
            }
            
            let data = {
                value:value,
                description: description,
                date_expense: `${year}/${month}/${day}`
            };
            
            await api.post("/expense",data,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((req)=>{
                api.get("/expense",{
                    headers:{
                        authorization: sessionStorage.getItem("token")
                    }
                })
                .then((req)=>{
                    setDisplay({
                        display:''
                    });
                    setMessage("");
                    if(req.data)
                    {
                        setExpense(req.data);
                    }
                })
                .catch((e)=>{
                    console.log(e);
                    setMessage("Ops! Algo deu errado!");
                    setTimeout(()=>{
                        setDisplay({
                            display:''
                        });
                        setMessage("");
                    },1000);
                });
            })
            .catch(e=>console.log(e))
        }
    }

    async function handleEdit(id)
    {
        
        history.push(`/Edit?id=${id}`);
    }

    async function handleDelete(id)
    {
        if(window.confirm("Tem certeza que deseja fazer isso?"))
        {
            await api.delete("/expense",{
                headers:{
                    authorization: sessionStorage.getItem("token"),
                    id_expense: id
                }
            })
            .then((req)=>{
                if(req.data.router)
                {
                    history.push(`/${req.data.router}`);
                }
                if(expense)
                {
                    setExpense(expense.filter((expense)=>expense.id!==id));
                }       
            })
            .catch(e=>{
                console.log(e);
            });
        }
    }

    async function filterDate()
    {
        let initDate = document.querySelector("#initDate").value;
        let finalDate = document.querySelector("#finalDate").value;
        if(initDate.indexOf("-")!==-1 && finalDate.indexOf("-")!==-1)
        {
            await api.get(`/filter?initDate=${initDate}&finalDate=${finalDate}`,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            }).then((res)=>{
                setExpense(res.data);
            }).catch(e=>console.log(e));
        }
    }

    function dateFormat(date)
    {
        var split = date.split('/');
        const format_date = split[2] + "/" + split[1] + "/" + split[0];
        return format_date;
    }



    if(props.account && Array.isArray(expense))
        {    
            return (
                <div>
                    <div className="form-expense">
                        <h2>
                            Adicione suas Despesas aqui!
                        </h2>
                        <form onSubmit={(e)=>{handleCreateExpense(e)}}>
                                <label>Descrição da Despesa<br/>
                                <input 
                                    type="text" 
                                    placeholder="Descrição"  
                                    required
                                    value={description}
                                    onChange={e=>setDescription(e.target.value)}
                                />
                                </label><br/>
                                <label>Valor da Despesa:<br/>
                                <input 
                                    type="text" 
                                    placeholder="Valor" 
                                    required
                                    value={value}
                                    onChange={e=>setValue(e.target.value)}
                                />
                            </label><br/>
                            <button 
                                type="submit" 
                                title="Cadastrar despesa" 
                                style={display}
                            >
                                Cadastrar
                            </button>
                            {message}
                        </form>
                    </div>
                    <Divider/>
                    <div className="date-filter">   
                        <div>Filtre seus gastos por tempo: </div>
                        <label>de:
                            <input 
                                type="date"  
                                onChange={(e)=>filterDate()}  
                                id="initDate"
                            />
                        </label>
                        
                        <label>até:
                            <input 
                                type="date"  
                                onChange={(e)=>filterDate()}  
                                id="finalDate"
                            />
                        </label>
                    </div>
                    {expense.map(d=>{
                    return (
                        <div key={d.id} className="expense">            
                            <div><h4>Data</h4><div>{dateFormat(d.date_expense)}</div></div>
                            <div><h4>Descrição</h4><div>{d.description}</div></div>
                            <div>
                                <h4>Valor</h4>
                                    {"R$"+Number(d.value).toLocaleString("pt",{minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2})}
                            </div>
                            <div>
                                <h4>Ações</h4>
                                <div>
                                    <span title="Editar despesa">
                                        <EditIcon onClick={()=>handleEdit(d.id)}/>
                                    </span> 
                                    <span title="Deletar despesa">
                                        <DeleteIcon  onClick={()=>handleDelete(d.id)} />
                                    </span>
                                </div>
                            </div>
                            <Divider/>
                        </div>
                    );
                })}
                </div>
            );
        }  
        else if(props.account)
        {
            return (
                <div className="form-expense">
                    <h2>
                        Adicione suas Despesas aqui!
                    </h2>
                    <form onSubmit={e=>handleCreateExpense(e)}>
                        <label>Descrição da Despesa<br/>
                            <input 
                                type="text" 
                                placeholder="Descrição"  
                                required
                                value={description}
                                onChange={e=>setDescription(e.target.value)}
                            />
                        </label><br/>
                        <label>Valor da Despesa:<br/>
                            <input 
                                type="text" 
                                placeholder="Valor" 
                                required
                                value={value}
                                onChange={e=>setValue(e.target.value)}
                            />
                        </label><br/>
                        
                        <button 
                                type="submit" 
                                title="Cadastrar despesa" 
                                style={display}
                        >
                            Cadastrar
                        </button>
                        {message}
                    </form>
                </div>
            );
        }
        else
        {
            return (<div><h2>Primeiro Adicione sua renda e sua meta mensal!</h2></div>);
        }  
}
