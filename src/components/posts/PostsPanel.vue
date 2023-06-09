<template>
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
  <div v-for="post in posts" :key="post.id" class="panel panel-white post shadow rounded bg-white mb-3">
    <div class="post-heading rounded">
      <div @click="$router.push(`/profile/${post.author}`)" class="pull-left image">
        <img :src="post.authorPhoto" class="rounded-circle avatar"
             alt="user profile image">
      </div>
      <div class="pull-left meta">
        <div class="">
          <a href="#" @click="$router.push(`/profile/${post.author}`)" class="text-decoration-none fw-bolder text-black" style="font-size: 17px;">{{ post.author }}</a>
        </div>
        <div class="text-muted time">{{ getTimeAgo(post.timestamp) }}</div>
      </div>
    </div>
    <div class="post-description">
      <div class="fs-6">{{ post.text }}</div>
    </div>
    <div class="post-image">
      <img :src="post.photo" class="image" alt="image post">
    </div>
    <div class="stats">
      <a href="#" class="btn btn-default stat-item">
        <i class="bi bi-heart icon"></i>
        <span>228</span>
      </a>
    </div>
    <div class="post-footer">
      <div class="input-group mb-3">
        <input type="text" v-model="post.newComment" class="form-control" placeholder="Написать комментарий"
               aria-label="comment"
               aria-describedby="basic-addon2">
        <div class="input-group-append">
          <span class="input-group-text" style="cursor: pointer;" @click="sendComment(post.newComment, post.id)"
                id="basic-addon2">Отправить</span>
        </div>
      </div>
      <ul class="comments-list">
        <li v-for="comment in post.comments" :key="comment.id" class="comment">
          <a class="pull-left" href="#">
            <img class="avatar rounded-circle" :src="comment.photo" alt="avatar">
          </a>
          <div class="comment-body">
            <div class="comment-heading">
              <h4 class="user">{{comment.username}}</h4>
              <h5 class="time">{{getTimeAgo(comment.timestamp)}}</h5>
            </div>
            <p>{{comment.text}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import postService from "@/services/post.service";
import filesService from "@/services/files.service";
import timeHelper from "@/helpers/time.helper";

export default {
  name: "PostsPanel",
  data() {
    return {
      posts: [{
        id: null,
        author: null,
        authorId: null,
        authorPhoto: null,
        timestamp: null,
        text: null,
        photo: null,
        likes: [],
        comments: [],
        newComment: null
      }]
    }
  },
  mounted() {
    postService.getPosts(10).then(
        resp => {
          this.posts = []
          resp.data.forEach(
              x => {
                postService.getPhoto(x.id).then(
                    resp2 => {
                      filesService.getProfilePhoto(x.authorId).then(
                          resp3 => {
                            this.posts.push({
                              id: x.id,
                              timestamp: x.timestamp,
                              author: x.author,
                              authorId: x.authorId,
                              authorPhoto: URL.createObjectURL(resp3.data),
                              text: x.text,
                              photo: URL.createObjectURL(resp2.data),
                              likes: x.postLikes,
                              comments: x.postComments
                            })
                            this.posts.sort((a, b) => b.timestamp - a.timestamp)
                            this.posts.map(
                                post => {
                                  if(post.comments.length>0) {
                                    post.comments.map(
                                        comment => {
                                          if (comment.userId) {
                                            filesService.getProfilePhoto(comment.userId).then(
                                                resp4 =>{
                                                  comment.photo = URL.createObjectURL(resp4.data)
                                                }
                                            )
                                          } else {
                                            comment.photo = null
                                          }
                                        }
                                    )
                                  }
                                }
                            )
                          }
                      )
                    }
                )
              })
        }
    )
  },
  methods: {
    getTimeAgo(timeInMillis) {
      return timeHelper.getTimeAgo(timeInMillis)
    },
    sendComment(text, id) {
      postService.createComment(text, id)
    }
  }
}
</script>

<style scoped>

.panel-shadow {
  box-shadow: rgba(0, 0, 0, 0.3) 7px 7px 7px;
}

.panel-white {
  border: 1px solid #dddddd;
}

.panel-white .panel-heading {
  color: #333;
  background-color: #fff;
  border-color: #ddd;
}

.panel-white .panel-footer {
  background-color: #fff;
  border-color: #ddd;
}

.post .post-heading {
  height: 70px;
  padding: 10px;
}

.post .post-heading .avatar {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 15px;
}

.post .post-heading .meta .title {
  margin-bottom: 0;
}

.post .post-heading .meta .title a {
  color: black;
}

.post .post-heading .meta .title a:hover {
  color: #aaaaaa;
}

.post .post-heading .meta .time {
  color: #999;
}

.post .post-image .image {
  width: 100%;
  height: auto;
}

.post .post-description {
  padding: 0 10px 3px 10px;
}

.post .post-description p {
  font-size: 14px;
}

.stats {
  margin: 7px 0;
}

.stats .stat-item {
  display: inline-block;
  background-color: #F1F1F1;
  margin-left: 10px;
}

.stats .stat-item .icon {
  margin-right: 8px;
}

.post .post-footer {
  border-top: 1px solid #ddd;
  padding: 15px;
}

.post .post-footer .input-group-addon a {
  color: #454545;
}

.post .post-footer .comments-list {
  padding: 0;
  margin-top: 20px;
  list-style-type: none;
}

.post .post-footer .comments-list .comment {
  display: block;
  width: 100%;
  margin: 20px 0;
}

.post .post-footer .comments-list .comment .avatar {
  margin-top: 5px;
  width: 35px;
  height: 35px;
}

.post .post-footer .comments-list .comment .comment-heading {
  display: block;
  width: 100%;
}

.post .post-footer .comments-list .comment .comment-heading .user {
  font-size: 14px;
  font-weight: bold;
  display: inline;
  margin-top: 0;
  margin-right: 10px;
}

.post .post-footer .comments-list .comment .comment-heading .time {
  font-size: 12px;
  color: #aaa;
  margin-top: 0;
  display: inline;
}

.post .post-footer .comments-list .comment .comment-body {
  margin-left: 50px;
}

.post .post-footer .comments-list .comment > .comments-list {
  margin-left: 50px;
}
</style>