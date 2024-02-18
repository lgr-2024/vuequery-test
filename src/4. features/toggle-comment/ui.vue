<script setup lang="ts">
import { ref } from "vue";
import { useInfiniteComments } from "../../api/comment/query";

const { data, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } =
  useInfiniteComments();

const openComments = ref(false);

const toggleOpenComments = () => {
  openComments.value = !openComments.value;
};
</script>

<template>
  <div>
    <h3>
      COMMENTS
      <button @click="toggleOpenComments">toggle comments</button>
    </h3>
    <div v-if="openComments">
      <div v-if="isFetching && !isFetchingNextPage">Fetching...</div>
      <ol v-for="(comments, index) in data?.pages" :key="index">
        <li v-for="comment in comments" :key="comment.id">
          {{ comment.name }}
        </li>
      </ol>
      <button
        @click="() => fetchNextPage()"
        :disable="!hasNextPage || isFetchingNextPage"
      >
        <span v-if="isFetchingNextPage">Loading more...</span>
        <span v-else-if="hasNextPage">Load more...</span>
        <span v-else>Nothing more to load</span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
