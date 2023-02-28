import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Module = {};


Module.list = async () => {
    const urList = baseUrl + "/module";
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

Module.getModule = async () => {
    const urList = baseUrl + "/getModule";
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

// Module.create = async (data) => {
//     const urlvalida = baseUrl+"/ModuleC";
//     const logueo=window.localStorage.getItem("logueo");
//     const user=JSON.parse(logueo);
//     const tokend=user.access_token;
//     const config = {
//         headers: { Authorization: `Bearer ${tokend}`}
//     };
//     const res = await axios
//         .post(urlvalida, data,config)
//         .then((response) => {
//            console.log(response);
//         })
//         .catch((error) => {
//             return error;
//         });
//     return res;
// };

// Module.update = async (id,data) => {
//     const urlvalida = baseUrl+"/ModuleU/"+id;
//     const logueo=window.localStorage.getItem("logueo");
//     const user=JSON.parse(logueo);
//     const tokend=user.access_token;
//     const config = {
//         headers: { Authorization: `Bearer ${tokend}`}
//     };
//     const res = await axios
//         .put(urlvalida, data,config)
//         .then((response) => {
//            console.log(response);
//         })
//         .catch((error) => {
//             return error;
//         });
//     return res;
// };

// Module.eliminar = async (id) => {
//     const urlvalida = baseUrl+"/ModuleD/"+id;
//     const logueo=window.localStorage.getItem("logueo");
//     const user=JSON.parse(logueo);
//     const tokend=user.access_token;
//     const config = {
//         headers: { Authorization: `Bearer ${tokend}`}
//     };
//     const res = await axios
//         .delete(urlvalida,config)
//         .then((response) => {
//            console.log(response);
//         })
//         .catch((error) => {
//             return error;
//         });
//     return res;
// };
export default Module;