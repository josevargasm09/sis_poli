import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Redirect, useLocation } from "react-router-dom";
import loginServices from "../service/LoginService";
import { Link, useHistory } from 'react-router-dom';

import Home from "../pages/Home";
import Inicio from "../Inicio";
const initialAuth = null;
export default function Login() {
    const [usuarioCip, setUsuarioCip] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [redirect, setRedirect] = useState(initialAuth);
    const history = useHistory();

    const ingresar = async () => {
        const data = {
            usuarioCip, password
        }
        const res = await loginServices.login(data);
        

        if (res.success) {
            window.localStorage.setItem(
                'logueo', JSON.stringify(res)
            );

            setRedirect(true);
        }
        else {
            setError(true);
        }
    }
    const handleKeyUpLogin = (e) => {
        if (e.key === 'Enter') {
            ingresar();
        }
    };
    if (redirect) {

        return <Home />;
    }
    return ( 
        <div className='padre-div'>
            <div className='hijo-div'>
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-12">

                    <div className="p-fluid">
                        <div className="field">
                            <div className="text-center mb-5">
                                <img src="images/blocks/logos/logo-dark.svg" alt="hyper" height="50" className="mb-3" />
                                <div className="text-900 text-3xl font-medium mb-3">Iniciar Sesión</div>
                            </div> 
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="username" type="text" onChange={e => setUsuarioCip(e.target.value)} />
                                <label htmlFor="username">Usuario Cip</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Password id="password"  onKeyUp={handleKeyUpLogin} type="password" onChange={e => setPassword(e.target.value)} />
                                <label htmlFor="password">Contraseña</label>
                            </span>
                        </div>
                        {error && <div><label>Credenciales incorrectas</label></div>}
                        <br />
                        <Button label="Inicio" type="submit" onClick={() => ingresar()}></Button>
                    </div>
                </div>
            </div>
        </div>

    )
}
