import React from 'react';
import List from '@material-ui/core/List';
import {Menu} from '@material-ui/icons';
import ListItem from '@material-ui/core/ListItem';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';

import './style.css';
  
export default function Header(props)
{
    const [state, setState] = React.useState({
        top: false
      });
    
    const links = [
        {route:'Logged',label: 'Home'},
        {route:'Profile',label: 'Perfil'},
       // {route:'Login',label: 'Login'},
        {route:'Logout',label: 'Sair', func: 'handleLogout'}
    ];
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setState({ ...state, [anchor]: open });
    };



    const list = (anchor) => (
        <div
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            {links.map((text) => {
                let name = "";
                if(text.label===document.title)
                {
                    name = "link"
                }
              return(
              
              <ListItem button key={text.label}>
                <Link className="link-responsive" id={name} to={text.route}>
                  {text.label}
                </Link>
              </ListItem>
            )})}
          </List>
        </div>
      );


    
    return(
        <nav className="header">
            <div className="nav-link flex-start">  
                {links.map((link)=>{
                    let name = "";
                    if(link.label===document.title)
                    {
                        name = "link";
                    }
                    return(
                        <Link key={link.route} to={link.route} id={name} onClick={()=>document.title=link.label}>
                            {link.label}
                        </Link>        
                    );
                })}   
            </div>   
            <div className="responsive-menu">
                {['top'].map((anchor) => (
                    <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>
                        <Menu/>
                    </Button>
                    
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        {list(anchor)}
                    </Drawer>
                    </React.Fragment>
                ))}
            </div>
       
        </nav>
        
    );
}