import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`;

const register = async (username: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { username, password });
    return response.data;
  } catch {
    throw new Error("Erro ao cadastrar usuário");
  }
};

export default {
  register,
};
