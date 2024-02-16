<script setup lang="ts">
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/vue-query'
import { CommentType, PostType } from '../assets/types'
import axios from 'axios';
import { ref } from 'vue';

const queryClient = useQueryClient()
const openComments = ref(false)

const toggleOpenComments = () => {
  openComments.value = !openComments.value
}

// 1. COMPLETED_1: 데이터 패칭 함수
const readPosts = async () => {
  try {
    console.log('refetch')

    await new Promise(resolve => setTimeout(resolve, 1000 * 2));
    const response = await axios.get<PostType[]>('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the posts:", error);
  }
}

// 2. COMPLETED_1: useQuery를 사용하여 fetch 데이터 cache
const useGetPosts = useQuery({
  queryKey: ['posts'],
  queryFn: readPosts, // Default Query Function가 정의되지 않았을 때만 Required

  // TODO_1: 5. Options 관리
  enabled: true,
  retry: 1000,
  retryDelay: 1000 * 10,
})

// 3. COMPLETED_1: refetch 결과
const refetchOnClick = () => {
  const isHaveCacheData = queryClient.getQueryData(['posts'])

  if (isHaveCacheData) {
    console.log('Cache 데이터가 있으므로, 서버에게 요청하지 않음')
  } else {
    console.log('Cache 데이터가 없으므로, Query에 내장된 refetch 함수로 서버에게 재요청')
    useGetPosts.refetch()
  }
}

// 4. TODO_1: useMutation
// 4.1. 업데이트 함수 생성 -> 서버에서 새로운 값을 업데이트하는 비동기 함수
// 4.1. (useMutation) 업데이트 함수 및 옵션 설정
// 4.2. 업데이트 함수 호출하는 핸들러 함수
const updatePostInPosts = async (newPost: PostType) => {
  const response = await axios.post<PostType[]>('https://jsonplaceholder.typicode.com/posts', newPost)
  return response.data
}

const useCreatePost = useMutation({
  mutationFn: updatePostInPosts,
  onSuccess: () => {
    console.log('invalidateQueries')
    queryClient.invalidateQueries({
      queryKey: ['posts'],
      refetchType: 'active',
    })
  }
})

const handleUpdatePost = (newPost: PostType) => {
  useCreatePost.mutate(newPost)
}

// 5. TODO_1: useInfiniteQueries
const getCommentsByInfinite = async ({ pageParam = 1 }) => {
  console.log(pageParam)
  const response = await axios.get<CommentType[]>("https://jsonplaceholder.typicode.com/posts/" + pageParam + "/comments")
  return response.data
}

const useInfiniteComments = useInfiniteQuery({
  queryKey: ['comments'],
  queryFn: getCommentsByInfinite,
  initialPageParam: 1,
  getNextPageParam: (lastPage, allPages) => {
    const nextPage = allPages.length + 1;
    return lastPage.length > 0 ? nextPage : undefined;
  },
})

</script>

<template>
  <h1>Posts</h1>

  <button @click="refetchOnClick">RefetchPosts Button</button>
  <button @click="handleUpdatePost({
    userId: 11,
    id: 101,
    title: 'new Title for useMutation',
    body: 'new Body for useMutation'
  })">useCreatePost Button</button>
  <div>
    <ul v-if="useGetPosts.data.value && useGetPosts.data.value.length > 0">
      <li v-for="post in useGetPosts.data.value" :key="post.id" class="post-style">
        <header class="header-layout">
          <h3 class="header-title">{{ post.title }}</h3>
          <span class="header-userId">{{ post.userId }}</span>
        </header>
        <p>{{ post.body }}</p>
      </li>
      <div>
        <h3>
          COMMENTS
          <button @click="toggleOpenComments">toggle comments</button>
        </h3>
        <div v-if="openComments">
          <div v-if="useInfiniteComments.isFetching && !useInfiniteComments.isFetchingNextPage">Fetching...</div>
          <ol v-for="(comments, index) in useInfiniteComments.data.value?.pages" :key="index">
            <li v-for="comment in comments" :key="comment.id">
              {{ comment.name }}
            </li>
          </ol>
          <button @click="() => useInfiniteComments.fetchNextPage()"
            :disable="!useInfiniteComments.hasNextPage || useInfiniteComments.isFetchingNextPage">
            <span v-if="useInfiniteComments.isFetchingNextPage">Loading more...</span>
            <span v-else-if="useInfiniteComments.hasNextPage">Load more...</span>
            <span v-else>Nothing more to load</span>
          </button>
        </div>
      </div>
    </ul>
    <p v-else-if="useGetPosts.isLoading">Loading posts...</p>
    <p v-else-if="useGetPosts.error">Error fetching posts: {{ useGetPosts.error.value?.message }}</p>
  </div>
</template>

<style scoped>
.post-style {
  border: 1px solid gray;
}

.header-layout {
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1 1 0;
  margin-right: 10px;
}

.header-userId {
  display: inline-block;
  width: 100px;
  height: 50px;
  line-height: 50px;
  background-color: gray;
  text-align: center;
  color: white
}
</style>