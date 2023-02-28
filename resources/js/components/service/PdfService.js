import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Reporte = {};

// Reporte.getReporte = async () => {
//     const urList = baseUrl + "/reporte-pdf";
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
Reporte.getPdf = async (globalFilter) => {
    console.log(globalFilter);
    console.log("llego filtro");
    const urList = baseUrl + "/reporte-pdf";
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

export default Reporte;
// export {baseUrl, axios};





