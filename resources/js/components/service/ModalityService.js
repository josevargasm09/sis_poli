import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Modality = {};


Modality.modality_active = async () => {
    const urList = baseUrl + "/modality_active";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .get(urList,config)
        .then((response) => {
            console.log("modality");
            console.log(response);
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};
Modality.list = async () => {
    const urList = baseUrl + "/modality_list";
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;
    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
    };
    const res = await axios
        .get(urList,config)
        .then((response) => {
            console.log("modality");
            console.log(response);
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};

Modality.create = async (data) => {
    const urlvalida = baseUrl+"/modality_create";
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

Modality.update = async (id,data) => {
    const urlvalida = baseUrl+"/modality_update/"+id;
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

// Modality.getPermisosPerfil= async (id) => {
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

Modality.eliminar = async (id) => {
    const urlvalida = baseUrl+"/modality_delete/"+id;
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
Modality.getPdf = async (globalFilter) => {
    const urList = baseUrl + "/report_modality_pdf";
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

export default Modality;