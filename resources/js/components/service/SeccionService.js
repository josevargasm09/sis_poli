import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Seccion = {};


Seccion.list = async () => {
    const urList = baseUrl + "/seccion";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .get(urList,config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};
Seccion.seccion_active = async () => {
    const urList = baseUrl + "/seccion_active";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .get(urList,config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Seccion.getSeccion = async () => {
    const urList = baseUrl + "/getSeccion";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .get(urList,config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Seccion.create = async (data) => {
    const urlvalida = baseUrl+"/seccionC";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .post(urlvalida, data,config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response;
        });
    return res;
};

Seccion.update = async (id,data) => {
    const urlvalida = baseUrl+"/seccionU/"+id;
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .put(urlvalida, data,config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response;
        });
    return res;
};

// Seccion.getPermisosPerfil= async (id) => {
//     const urList = baseUrl + "/perfil_edit/"+id;
//     const logueo=window.localStorage.getItem("logueo");
//     const user=JSON.parse(logueo);
//     const tokend=user.access_token;
//     const config = {
//         headers: { Authorization: `Bearer ${tokend}`}
//     };
//     const res = await axios
//         .get(urList,config)
//         .then((response) => {
//             return response.data;
//         })
//         .catch((error) => {
//             return error;
//         });
//     return res;
// };

Seccion.eliminar = async (id) => {
    const urlvalida = baseUrl+"/seccionD/"+id;
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .delete(urlvalida,config)
        .then((response) => {
           console.log(response);
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Seccion.getPdf = async (globalFilter) => {
    console.log(globalFilter);
    console.log("llego filtro");
    const urList = baseUrl + "/seccionReporte-pdf";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`},
        responseType: "blob" ,
        params: { search:globalFilter }, 
     };
    
    const res = await axios
        .get(urList,config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error;
        });
    return res;
};
export default Seccion;