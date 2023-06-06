<template>
  <div class="container-fluid">
    <div class="">
      <div class="d-flex mt-4 gap-3">
        <h1 class="">Мои программы:</h1>
        <router-link to="/diary/addProgram" class="d-block align-self-center hover-opacity" title="Добавить программу"
                     v-if="loggedIn" style="">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28 " fill="black"
               class="bi bi-plus-square hover-overlay" viewBox="0 0 16 16">
            <path
                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
            <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
        </router-link>
      </div>
      <div>
        <div class="d-flex gap-2 flex-wrap" v-if="loggedIn">
          <div class="fs-3" style="color: #a52834" v-if="programs.length<1">Добавьте свою программу тренировок</div>
          <div class="card" style="flex: 0 0 250px;" :key="program.id" v-for="program in programs">
            <img :src="program.photoURL" class="card-img-top p-2"
                 style="object-fit: cover; width: 200px; align-self: center;" alt="card img">
            <div class="card-body">
              <div class="d-flex justify-content-between" style="cursor: pointer;">
                <h5 class="card-title">{{ program.name }}</h5>
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
                    <span class="dropdown-item" @click="removeProgram(program.id)">Удалить</span>
                  </div>
                </div>
              </div>
              <p class="card-text">{{ program.description }}</p>
              <button class="btn btn-primary d-block" @click="$router.push(`/diary/program/${program.id}`)">Открыть
              </button>
            </div>
          </div>
        </div>
        <div class="" v-if="!loggedIn">
          <div class="card position-relative" style="width: 250px;" aria-hidden="true">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="150" xmlns="http://www.w3.org/2000/svg"
                 role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false"><title>
              Placeholder</title>
              <rect width="100%" height="100%" fill="#868e96"></rect>
            </svg>
            <a href="/login">
              <div class="position-absolute top-50 start-50 translate-middle text-black"
                   style="z-index: 10; color:#1240AB">
                <img src="../../public/img/internet_lock_locked_padlock_password_secure_security_icon_127078.svg" alt=""
                     class="d-block mx-auto">
                <div class="text-center h5 mt-2" style="text-shadow: white 1px 1px 1px;}">
                  Войдите, чтобы пользоваться личными программами
                </div>
              </div>
            </a>
            <div class="card-body">
              <h5 class="card-title placeholder-glow">
                <span class="placeholder col-6"></span>
              </h5>
              <p class="card-text placeholder-glow">
                <span class="placeholder col-7"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-4"></span>
                <span class="placeholder col-6"></span>
                <span class="placeholder col-8"></span>
              </p>
              <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h1 class="mt-4">Готовые программы:</h1>
      <div class="d-flex gap-2 flex-wrap">
        <div class="card " style="flex: 0 0 250px;">
          <img src="../../public/img/logo.png" class="card-img-top p-2"
               alt="...">
          <div class="card-body">
            <h5 class="card-title">Набор мышечной массы</h5>
            <p class="card-text">Программа предназначена для новчиков. Цель программы набор мышечной массы.</p>
            <a href="#" class="btn btn-primary">Открыть</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import {useAuthUserStore} from "@/stores";
import programService from "@/services/program.service";
import eventBus from "@/eventBus";

export default {
  name: "ContentPage",
  data() {
    return {
      programs: [{}]
    }
  },
  setup() {
    const authUserStore = useAuthUserStore();
    return {authUserStore}
  },
  created() {
    if(this.loggedIn) {
      programService.getPrograms().then(
          response => {
            this.programs = response.data
          },
          error => {
            if (error.response && error.response.status === 403) {
              eventBus.dispatch("logout");
            }
          }
      );
    }
  },
  computed: {
    loggedIn() {
      return this.authUserStore.status.loggedIn;
    }

  },
  methods: {
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
.hover-opacity:hover {
  opacity: 70%;
}
</style>