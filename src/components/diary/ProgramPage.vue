<template>
  <div class="m-3" style="max-width: 450px;">
    <div class="d-flex justify-content-between">
      <h3>{{ name }}</h3>
      <div class="dropdown">
        <div class="" id="programDropdown" href="#" role="button" data-bs-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path
                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          </svg>
        </div>
        <div class=" dropdown-menu dropdown-menu-end" aria-labelledby="programDropdown">
          <router-link :to="{name:'editProgram', params: {programId: $route.params.programId}}" class="dropdown-item" >Редактировать</router-link>
          <span class="dropdown-item" @click="removeProgram($route.params.programId)">Удалить</span>
        </div>
      </div>
    </div>
    <div class="fs-5 mb-2">{{ description }}</div>
    <div>
      <div v-for="composition in programComposition" :key="composition" class="mt-3 p-2 shadow-sm rounded bg-white"
           style="background: #e8e8e8;">
        <div class="h5 text-center">Тренировка №{{ composition.number }}</div>
        <div v-for="(training, idx) in composition.training" :key="idx" class="d-flex">
          <div class="d-inline-block col-8">
            <div style="color: #2DC4B5; font-weight: 500;">Упражнение</div>
            <div>{{ training.exerciseText }}</div>
          </div>
          <div class="d-inline-block col-2 px-2">
            <div style="color: #2DC4B5; font-weight: 500;">Подх.</div>
            <div>{{ training.sets }}</div>
          </div>
          <div class="d-inline-block col-2">
            <div style="color: #2DC4B5; font-weight: 500;">Повт.</div>
            <div>{{ training.repetitions }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import programService from "@/services/program.service";

export default {
  name: "ProgramPage",
  data() {
    return {
      name: null,
      description: null,
      programComposition: []
    }
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
                training: [{
                  exerciseText: datum.exercise.name,
                  sets: datum.amountsOfSets,
                  repetitions: datum.amountsOfRepetition
                }]
              })
            } else {
              exist.training.push({
                exerciseText: datum.exercise.name,
                sets: datum.amountsOfSets,
                repetitions: datum.amountsOfRepetition
              })
            }
          }
        }
    )
  },
  methods:{
    removeProgram(id) {
      programService.removeProgram(id).then(
          () =>{
            this.programs = this.programs.filter(x => x.id !== id)
          }
      )
    }
  }
}
</script>

<style scoped>

</style>