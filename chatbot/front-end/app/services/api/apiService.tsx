import { toast } from "react-toastify";
import { NexBeanApi } from "./apiConstant";
import api from "./axios";

// FIX: Updated to handle Axios error structures properly
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
};

export const getLogin = async (data: any, setIsLoading: any, navigate: any) => {
  setIsLoading(true);

  try {
    const response = await api.post(NexBeanApi.login, data);

    if (response?.status === 200) {
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("user", response?.data?.username);
      toast.success(response?.data?.message || "Login Successful");
      navigate.push("/home");
    }
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    toast.error(message);
    console.error("Login Error:", message);
  } finally {
    setIsLoading(false);
  }
};

export const getRegister = async (data: any, setIsLoading: any, navigate: any) => {
  setIsLoading(true);

  try {
    const response = await api.post(NexBeanApi.register, data);


    if (response?.status === 201) {
      toast.success(response?.data?.message || "Registration Successful");
      navigate.push("/auth/login");
    }
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    toast.error(message);
    console.error("Register Error:", message);
  } finally {
    setIsLoading(false);
  }
};

export const getForgotPassword = async (data: any) => {

  try {
    const response = await api.post(NexBeanApi.forgotpassword, data);


    if (response?.status === 201) {
      toast.success(response?.data?.message || "Registration Successful");
    }
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    toast.error(message);
    console.error("Register Error:", message);
  } 
};

export const getSendMessage = async (data: any, setIsLoading: any) => {
  setIsLoading(true);

  try {
    const response = await api.post(NexBeanApi.chat, data);
    console.log("API Response:", response);

    if (response?.status === 201 || response?.status === 200) {
      return response.data; 
    }
    
    return null; 
  } catch (error: any) {
    // FIX: Consistent use of getErrorMessage
    const message = getErrorMessage(error);
    
    toast.error(message);
    console.error("Chat API Error:", message);
    
    return null; 
  } finally {
    setIsLoading(false);
  }
};
export const getHistoryList = async () => {
 

  try {
    const response = await api.get(NexBeanApi.chatHistoryList);
    

    if (response?.status === 201 || response?.status === 200) {
      return response.data?.data; 
    }
    
    return null; 
  } catch (error: any) {
    // FIX: Consistent use of getErrorMessage
    const message = getErrorMessage(error);
    
    toast.error(message);
    console.error("Chat API Error:", message);
    
    return null; 
  } 
};
export const getChatHistory = async (id:any) => {
 

  try {
    const response = await api.get(`${NexBeanApi?.chatHistory}/${id}`);
   

    if (response?.status === 201 || response?.status === 200) {
      return response.data?.data; 
    }
    
    return null; 
  } catch (error: any) {
    const message = getErrorMessage(error);
    
    toast.error(message);
    console.error("Chat API Error:", message);
    
    return null; 
  } 
};

export const getProfileData=async()=>{
try {
    const response = await api.get(`${NexBeanApi?.getProfile}`);
   
console.log(response)
    if (response?.status === 201 || response?.status === 200) {
      return response.data?.data; 
    }
    
    return null; 
  } catch (error: any) {
    const message = getErrorMessage(error);
    
    toast.error(message);
    console.error("Chat API Error:", message);
    
    return null; 
  } 
};
