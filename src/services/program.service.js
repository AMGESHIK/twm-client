import axios from '@/axiosInstance';

class ProgramService {
    getPrograms() {
        return axios.get("/diary");
    }

    getAllExistingExercises() {
        return axios.get("/diary/exercises");
    }

    postProgram(program) {
        let programComposition = []
        for (let trainingKey of program.training) {
            for (let compositionKey of trainingKey.composition) {
                programComposition.push({numberTraining: trainingKey.number, ...compositionKey})
            }
        }
        return axios.post("/diary/program", {
            name: program.name,
            description: program.description,
            programComposition: programComposition
        });
    }
    putProgram(program, id) {
        let programComposition = []
        for (let trainingKey of program.training) {
            for (let compositionKey of trainingKey.composition) {
                programComposition.push({numberTraining: trainingKey.number, ...compositionKey})
            }
        }
        return axios.put(`/diary/program/${id}`, {
            name: program.name,
            description: program.description,
            programComposition: programComposition
        });
    }


    getProgram(id) {
        return axios.get("/diary/program", {
            params: {
                id: id
            }
        });
    }

    removeProgram(id) {
        return axios.delete("/diary/program", {
            params: {
                id:id
            }
        })
    }
}

export default new ProgramService();