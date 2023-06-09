<template>
  <div class=" mt-2 " style="max-width: 700px; margin: 0 auto;">
    <CreatePostPanel></CreatePostPanel>
    <PostsPanel></PostsPanel>
  </div>
</template>

<script>
import CreatePostPanel from "@/components/posts/CreatePostPanel";
import PostsPanel from "@/components/posts/PostsPanel";

export default {
  name: "NewsFeed",
  components: {
    CreatePostPanel,
    PostsPanel
  }
}
</script>

<style scoped>

</style>