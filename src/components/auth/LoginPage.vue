<template>
  <div class="text-center vsc-initialized">
    <main class="form-signin">
      <Form @submit="handleLogin" :validation-schema="schema">
        <router-link to="/">
          <img class="mb-4" src="../../../public/img/logo.png" alt="" width="200">
        </router-link>
        <h1 class="h3 mb-3 fw-normal">Вход</h1>

        <div class="form-floating">
          <Field type="email" class="form-control" placeholder="Email" name="email"/>
          <label for="email">Адрес электронной почты</label>
          <ErrorMessage name="email" class="text-danger"/>
        </div>

        <div class="form-floating mb-3">
          <Field type="password" class="form-control" placeholder="Password" name="password"/>
          <label for="password">Пароль</label>
          <ErrorMessage name="password" class="text-danger"/>
        </div>

        <!--        <div class="checkbox mb-3">-->
        <!--            <label>-->
        <!--                <input type="checkbox" value="remember-me"> Remember me-->
        <!--            </label>-->
        <!--        </div>-->
        <div class="form-group">
          <button class="w-100 btn btn-lg btn-primary" :disabled="loading">
            <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
            ></span>
            <span>Войти</span>
          </button>
        </div>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>

        <div class="mt-3">
          <router-link to="/auth/registration">Зарегистрировать аккаунт</router-link>
        </div>
      </Form>
    </main>
  </div>
</template>

<script>
import {Form, Field, ErrorMessage} from "vee-validate";
import * as yup from "yup";
import {useAuthUserStore} from "@/stores";

export default {
  name: "LoginPage",

  components: {
    Form,
    Field,
    ErrorMessage
  },

  setup(){
    const authUserStore = useAuthUserStore();
    return {authUserStore}
  },

  data() {
    const schema = yup.object().shape({
      email: yup.string().required("Требуется адрес электронной почты!"),
      password: yup.string().required("Требуется пароль!"),
    });
    return {
      loading: false,
      message: "",
      schema,
    };
  },

  computed: {
    loggedIn() {
      return this.authUserStore.status.loggedIn;
    }
  },

  created() {
    if (this.loggedIn) {
      this.$router.push("/diary");
    }
  },

  methods: {
    handleLogin(user) {
      this.loading = true;
      this.authUserStore.login(user).then( //this.authUserStore.dispatch("auth/login", user).then(
          () => {
            this.$router.push('/diary')
          },
          (error) => {
            this.loading = false;
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
      );
    },
  },
}

</script>

<style>

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}


</style>