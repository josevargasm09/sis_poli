import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Libro = {};


Libro.book_active = async () => {
    const urList = baseUrl + "/book_active";
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
Libro.list = async () => {
    const urList = baseUrl + "/libro";
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

Libro.getLibro = async () => {
    const urList = baseUrl + "/getLibro";
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

Libro.create = async (data) => {
    const urlvalida = baseUrl+"/libroC";
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

Libro.update = async (id,data) => {
    const urlvalida = baseUrl+"/libroU/"+id;
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

Libro.eliminar = async (id) => {
    const urlvalida = baseUrl+"/libroD/"+id;
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

Libro.getPdf = async (globalFilter) => {
    console.log(globalFilter);
    console.log("llego filtro");
    const urList = baseUrl + "/libroReporte-pdf";
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
export default Libro;