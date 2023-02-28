import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import loginServices from "./service/LoginService";
import Login from './pages/Login';


export const AppTopbar = (props) => {
    const toast = useRef(null);
    const [redirect, setRedirect] = useState(false);
    const confirm = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Seguro que quiere cerrar sesión?',
            icon: 'pi pi-exclamation-triangle',
            accept,
            reject
        });
    };
    const logueo = window.localStorage.getItem("logueo");
    const dataLogin = JSON.parse(logueo);



    // const ingresar = async () => {
    //     const data = {
    //         email, password
    //     }
    //     const res = await loginServices.logout();

    //     if (res.success) {
    //         // window.localStorage.setItem(
    //         //     'logueo',JSON.stringify(res)
    //         // );

    //         setRedirect(true);
    //     }
    //     else {
    //         setError(true);
    //     }
    //     console.log(redirect);
    //   } 
    const salir = async () => {
        const res = await loginServices.logout();
        if (res.status) {
            window.localStorage.removeItem('logueo');
            setRedirect(true);
        }
    }
    const accept = () => {
        salir();
    };

    const reject = () => {
        // toast.current.show({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        //   
    };
    if (redirect) {
        location.reload();
    }
    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark.svg' : 'assets/layout/images/logo-white.svg'} alt="logo" />
                <p>
                    DIVPOL PNP
                </p>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div className="layout-topbar-menu  ">
                <div className="flex align-items-center">
                    <span className="font-medium ml-6">Comisaria {dataLogin.comisaria}</span>
                </div>
                <div className="flex align-items-center">
                    <span className="font-medium ml-6">{dataLogin.name}</span>
                </div>
                <Toast ref={toast} />
                <div>
                    <button className="p-link layout-topbar-button" onClick={confirm}>
                        <i className="pi pi-user" />
                    </button>
                </div>
            </div>

        </div>
    );
}
