<template>
  <div class="container-fluid">

    <h3 class="mt-3">
      Конструктор программы
    </h3>

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
export default {
  name: "AddingProgram"
}
</script>

<style scoped>

</style>