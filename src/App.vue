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
import {useStompStore} from "@/stores/stomp.store";
import {useAuthUserStore} from "@/stores";

export default {
  name: 'App',
  components: {
    MainSidebar,
    NavbarAndContent
  },
  setup() {
    const stompStore = useStompStore();
    const authUserStore = useAuthUserStore();
    return {stompStore, authUserStore}
  },
  mounted() {
    if (this.authUserStore.status.loggedIn) {
      this.stompStore.connect("/ws", {})
    }
  },
  beforeUnmount() {
    if (this.stompStore.stompClient) {
      this.stompStore.disconnect()
    }
  }
}

</script>

<style scoped>
@import "@/assets/css/style.css";
</style>
