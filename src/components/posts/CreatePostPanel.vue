<template>
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
  <div class="panel bg-white rounded shadow">
    <div class="panel-body">
      <textarea v-model="text" class="form-control" rows="1" placeholder="Что у вас нового?"></textarea>
      <img v-if="photoURl" :src="photoURl" class="image" alt="image for upload">
      <div class="mar-top clearfix">
        <button class="btn btn-sm btn-primary pull-right" @click="createPost" type="submit"><i
            class="fa fa-pencil fa-fw"></i> Поделиться
        </button>
        <!--            <a class="btn btn-trans btn-icon fa fa-video-camera add-tooltip" href="#" data-original-title="Add Video" data-toggle="tooltip"></a>-->
        <input type="file" id="upload-post-photo" accept=".jpeg, .jpg, .png" hidden @change="handleFileChange">
        <label for="upload-post-photo" class="btn btn-trans btn-icon fa fa-camera add-tooltip"
               data-original-title="Add Photo"
               data-toggle="tooltip"></label>
        <!--            <a class="btn btn-trans btn-icon fa fa-file add-tooltip" href="#" data-original-title="Add File" data-toggle="tooltip"></a>-->
      </div>
    </div>
  </div>
</template>

<script>
import postService from "@/services/post.service";

export default {
  name: "CreatePostPage",
  data() {
    return {
      text: null,
      photo: null,
      photoURl: null
    }
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]
      this.photo = file
      this.photoURl = URL.createObjectURL(file)
    },
    createPost() {
      postService.createPost(this.text, this.photo)
          .then(response => {
            console.log('Success:', response.data);
            this.photoURl = null
            this.text = null
            this.photoURl = null
            // Обработка успешного ответа от сервера
          })
          .catch(error => {
            console.error('Error:', error);
            // Обработка ошибки
          });
    }
  }
}
</script>

<style scoped>
body {
  margin-top: 20px;
  background: #ebeef0;
}

.panel {
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.075);
  border-radius: 0;
  border: 0;
  margin-bottom: 15px;
}

.panel-body {
  padding: 25px 20px;
}

.mar-top {
  margin-top: 15px;
}

.image {
  margin-top: 5px;
  padding: 5px;
  max-width: 100%;
  max-height: 400px;
}
</style>