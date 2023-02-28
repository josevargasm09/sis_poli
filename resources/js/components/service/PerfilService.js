import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Perfil = {};


Perfil.list = async () => {
    const urList = baseUrl + "/perfil";
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

Perfil.getPerfil = async () => {
    const urList = baseUrl + "/getPerfil";
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

Perfil.create = async (data) => {
    const urlvalida = baseUrl+"/perfilC";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .post(urlvalida, data,config)
        .then((response) => {
           console.log(response);
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Perfil.update = async (id,data) => {
    const urlvalida = baseUrl+"/perfilU/"+id;
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .put(urlvalida, data,config)
        .then((response) => {
           console.log(response);
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Perfil.getPermisosPerfil= async (id) => {
    const urList = baseUrl + "/perfil_edit/"+id;
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

Perfil.eliminar = async (id) => {
    const urlvalida = baseUrl+"/perfilD/"+id;
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

Perfil.getPdf = async (globalFilter) => {
    console.log(globalFilter);
    console.log("llego filtro");
    const urList = baseUrl + "/reportePerfil-pdf";
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
export default Perfil;