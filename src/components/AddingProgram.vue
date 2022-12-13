<template>
  <div class="container-fluid">
    <h3 class="mt-3">Конструктор программы</h3>
    <Form @submit="sendProgram" class="mb-4 mt-4" style="column-gap: 10%;">
      <div style="width: 300px;" class="d-grid">
        <Field type="text" class="form-control mb-1" placeholder="Название" name="name"/>
        <Field as="textarea" class="form-control" rows="4" placeholder="Описание" style="resize: none;"
               name="description"/>
        <FieldArray name="composition">
          <div class="mt-2" v-for="(program, index) in programComposition" :key="index">
            <div class="mb-1 d-flex justify-content-between align-items-center">
              <span style="font-size: 18px;">{{ index + 1 }}</span>
              <svg @click="removeExercise(index)" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                   fill="currentColor"
                   class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path
                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
              </svg>
            </div>
            <Field :name="`composition[${index}].exercise`" as="select" class="form-select mb-1" aria-label="Default select example"
                   :value="program.exerciseId"
                   @change="this.programComposition[index].exerciseId=$event.target.value" :key="index">
              <!--          <select class="form-select mb-1" aria-label="Default select example" @change="print">-->
              <option selected hidden disabled>Выберите упражнение</option>
              <optgroup v-for="(muscle, musIndex) in allExercises.keys()" :key="musIndex" :label="muscle">
                <option v-for="ex in allExercises.get(muscle).keys()" :key="ex" :value="ex">
                  {{ allExercises.get(muscle).get(ex) }}
                </option>
              </optgroup>
            </Field>
            <div class="mb-1 d-flex gap-1">
              <div class="form-floating">
                <Field type="number" class="form-control" :value="program.sets" :name="`composition[${index}].amountsOfsSets`"
                       @input="this.programComposition[index].sets=$event.target.value"
                       placeholder="Подходы"/>
                <label>Подходы</label>
              </div>
              <div class="form-floating">
                <Field type="number" class="form-control" placeholder="Повторения" :name="`composition[${index}].amountsOfRepetitions`"
                       @input="this.programComposition[index].repetitions=$event.target.value"
                       :value="program.repetitions"/>
                <label>Повторения</label>
              </div>
            </div>
          </div>
      </FieldArray>
        <button type="button" class="btn btn-dark" @click="addExercise">Добавить упражнение</button>
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
  name: "AddingProgram",
  components: {
    Form,
    Field
  },
  data() {
    return {
      name: null,
      description: null,
      programComposition: [{
        exerciseText: null,
        exerciseId: "Выберите упражнение",
        sets: null,
        repetitions: null
      }],
      allExercises: new Map()
    };
  },
  methods: {
    addExercise() {
      this.programComposition.push({
        exerciseText: null,
        exerciseId: "Выберите упражнение",
        sets: null,
        repetitions: null
      })
    },
    removeExercise(index) {
      this.programComposition.splice(index, 1)
    },
    sendProgram(program) {
      programService.postProgram(program)
    }
  },
  mounted() {
    programService.getAllExistingExercises().then(
        response => {
          // this.allExercises = response.data
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