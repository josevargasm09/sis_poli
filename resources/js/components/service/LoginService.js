import axios from "axios";
const baseUrl = "http://127.0.0.1:8000/api";
const Login = {};
Login.list = async () => {
    const urList = baseUrl + "/role";
    const res = await axios
        .get(urList)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};


 
Login.logout = async () => {
    const logueo=window.localStorage.getItem("logueo");
    const user=JSON.parse(logueo);
    const tokend=user.access_token;

    const config = {
        headers: { Authorization: `Bearer ${tokend}`}
        
    };
    const urLogout = baseUrl + "/logout";
    const res = await axios
        .get(urLogout,config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};


Login.valida = async (data) => {
    const urlvalida = baseUrl + "/valida";
    const res = await axios
        .post(urlvalida, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};
Login.login = async (data) => {
    const urlvalida = baseUrl+"/login";
    const res = await axios
        .post(urlvalida, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};
// Login.ListMenu=async()=>{
//     const urlList=baseUrl+"/list_modulos"
//     const res=await axios.get(urlList)
//     .then(response=>{return response.data})
//     .catch(error =>{return error;})
//     console.log(res);
//     return res;

// }
Login.ListMenu = async (id) => {
    const urlGet = baseUrl + "/list_modulos/" + id;
    const res = await axios
        .get(urlGet)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
    return res;
};
export default Login;
