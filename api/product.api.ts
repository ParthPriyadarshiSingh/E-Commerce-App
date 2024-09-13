import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const getAll = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.log("getAll error: ", error);
  }
};

export default getAll;
