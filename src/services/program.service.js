import axios from '@/axiosInstance';

class ProgramService {
    getPrograms() {
        return axios.get("/diary");
    }
    getAllExistingExercises(){
        return axios.get("/diary/exercises");
    }
    postProgram(program){
        return axios.post("/diary/program", {
            name: program.name,
            description: program.description,
            programComposition : program.composition
        });
    }
}

export default new ProgramService();