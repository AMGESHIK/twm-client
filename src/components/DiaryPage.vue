<template>
  <div class="container-fluid">

    <div class="">

      <div class="d-flex mt-4 gap-3">
        <h1 class="">Мои программы:</h1>
        <button @click="token">token()</button>
        <button @click="refresh">refresh()</button>
        <router-link to="/diary/addProgram" class="d-block align-self-center"
                     th:if="${#authorization.expression('isAuthenticated()')}">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28 " fill="gray" class="bi bi-plus-square "
               viewBox="0 0 16 16">
            <path
                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
            <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
        </router-link>
      </div>

      <div>
        <div class="d-flex gap-2 flex-wrap" th:if="${#authorization.expression('isAuthenticated()')}">
          <div class="fs-3" style="color: #a52834" th:if="${program.isEmpty()}">Добавьте свою программу
            тренировок
          </div>


          <form th:action="@{/diary}" action="/diary" class="card" th:each="program:${program}"
                style="flex: 0 0 250px;">
            <img src="../assets/logo.png" th:src="@{${program.photoURL}}" class="card-img-top p-2"
                 style="object-fit: cover" alt="card img">

            <div class="card-body">
              <h5 class="card-title" th:text="${program.name}"></h5>
              <p class="card-text" th:text="${program.description}"></p>
              <input type="hidden" name="programId" value="${program.id}" th:value="${program.id}">
              <input type="submit" class="btn btn-primary d-block" value="Перейти">
            </div>
          </form>


        </div>

        <div class="" th:if="${#authorization.expression('isAnonymous()')}">
          <div class="card position-relative" style="width: 250px;" aria-hidden="true">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="150" xmlns="http://www.w3.org/2000/svg"
                 role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false"><title>
              Placeholder</title>
              <rect width="100%" height="100%" fill="#868e96"></rect>
            </svg>

            <a href="/login">
              <div class="position-absolute top-50 start-50 translate-middle text-black"
                   style="z-index: 10; color:#1240AB">
                <img src="../assets/internet_lock_locked_padlock_password_secure_security_icon_127078.svg"
                     th:src="@{/img/internet_lock_locked_padlock_password_secure_security_icon_127078.svg}" alt=""
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
          <img src="../assets/logo.png" th:src="@{/img/Train with me 2.png}" class="card-img-top p-2"
               alt="...">

          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk
              of
              the
              card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>

      </div>
    </div>

  </div>
  <router-view></router-view>
</template>

<script>
import {useAuthUserStore} from "@/stores";

export default {
  name: "ContentPage",
  setup() {
    const authUserStore = useAuthUserStore();
    return {authUserStore}
  },
  methods: {
    token() {
      this.authUserStore.token().then(
          () => {
            this.$router.push('/diary')
          },
          (error) => {
            console.log(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString());
          }
      );
    },
    refresh() {
      this.authUserStore.refresh().then(
          () => {
            this.$router.push('/diary')
          },
          (error) => {
            console.log(
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString());
          }
      )
    }
  }
}
</script>

<style scoped>

</style>