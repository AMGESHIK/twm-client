import axios from '@/axiosInstance';

class ProgramService {
    getPrograms() {
        return axios.get("/diary");
    }
}

export default new ProgramService();