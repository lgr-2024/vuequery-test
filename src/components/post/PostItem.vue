<template>
  <li class="post-style">
    <header class="header-layout">
      <h3 class="header-title">{{ post.title }}</h3>
      <span class="header-userId">{{ post.userId }}</span>
    </header>
    <p>{{ post.body }}</p>
  </li>
</template>

<script setup lang="ts">
import { PostType } from '../../entity/types';

defineProps<{
  post: PostType
}>();
</script>

<style scoped></style>