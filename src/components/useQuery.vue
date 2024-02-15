<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { PostType } from '../assets/types'
import axios from 'axios';

const queryClient = useQueryClient()

// 1. (최초) 데이터 패칭 함수
const fetchPosts = async () => {
  try {
    console.log('refetch')

    const second = 1000;
    await new Promise(resolve => setTimeout(resolve, second * 3));
    const response = await axios.get<PostType[]>('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the posts:", error);
  }
}

// 2. (최초) useQuery를 사용하여 데이터 fetch
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
})

// 3. refetch 결과
const refetchOnClick = () => {
  const isHaveCacheData = queryClient.getQueryData(['posts'])

  if (isHaveCacheData) {
    console.log('Cache 데이터가 있으므로, 서버에게 요청하지 않음')
  } else {
    console.log('Cache 데이터가 없으므로, Query에 내장된 refetch 함수로 서버에게 재요청')
    refetch()
  }
}
</script>

<template>
  <h1>Posts</h1>

  <button @click="refetchOnClick">RefetchPosts Button</button>
  <ul v-if="data && data.length > 0">
    <li v-for="post in data" :key="post.id">
      <header class="header-layout">
        <h3 class="header-title">{{ post.title }}</h3>
        <span>{{ post.userId }}</span>
      </header>
      <p>{{ post.body }}</p>
    </li>
  </ul>
  <p v-else-if="isLoading">Loading posts...</p>
  <p v-else-if="error">Error fetching posts: {{ error.message }}</p>
</template>

<style scoped>
.header-layout {
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1 1 0;
  margin-right: 10px;
}
</style>