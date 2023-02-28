import React ,{useEffect,useState} from 'react';
import { BrowserRoute as Router,HashRouter,Route,Redirect,Switch} from 'react-router-dom'

import Home from './pages/Home';
import Login from './pages/Login';
import ScrollToTop from './ScrollToTop';

function Inicio() {
  const[auth,setAuth]=useState(false);
  useEffect(() => {
    const logueo=window.localStorage.getItem("logueo");
    if(logueo){
        const user=JSON.parse(logueo);
        setAuth(true);
    }
  },[]);
if (auth)
    return <Home />;
  else
    return <Login />
}

export default Inicio;
