import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import { PostType } from "../../entity/types";
import { computed } from "vue";

export const useGetPosts = () => {
  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: readPosts, // Default Query Function가 정의되지 않았을 때만 Required

    // TODO_1: 5. Options 관리
    // enabled: true,
    // retry: 1000,
    // retryDelay: 1000 * 10,
    retry: 0,
    throwOnError: true,
  });

  return {
    posts: computed(() => data.value),
    postsError: computed(() => error.value),
    isPostsFetching: computed(() => isFetching.value),
    refetchPosts: refetch,
  };
};

// 1. COMPLETED_1: 데이터 패칭 함수
const readPosts = async () => {
  throw new Error("my test error");
  try {
    console.log("refetch");

    await new Promise((resolve) => setTimeout(resolve, 1000 * 2));
    const response = await axios.get<PostType[]>(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the posts:", error);
  }
};
