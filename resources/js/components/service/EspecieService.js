import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Especie = {};


Especie.list = async () => {
    const urList = baseUrl + "/especie";
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

Especie.getEspecie = async () => {
    const urList = baseUrl + "/getEspecie";
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

Especie.getEspecieSearch = async () => {
    const urList = baseUrl + "/get_especie_search";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .get(urList,config)
        .then((response) => {
            console.log(response.data);
            console.log('response');
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Especie.create = async (data) => {
    const urlvalida = baseUrl+"/especieC";
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

Especie.update = async (id,data) => {
    const urlvalida = baseUrl+"/especieU/"+id;
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

Especie.eliminar = async (id) => {
    const urlvalida = baseUrl+"/especieD/"+id;
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


Especie.getPdf = async (globalFilter) => {
    console.log(globalFilter);
    console.log("llego filtro");
    const urList = baseUrl + "/reporteEspecie-pdf";
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
export default Especie;