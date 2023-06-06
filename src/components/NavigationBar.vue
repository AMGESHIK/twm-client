<template>
  <nav class="navbar navbar-expand navbar-light bg-light border-bottom">
    <div class="container-fluid">
      <button class="btn btn-secondary navbar-toggler d-block" id="sidebarToggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
             class="bi bi-layout-text-sidebar" viewBox="0 0 16 16">
          <path
              d="M3.5 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM3 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"></path>
          <path
              d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm12-1v14h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 0H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9V1z"></path>
        </svg>
      </button>
      <div>
        <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <a class="nav-link" href="#!">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bell"
                   viewBox="0 0 16 16">
                <path
                    d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"></path>
              </svg>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#!">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                   class="bi bi-currency-dollar" viewBox="0 0 16 16">
                <path
                    d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"></path>
              </svg>
            </a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              <img src="../../public/img/person-circle.svg" alt="acc photo" class="me-2"
                   style="width: 30px; opacity: 50%;">
              <span v-if="loggedIn" class="">{{ this.authUserStore.user.username }}</span>
              <span v-else class="">Гость</span>
            </a>
            <div class=" dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <router-link :to="{name: 'profile', params:{username: this.authUserStore.user.username} }" v-if="loggedIn" class="dropdown-item">Профиль</router-link>
              <a href="auth/login" v-if="!loggedIn" class="dropdown-item">Вход</a>
              <a href="auth/logout" v-else @click.prevent="logout" class="dropdown-item">Выход</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import {useAuthUserStore} from "@/stores";
import eventBus from "@/eventBus";


export default {
  name: "NavigationBar",
  setup() {
    const authUserStore = useAuthUserStore();
    return {authUserStore}
  },
  data() {
    return {
      username: undefined
    }
  },
  methods: {
    logout() {
      this.authUserStore.logout();
      this.$router.push('/auth/login')
    }
  },
  computed: {
    loggedIn() {
      return this.authUserStore.status.loggedIn;
    }
  },
  mounted() {

    eventBus.on("logout", () => {
      this.logout()
    })
  },
  beforeUnmount() {
    eventBus.remove("logout")
  }
}
</script>

<style scoped>

</style>