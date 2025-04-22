import { fetchWantedFBI } from "../services/fbi_service.js";
import axios from "axios";

jest.mock('axios');

describe('fetchwantedFBI',()=>{
    it('should fetch data successfully from FBI API', async ()=>{
        const mockData = {data: {items:[], total:0}};
        axios.get.mockResolvedValue(mockData);

        const result = await fetchWantedFBI({});
        expect(result).toEqual(mockData.data)
    });

})