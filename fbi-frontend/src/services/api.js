import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/fbiwanted';

export async function getWantedList(filters){
    const params = new URLSearchParams(filters).toString();
    try{
        const response = await axios.get(`${API_BASE}?${params}`);
        return response.data;
    }catch (error){
        throw error.response?.data || {message: 'Unknown error occurred'};
    }

}

export async function getWantedPersonById(id){
    try{
        const response = await axios.get(`${API_BASE}/${id}`);
        return response.data;
    }catch (error){
        throw error.response?.data || {message: 'Unknown error occurred in getWantedPersonByid'};
    }
} 
