import React, {useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import InfiniteScroll from 'react-infinite-scroll-component';

import api from '../../../services/api';

export default function Expenses(props)
{

    const history = useHistory();
    const [description, setDescription] = useState("");
    const [value, setValue] = useState("");
    const [expenses,setExpenses] = useState([]);
    const [expensesTotalValue, setExpensesTotalValue] = useState(0);
    const [currentExpensesTotalValue, setCurrentExpensesTotalValue] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");
    const [displayButton,setDisplayButton] = useState({display:''});
    
    const [count, setCount] = useState({prev: 0,next: 5 });
    
    
    const [hasMoreExpenses, setHasMoreExpenses] = useState(true);
    const [currentExpenses, setCurrentExpenses] = useState([]);

    useEffect(()=>{
        api.get("/user",{
            headers:{
                authorization: "Bearer "+sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            if(response.status !== 200)
            {
                sessionStorage.clear();
                history.push("/");
            }
            api.get("/expense",{
                headers:{
                    authorization: sessionStorage.getItem("token")
                }
            })
            .then((response)=>{            
                if(Array.isArray(response.data))setExpenses(response.data);
            })
            .catch(error=>console.error(error));
        })
        .catch(error=>{
            console.error(error);
            history.push("/");
            sessionStorage.clear();
        });
    },[history]);

    useEffect(()=>{
        getCurrentExpenseValues(expenses);
        getExpenseValues(expenses);
        setHasMoreExpenses(false);
        if(expenses.length>5 && expenses.length>currentExpenses.length)setHasMoreExpenses(true);

        getCurrentExpenseValues(expenses.slice(count.prev, count.next));

        if(expenses.length>1)setCurrentExpenses(expenses.slice(count.prev, count.next));
        if(expenses.length===1)setCurrentExpenses(expenses);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[expenses]);


    const getMoreData = () => {  
        
        if (currentExpenses.length === expenses.length) {
            getCurrentExpenseValues(expenses);
            setHasMoreExpenses(false);
            return;
        }
        setTimeout(() => {
            try
            {
                setCurrentExpenses(currentExpenses.concat(expenses.slice(count.prev + 5, count.next + 5)));
                getCurrentExpenseValues(currentExpenses);
            }
            catch(error){console.error(error);}
        }, 1000);
        setCount((prevState) => ({ prev: prevState.prev + 5, next: prevState.next + 5 }));
    }
    async function handleCreateExpense(e)
    {
        e.preventDefault();
        if(!description || !value || value<0)setStatusMessage("Digite os dados corretamente!");
        else
        {
            setDisplayButton({display:'none'});
            setStatusMessage("Processando...");

            let atual_date = new Date();
            let atual_day = (atual_date.getDate()<10)?"0"+atual_date.getDate():atual_date.getDate();
            let atual_month = ((atual_date.getMonth()+1)<10)?"0"+(atual_date.getMonth()+1): atual_date.getMonth()+1;
            let atual_year = atual_date.getFullYear();
            if(value.indexOf(",")!==-1)setStatusMessage("Os números devem ser separados por ponto!");
            
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
            .then((response)=>{
                api.get("/expense",{
                    headers:{
                        authorization: sessionStorage.getItem("token")
                    }
                })
                .then((response)=>{
                    setDisplayButton({display:''});
                    setStatusMessage("");
                    if(response.data)
                    {
                        setCount(() => ({ prev: 0, next: 5 }));
                        setExpenses(response.data);
                        getExpenseValues(response.data);
                        setDescription("");
                        setValue("");
                    }
                })
                .catch((error)=>{
                    console.error(error);
                    setStatusMessage("Ops, algo deu errado! Tente novamente mais tarde.");
                    setTimeout(()=>{
                        setDisplayButton({display:''});
                        setStatusMessage("");
                    },2000);
                });
            })
            .catch(error=>console.error(error))
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
            .then((response)=>{
                if(response.status>400)
                {
                    sessionStorage.clear();
                    history.push("/");
                }
                if(expenses.length>0)
                {
                    setExpenses(expenses.filter((expense)=>expense.id!==expense_id));
                    getExpenseValues(expenses.filter((expense)=>expense.id!==expense_id));
                    getCurrentExpenseValues(currentExpenses.filter((expense)=>expense.id!==expense_id));
                }
            })
            .catch(error=>console.error(error));
        }
    }

    async function filterByDate()
    {
        let initDate = document.querySelector("#initDate").value;
        let finalDate = document.querySelector("#finalDate").value;

        if(initDate.indexOf("-")!==-1 && finalDate.indexOf("-")!==-1)
        {
            await api.get(`/filter`,{
                headers:{
                    authorization: sessionStorage.getItem("token")
                },
                params:{
                    initDate:initDate,
                    finalDate:finalDate
                }
            }).then((response)=>{
                if(!response.data.message)
                {
                    setCount(() => ({ prev: 0, next: 5 }));
                    setExpenses(response.data);
                    if(response.data.length===1)
                    {
                        setCurrentExpenses(response.data);
                        getCurrentExpenseValues(response.data);
                    }
                }
            }).catch(error=>console.error(error));
        }
    }

    function dateFormat(date)
    {
        var split = date.split('/');
        const format_date = split[2] + "/" + split[1] + "/" + split[0];
        return format_date;
    }

    function getCurrentExpenseValues(expenses)
    {
        let expenseValues = expenses.map(expense=>{return expense.value});
        let totalValue = 0;
        for(let i=0; i<expenseValues.length;i++)totalValue+=expenseValues[i];
        setCurrentExpensesTotalValue(totalValue);
    }
    function getExpenseValues(expenses)
    {
        let expenseValues = expenses.map(expense=>{return expense.value});
        let totalValue = 0;
        for(let i =0; i<expenseValues.length;i++)totalValue+=expenseValues[i];
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
                              
                          >
                              Cadastrar
                          </button>
                          <br/>{statusMessage}
                      </form>
                  </div>
                  
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
                          {(currentExpensesTotalValue>0 && (<div>
                            <span>
                                  Valor Total das Despesas: 
                              </span>
                              <div id="value">
                                  {" R$"+Number(expensesTotalValue).toLocaleString("pt",{minimumFractionDigits: 2, 
                                                  maximumFractionDigits: 2})}
                              </div>
                              <span>
                                  Valor das Despesas visíveis: 
                              </span>
                              <div id="value">
                                  {" R$"+Number(currentExpensesTotalValue).toLocaleString("pt",{minimumFractionDigits: 2, 
                                                  maximumFractionDigits: 2})}
                              </div>
                          </div>))}
                      </div>
                      <Divider id="before-expenses"/>
                  </div>
                  <InfiniteScroll
                      dataLength={currentExpenses.length}
                      next={getMoreData}
                      hasMore={hasMoreExpenses}
                      loader={<div className="sk-chase">
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      <div className="sk-chase-dot"></div>
                      </div>}
                      style={{overflow:"hidden"}}
                  >
                  {currentExpenses && currentExpenses.map(((expense, index) => {
                      return (
                          <div key={index} className="expense">            
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
                  }))}
                     
                  </InfiniteScroll>
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
                        <br/>{statusMessage}
                    </form>
                </div>
            );
        }
        else
        {
            return (<div id="non_account"><h2>Primeiro adicione sua renda e também sua meta mensal de gastos!</h2></div>);
        }  
}
