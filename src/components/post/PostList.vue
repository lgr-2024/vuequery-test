<template>
  <ul v-if="posts && posts.length > 0">
    <PostItem v-for="post in posts" :key="post.id" :post="post" class="post-style">
      <header class="header-layout">
        <h3 class="header-title">{{ post.title }}</h3>
        <span class="header-userId">{{ post.userId }}</span>
      </header>
      <p>{{ post.body }}</p>
    </PostItem>
  </ul>
</template>

<script setup lang="ts">
import { PostType } from '../../entity/types';
import PostItem from './PostItem.vue';

defineProps<{
  posts: PostType[]
}>();
</script>

<style scoped></style>