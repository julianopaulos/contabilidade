import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Contact from './components/Contact/Contact';


import HomeLogged from './components/Logged/HomeLogged/HomeLogged';
import Profile from './components/Logged/Profile/Profile';
import Edit from './components/Logged/Edit/Edit';
import Logout from './components/Logged/Logout/Logout';
export default function Routes()
{
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home}/>
                <Route path='/Home' exact component={Home}/>
                <Route path='/Register' exact component={Register}/>
                <Route path='/Login' exact component={Login}/>
                <Route path='/Contact' exact component={Contact}/>
                
                
                <Route path='/Logged' exact component={HomeLogged}/>
                <Route path='/Profile' component={Profile}/>
                <Route path='/Edit' component={Edit}/>
                <Route path="/Logout" component={Logout}/>
                
            </Switch>
        </BrowserRouter>
    );
}