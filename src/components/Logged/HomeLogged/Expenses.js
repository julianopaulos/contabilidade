import React, {useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


import InfiniteLoadingList from 'react-simple-infinite-loading'

import api from '../../../services/api';

export default function Expenses(props)
{

    const history = useHistory();
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [expenses,setExpenses] = useState([]);
    const [expensesTotalValue, setExpensesTotalValue] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");
    const [displayButton,setDisplayButton] = useState({
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
                    setExpenses(req.data);
                    getExpenseValues(req.data);
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
            alert("Digite os dados corretamente!");
        }
        else
        {
            setDisplayButton({
                display:'none'
            });
            setStatusMessage("Processando...");

            let atual_date = new Date();
            let atual_day = (atual_date.getDate()<10)?"0"+atual_date.getDate():atual_date.getDate();
            let atual_month = ((atual_date.getMonth()+1)<10)?"0"+(atual_date.getMonth()+1): atual_date.getMonth()+1;
            let atual_year = atual_date.getFullYear();
            if(value.indexOf(",")!==-1)
            {
                alert("Os números devem ser separados por ponto");
            }
            
            let data = {
                value:value,
                description: description,
                date_expense: `${atual_year}/${atual_month}/${atual_day}`
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
                    setDisplayButton({
                        display:''
                    });
                    setStatusMessage("");
                    if(req.data)
                    {
                        setExpenses(req.data);
                        getExpenseValues(req.data);
                        setDescription("");
                        setValue("");
                    }
                })
                .catch((e)=>{
                    console.log(e);
                    setStatusMessage("Ops, algo deu errado! Tente novamente mais tarde.");
                    setTimeout(()=>{
                        setDisplayButton({
                            display:''
                        });
                        setStatusMessage("");
                    },2000);
                });
            })
            .catch(e=>console.log(e))
        }
    }

    async function redirectToEditPage(id)
    {
        history.push(`/Edit?id=${id}`);
    }

    async function handleDelete(expense_id)
    {
        if(window.confirm("Tem certeza que deseja fazer isso?"))
        {
            await api.delete("/expense",{
                headers:{
                    authorization: sessionStorage.getItem("token"),
                    id_expense: expense_id
                }
            })
            .then((req)=>{
                if(req.data.router)
                {
                    history.push(`/${req.data.router}`);
                }
                if(expenses)
                {
                    setExpenses(expenses.filter((expense)=>expense.id!==expense_id));
                    getExpenseValues(expenses.filter((expense)=>expense.id!==expense_id));
                }       
            })
            .catch(e=>{
                console.log(e);
            });
        }
    }

    async function filterByDate()
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
                setExpenses(res.data);
                getExpenseValues(res.data);
            }).catch(e=>console.log(e));
        }
    }

    function dateFormat(date)
    {
        var split = date.split('/');
        const format_date = split[2] + "/" + split[1] + "/" + split[0];
        return format_date;
    }

    function getExpenseValues(expenses)
    {
        let expenseValues = expenses.map(expense=>{return expense.value});
        let totalValue = 0;
        for(let i =0; i<expenseValues.length;i++)
        {
            totalValue+=expenseValues[i];
        }
        setExpensesTotalValue(totalValue);
    }



    if(props.account && Array.isArray(expenses) && expenses.length>0)
        {    
            return (
                <div>
                    <div className="form-expense">
                        <h2>
                            Adicione suas despesas aqui!
                        </h2>
                        <form onSubmit={(e)=>{handleCreateExpense(e)}}>
                                <label>Descrição da despesa<br/>
                                <input 
                                    type="text" 
                                    placeholder="Descrição"  
                                    required
                                    value={description}
                                    onChange={e=>setDescription(e.target.value)}
                                />
                                </label><br/>
                                <label>Valor da despesa:<br/>
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
                                style={displayButton}
                            >
                                Cadastrar
                            </button>
                            {statusMessage}
                        </form>
                    </div>
                    <Divider/>
                    <div className="date-filter">   
                        <div>Filtre seus gastos por período: </div>
                        <label>de:
                            <input 
                                type="date"  
                                onChange={(e)=>filterByDate()}  
                                id="initDate"
                            />
                        </label>
                        
                        <label>até:
                            <input 
                                type="date"  
                                onChange={(e)=>filterByDate()}  
                                id="finalDate"
                            />
                        </label>
                        <div className="total-value">
                            {(expensesTotalValue>0 && (<div>
                                <span>
                                    Valor Total das Despesas: 
                                </span>
                                <div id="value">
                                    {" R$"+Number(expensesTotalValue).toLocaleString("pt",{minimumFractionDigits: 2, 
                                                    maximumFractionDigits: 2})}
                                </div>
                            </div>))}
                        </div>
                        <Divider id="before-expenses"/>
                    </div>
                    <div style={(expenses.length>1)?{height: 600 }:{height:400}}>    
                        <InfiniteLoadingList
                            items={expenses}
                            itemHeight={400}
                            loadMoreItems={Expenses}
                        >
                            {expenses.map(expense=>{
                                return (
                                    <div key={expense.id} className="expense">            
                                        <div><h4>Data</h4><div>{dateFormat(expense.date_expense)}</div></div>
                                        <div><h4>Descrição</h4><div>{expense.description}</div></div>
                                        <div>
                                            <h4>Valor</h4>
                                                {"R$"+Number(expense.value).toLocaleString("pt",{minimumFractionDigits: 2, 
                                                    maximumFractionDigits: 2})}
                                        </div>
                                        <div>
                                            <h4>Ações</h4>
                                            <div>
                                                <span title="Editar despesa" >
                                                    <EditIcon id="edit" onClick={()=>redirectToEditPage(expense.id)}/>
                                                </span> 
                                                <span title="Deletar despesa" >
                                                    <DeleteIcon id="delete"  onClick={()=>handleDelete(expense.id)} />
                                                </span>
                                            </div>
                                        </div>
                                        <Divider/>
                                    </div>
                                );
                        })}
                        </InfiniteLoadingList>
                    </div>
                    
                </div>
            );
        }  
        else if(props.account)
        {
            return (
                <div className="form-expense">
                    <h2>
                        Adicione suas despesas aqui!
                    </h2>
                    <form onSubmit={e=>handleCreateExpense(e)}>
                        <label>Descrição da despesa<br/>
                            <input 
                                type="text" 
                                placeholder="Descrição"  
                                required
                                value={description}
                                onChange={e=>setDescription(e.target.value)}
                            />
                        </label><br/>
                        <label>Valor da despesa:<br/>
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
                                style={displayButton}
                        >
                            Cadastrar
                        </button>
                        {statusMessage}
                    </form>
                </div>
            );
        }
        else
        {
            return (<div id="non_account"><h2>Primeiro adicione sua renda e também sua meta mensal de gastos!</h2></div>);
        }  
}
