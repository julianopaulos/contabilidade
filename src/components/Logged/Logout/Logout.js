import React,{useEffect} from 'react';
import {useHistory} from 'react-router-dom';

export default function Logout()
{
    document.title="Sair";
    const history = useHistory();
    useEffect(()=>{
        if(document.title==="Sair")
        {
            sessionStorage.clear();
            history.push("/");
        }
    });
    return <></>;
}
