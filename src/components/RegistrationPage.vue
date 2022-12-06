<template>
  <div class="text-center vsc-initialized">
    <main class="form-signin">
      <Form @submit="handleRegister" :validation-schema="schema">
        <a href="/">
          <img class="mb-4" src="../assets/logo.png" th:src="@{/img/Train with me 2.png}" alt=""
               width="200">
        </a>
        <h1 class="h3 mb-3 fw-normal">Регистрация</h1>

        <div class="form-floating">
          <Field type="text" class="form-control" placeholder="Username" name="username"/>
          <label for="username">Имя пользователя</label>
          <ErrorMessage name="username" class="text-danger"/>
        </div>

        <div class="form-floating">
          <Field type="email" class="form-control" placeholder="Email" name="email"/>
          <label for="email">Электронная почта</label>
          <ErrorMessage name="email" class="text-danger"/>
        </div>

        <div class="form-floating">
          <Field type="password" class="form-control" placeholder="Password" name="password"/>
          <label for="password">Пароль</label>
          <ErrorMessage name="password" class="text-danger"/>
        </div>

        <!--        <div class="form-floating mb-3">-->
        <!--          <input type="password" class="form-control" placeholder="passwordConfirm" name="passwordConfirm">-->
        <!--          <label>Подтверждение пароля</label>-->
        <!--        </div>-->

        <input class="w-100 btn btn-lg btn-primary" type="submit" value="Зарегистрировать">
      </Form>
      <div
          v-if="message"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
    </main>
  </div>
</template>

<script>
import {Form, Field, ErrorMessage} from "vee-validate";
import * as yup from "yup";
import {useAuthUserStore} from "@/stores";

export default {
  name: "RegistrationPage",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const authUserStore = useAuthUserStore();
    return {authUserStore}
  },

  data() {
    const schema = yup.object().shape({
      username: yup
          .string()
          .required("Требуется имя пользователя!")
          .min(3, "Должно быть не менее 3 символов!")
          .max(20, "Должно быть не более 20 символов!"),
      email: yup
          .string()
          .required("Требуется эл. почта!")
          .email("Электронная почта недействительна!")
          .max(50, "Должно быть не более 50 символов!"),
      password: yup
          .string()
          .required("Требуется пароль!")
          .min(4, "Должно быть не менее 4 символов!")
          .max(40, "Должно быть не более 40 символов!"),
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema
    };
  },
  computed: {
    loggedIn() {
      return this.authUserStore.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/diary");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;

      this.authUserStore.register(user).then(
          (data) => {
            this.message = data.message;
            this.successful = true;
            this.loading = false;
          },
          (error) => {
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            this.successful = false;
            this.loading = false;
          }
      );
    },
  },
}
</script>

<style scoped>

</style>