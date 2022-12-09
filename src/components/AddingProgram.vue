<template>
  <div class="container-fluid">

    <h3 class="mt-3">
      Конструктор программы
    </h3>
    <div>{{ message }}</div>

    <form class="mb-4 mt-4" style="column-gap: 10%;" th:action="@{/diary/addProgram}" action="/diary/addProgram"
          method="post">

      <div style="width: 300px;"><input type="text" class="form-control" placeholder="Название" name="name">
        <textarea class="form-control" rows="4" placeholder="Описание" style="resize: none;"
                  name="description"></textarea>
      </div>
      <input class="mt-2 btn btn-lg btn-primary d-block" type="submit" value="Создать">

    </form>


  </div>
</template>

<script>
import userService from "@/services/user.service";
import eventBus from "@/eventBus";

export default {
  name: "AddingProgram",
  data() {
    return {
      message: "",
    };
  },
  mounted() {
    userService.getUserBoard().then(
        response => {
          this.message = response.data
        },
        error => {
          this.content =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();

          if (error.response && error.response.status === 403) {
            eventBus.dispatch("logout");
          }
        }
    );
  }
}
</script>

<style scoped>

</style>