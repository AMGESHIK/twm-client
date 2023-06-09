<template>
  <div class="page-content-wrapper flex-grow-1" style="background-color: #eee;">
    <NavigationBar/>
    <router-view ></router-view>
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar";

export default {
  name: "PageContent",
  components:{
    NavigationBar
  }
}
</script>

<style scoped>

</style>