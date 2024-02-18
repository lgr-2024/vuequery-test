<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { PostType } from "../entity/types";
import axios from "axios";
import { useGetPosts } from "../api/post/query";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import PostList from "./post/PostList.vue";
import ToggleComment from "./post/ToggleComment.vue";

const queryClient = useQueryClient();

// 2. COMPLETED_1: useQuery를 사용하여 fetch 데이터 cache
const { posts, postsError, isPostsFetching, refetchPosts } = useGetPosts();

// 3. COMPLETED_1: refetch 결과
const refetchOnClick = () => {
  const isHaveCacheData = queryClient.getQueryData(["posts"]);

  if (isHaveCacheData) {
    console.log("Cache 데이터가 있으므로, 서버에게 요청하지 않음");
  } else {
    console.log(
      "Cache 데이터가 없으므로, Query에 내장된 refetch 함수로 서버에게 재요청"
    );
    refetchPosts();
  }
};

// 4. TODO_1: useMutation
// 4.1. 업데이트 함수 생성 -> 서버에서 새로운 값을 업데이트하는 비동기 함수
// 4.1. (useMutation) 업데이트 함수 및 옵션 설정
// 4.2. 업데이트 함수 호출하는 핸들러 함수
const updatePostInPosts = async (newPost: PostType) => {
  const response = await axios.post<PostType[]>(
    "https://jsonplaceholder.typicode.com/posts",
    newPost
  );
  return response.data;
};

const useCreatePost = useMutation({
  mutationFn: updatePostInPosts,
  onSuccess: () => {
    console.log("invalidateQueries");
    queryClient.invalidateQueries({
      queryKey: ["posts"],
      refetchType: "active",
    });
  },
});

const handleUpdatePost = (newPost: PostType) => {
  useCreatePost.mutate(newPost);
};
</script>

<template>
  <ErrorBoundary>
    <h1>Post Lists</h1>

    <button @click="refetchOnClick">RefetchPosts Button</button>
    <button
      @click="
        handleUpdatePost({
          userId: 11,
          id: 101,
          title: 'new Title for useMutation',
          body: 'new Body for useMutation',
        })
      "
    >
      useCreatePost Button
    </button>
    <div>
      <PostList v-if="posts" :posts="posts" />
      <p v-if="isPostsFetching">Loading posts...</p>
      <p v-if="postsError">Error fetching posts: {{ postsError }}</p>
      <ToggleComment />
    </div>
  </ErrorBoundary>
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
  color: white;
}
</style>
