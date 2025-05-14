import axios from "@/config/axios_customize";

export const registerApi = async (name: string, email: string, password: string) =>{
    return axios.post("/api/v1/auth/register", {
        name,
        email,
        password
    })
}
