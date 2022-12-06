<template>
  <div class="d-flex" id="wrapper">
    <MainSidebar/>
    <NavbarAndContent/>
  </div>
</template>

<script>
import MainSidebar from "@/components/MainSidebar";
import NavbarAndContent from "@/components/NavbarAndContent";
import "./assets/js/burgerscript"

export default {
  name: 'App',
  components: {
    MainSidebar,
    NavbarAndContent
  }
}

</script>

<style scoped>
@import "/public/css/style.css";
</style>
