import axios from "axios";
import { CommentType } from "../../entity/types";
import { useInfiniteQuery } from "@tanstack/vue-query";

// 5. TODO_1: useInfiniteQueries
const getCommentsByInfinite = async ({ pageParam = 1 }) => {
  const response = await axios.get<CommentType[]>(
    "https://jsonplaceholder.typicode.com/posts/" + pageParam + "/comments"
  );
  return response.data;
};

export const useInfiniteComments = () => {
  return useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: getCommentsByInfinite,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.length > 0 ? nextPage : undefined;
    },
  });
};
