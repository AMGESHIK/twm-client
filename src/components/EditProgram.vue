<template>
  <div class="container-fluid">
    <h3 class="mt-3">Конструктор программы</h3>
    <Form @submit="sendProgram" class="mb-4 mt-4" style="column-gap: 10%;">
      <div style="width: 310px;" class="d-grid">
        <Field :value="name" :key="name" type="text" class="form-control mb-1" placeholder="Название" name="name"/>
        <Field :value="description" :key="description" as="textarea" class="form-control mb-1" rows="4"
               placeholder="Описание" style="resize: none;"
               name="description"/>
        <FieldArray name="training">
          <div v-for="(training, trainingIndex) in programComposition" :key="trainingIndex"
               class="d-grid mt-2 pb-2 px-2 rounded-3 bg-gradient" style="background: #e8e8e8;">
            <Field as="input" :name="`training[${trainingIndex}].number`" :value="trainingIndex+1" disabled
                   class="d-none"></Field>
            <div class="h5 text-center ">
              <span @click="removeTraining(training.id)" title="Удалить тренировку" style="cursor: pointer;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     fill="red" class="bi bi-x-lg"
                     viewBox="0 0 16 16">
                  <path
                      d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </span>
              Тренировка №{{ trainingIndex + 1 }}
              <span @click="hideTr(training.id)" style="cursor: pointer;">
                <span v-if="training.visible" title="Скрыть тренировку">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       class="bi bi-chevron-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                          d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                  </svg>
                </span>
                <span v-else title="Раскрыть тренировку">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       class="bi bi-chevron-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </span>
              </span>
            </div>
            <FieldArray name="composition">
              <div class="mt-2" v-show="training.visible"
                   v-for="(program, index) in programComposition.find(x => x.id === training.id).training "
                   :key="program.id">
                <div class="mb-1 d-flex justify-content-between align-items-center">
                  <span style="font-size: 18px;">{{ index + 1 }}</span>
                  <span @click="removeExercise(training.id, program.id)" title="Удалить упражнение"
                        style="cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16"
                         height="16"
                         fill="red"
                         class="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path
                          d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                    </svg>
                  </span>
                </div>
                <Field :name="`training[${trainingIndex}].composition[${index}].exercise`" as="select"
                       class="form-select mb-1"
                       aria-label="Default select example"
                       :value="program.exerciseId"
                       @change="this.programComposition[trainingIndex].training[index].exerciseId=$event.target.value"
                       :key="index">
                  <option selected hidden disabled>Выберите упражнение</option>
                  <optgroup v-for="(muscle) in allExercises.keys()" :key="muscle" :label="muscle">
                    <option v-for="ex in allExercises.get(muscle).keys()" :key="ex" :value="ex">
                      {{ allExercises.get(muscle).get(ex) }}
                    </option>
                  </optgroup>
                </Field>
                <div class="mb-1 d-flex gap-1">
                  <div class="form-floating">
                    <Field type="number" class="form-control" :value="program.sets"
                           :key="index"
                           :name="`training[${trainingIndex}].composition[${index}].amountsOfSets`"
                           @input="this.programComposition[trainingIndex].training[index].sets=$event.target.value"
                           placeholder="Подходы"/>
                    <label>Подходы</label>
                  </div>
                  <div class="form-floating">
                    <Field type="number" class="form-control" placeholder="Повторения"
                           :key="index"
                           :name="`training[${trainingIndex}].composition[${index}].amountsOfRepetitions`"
                           @input="this.programComposition[trainingIndex].training[index].repetitions=$event.target.value"
                           :value="program.repetitions"/>
                    <label>Повторения</label>
                  </div>
                </div>
              </div>
              <div v-show="!training.visible" class="fs-1 text-center rounded-3 lh-1 opacity-75"
                   style="letter-spacing: 20px; margin-top: -10px;">···
              </div>
            </FieldArray>
            <button v-show="training.visible" type="button" class="btn btn-dark" @click="addExercise(trainingIndex)">
              Добавить упражнение
            </button>
          </div>
        </FieldArray>
        <button type="button" class="btn btn-danger  mt-2" @click="addTraining()">Добавить тренировку</button>
        <input class="mt-4 btn btn-lg btn-primary d-block" type="submit" value="Сохранить программу"/>
      </div>
    </Form>
  </div>
</template>

<script>

import programService from "@/services/program.service";
import eventBus from "@/eventBus";
import {Field, Form} from "vee-validate";

export default {
  name: "EditProgram",
  components: {
    Form,
    Field
  },
  data() {
    return {
      name: null,
      description: null,
      programComposition: [],
      allExercises: new Map()
    };
  },
  created() {
    programService.getProgram(this.$route.params.programId).then(
        response => {
          this.name = response.data[0].program.name
          this.description = response.data[0].program.description
          for (const datum of response.data) {
            let exist = this.programComposition.find(x => x.number === datum.numberTraining);
            if (exist === undefined) {
              this.programComposition.push({
                number: datum.numberTraining,
                id: this.generateId,
                visible: true,
                training: [{
                  id: this.generateId,
                  exerciseText: datum.exercise.name,
                  exerciseId: datum.exercise.id,
                  sets: datum.amountsOfSets,
                  repetitions: datum.amountsOfRepetition
                }]
              })
            } else {
              exist.training.push({
                id: this.generateId,
                exerciseText: datum.exercise.name,
                exerciseId: datum.exercise.id,
                sets: datum.amountsOfSets,
                repetitions: datum.amountsOfRepetition
              })
            }
          }
        }
    )
  },
  computed: {
    generateId(){
      let rand
      let bool
      do{
        rand = Math.floor(Math.random()*10000)
        bool = this.programComposition.some(x=>x.id===rand)
        this.programComposition.forEach(x=>{
          if(x.training.some(y=> y.id === rand))
            bool = false
        })
      } while ( bool )
      return rand
    }
  },
  methods: {
    addExercise(trainingIndex) {
      this.programComposition[trainingIndex].training.push({
        id: this.generateId,
        exerciseText: null,
        exerciseId: "Выберите упражнение",
        sets: null,
        repetitions: null
      })
    },
    addTraining() {
      this.programComposition.push({
        id: this.generateId,
        visible: true,
        training: [{
          id: this.generateId,
          exerciseText: null,
          exerciseId: "Выберите упражнение",
          sets: null,
          repetitions: null
        }]
      })
    },
    removeExercise(trainingId, programId) {
      this.programComposition.forEach(
          x => {
            if (x.id === trainingId) {
              x.training = this.programComposition.find(x => x.id === trainingId).training.filter(x => x.id !== programId)
            }
          }
      )
    },
    removeTraining(trainingId) {
      this.programComposition = this.programComposition.filter(x => x.id !== trainingId)
    },
    sendProgram(program) {
      programService.putProgram(program, this.$route.params.programId)
      console.log(program)
      this.$router.push(`/diary/program/${this.$route.params.programId}`)
    },
    hideTr(id) {
      this.programComposition.forEach(
          x => {
            if (x.id === id) {
              x.visible = !x.visible
            }
          }
      )
    }
  },
  mounted() {
    programService.getAllExistingExercises().then(
        response => {
          let musMap = new Map();
          response.data.map(x => {
            if (!musMap.has(x.muscles)) {
              let exMap = new Map();
              musMap.set(x.muscles, exMap.set(x.id, x.name))
            } else {
              musMap.get(x.muscles).set(x.id, x.name)
            }
          })
          this.allExercises = musMap
        },
        error => {
          if (error.response && error.response.status === 403) {
            eventBus.dispatch("logout");
          }
        }
    )

  }
}
</script>

<style scoped>
</style>