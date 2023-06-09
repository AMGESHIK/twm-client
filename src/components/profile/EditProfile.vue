<template>
  <section style="background-color: #eee;">
    <div class="container py-5" style="max-width: 1000px;">
      <div class="row">
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-body text-center">
              <img :src="profileInfo.photo" alt="avatar"
                   class="rounded-circle img-fluid" style="width: 150px; height: 150px; object-fit: cover;">
              <h5 class="my-3">{{ profileInfo.username }}</h5>
              <div class="mb-3">
                <input type="file" id="upload-photo" accept=".jpeg, .jpg, .png" hidden @change="handleFileChange">
                <label for="upload-photo" class="link-primary text-decoration-none" style="cursor: pointer;">Сменить
                  фото</label>
              </div>
              <button v-if="savePhotoBtnStatus" class="btn btn-primary" @click="uploadPhoto">Сохранить</button>
            </div>
          </div>
          <div class="card mb-4 mb-lg-0">
            <div class="card-body p-0">
              <ul class="list-group list-group-flush rounded-3">
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="bi bi-globe" style="color: orange;"></i>
                  <p class="mb-0">https://mdbootstrap.com</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <i class="bi bi-telegram colo" style="color: #0c63e4;"></i>
                  <p class="mb-0">mdbootstrap</p>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#0c63e4" width="20" height="20" viewBox="0 0 24 24">
                    <path class="st0"
                          d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/>
                  </svg>
                  <p class="mb-0">@mdbootstrap</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card mb-4">
            <Form @submit="saveProfile" class="card-body">
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Имя</p>
                </div>
                <div class="col-sm-9">
                  <Field name="name" v-model="profileInfo.name" class="text-muted mb-0"></Field>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Эл. почта</p>
                </div>
                <div class="col-sm-9">
                  <Field name="email" v-model="profileInfo.email" class="text-muted mb-0"></Field>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Телефон</p>
                </div>
                <div class="col-sm-9">
                  <Field name="mobile" v-model="profileInfo.mobile" class="text-muted mb-0"></Field>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Адрес</p>
                </div>
                <div class="col-sm-9">
                  <Field name="address" v-model="profileInfo.address" class="text-muted mb-0"></Field>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-3">
                  <p class="mb-0">Обо мне</p>
                </div>
                <div class="col-sm-9">
                  <Field as="textarea" name="about" v-model="profileInfo.about" rows="7"
                         class="text-muted mb-0 form-control" style="resize: none;"></Field>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Сохранить</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {useAuthUserStore} from "@/stores";
import userService from "@/services/user.service";
import filesService from "@/services/files.service";
import {Field, Form} from "vee-validate";
import TokenService from "@/services/token.service";

export default {
  name: "EditProfile",
  setup() {
    const authStore = useAuthUserStore();
    return {authStore}
  },
  components: {
    Form,
    Field,
  },
  data() {
    return {
      profileInfo: {
        about: null,
        address: null,
        email: null,
        mobile: null,
        name: null,
        photo: null,
        username: null,
        userId: null,
      },
      newPhoto: null,
      savePhotoBtnStatus: false,
    }
  },
  beforeCreate() {
    if (TokenService.getUser().username !== this.$route.params.username) {
      this.$router.push("/");
    }
  },
  mounted() {
    userService.getProfile(this.$route.params.username).then(
        response => {
          this.profileInfo = response.data
          filesService.getProfilePhoto(response.data.userId).then(
              response => {
                this.profileInfo.photo = URL.createObjectURL(response.data)
              },
              error => {
                console.log(error)
              }
          )
        },
        error => {
          console.log(error)
        }
    )
  },
  methods: {
    saveProfile(profileInfo) {
      userService.setProfile(profileInfo)
      this.$router.go()
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      this.newPhoto = file
      this.profileInfo.photo = URL.createObjectURL(file)
      this.savePhotoBtnStatus = true
    },
    uploadPhoto(){
      filesService.setProfilePhoto(this.newPhoto).then(
          response => {
            console.log(response.data)
            this.$router.go()
          }
      )
    }
  }
}
</script>

<style scoped>

</style>