import request from "./request";
const STRING="api/user";

const login=async(data)=>{
    const url=`${STRING}/Login`;
    return request.post(url,data).then((res)=>{
        return res;
    });
};

const create=async(data)=>{
    const url=`${STRING}`;
    return request.post(url,data).then((res)=>{
        return res;
    });
};

const authService={
    create,
    login
}

export default authService;