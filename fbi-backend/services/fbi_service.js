import axios from 'axios';

const BASE_URL = 'https://api.fbi.gov/wanted/v1/list';

export const fetchWantedFBI = async(filters)=> {
    try{
        const params = new URLSearchParams(filters).toString();
        const url = `${BASE_URL}?${params}`;

        const response = await axios.get(url,{
            headers: {
                'User-Agent': 'Mozilla/5.0 (Node.js)', 
                'Accept': 'application/json',
              },
        });
        return response.data;
    } catch (error){
        console.error('Error fetching data from FBI API:', error.message)
        throw new Error('FBI API unavailable')
    }
};
