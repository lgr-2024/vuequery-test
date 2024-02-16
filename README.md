# Summary

프로젝트 적용성 검토를 위한 Tanstack Query 내 기능 예제 코드 구현

## 240215(목)

- useQuery로 데이터 caching

```
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
```

- Vue Query devtools 사용 방법

  - 관련 링크 (https://tanstack.com/query/latest/docs/framework/vue/devtools)

  1.  프로젝트 실행 : `npm run dev`
  2.  브라우저 상 우측 하단에 devtools 버튼 클릭
  3.  devtools 내 `['posts']` 클릭 후, 여러 상태 및 actions 테스트 가능

- 프로젝트 실행 방법
  1.  개발자 환경 > console 창 열기
  2.  RefetchButton 클릭
      2.1. `['posts']` 데이터가 cache에 있을 경우, 'Cache 데이터가 있으므로, 서버에게 요청하지 않음' 문구 출력
  3.  devtools 내 `['posts']` 를 Remove Action을 통해 삭제
      3.1. 'Cache 데이터가 없으므로, Query에 내장된 refetch 함수로 서버에게 재요청' 문구 출력

## 240216(금)

- 기능 추가

  1.  useMutation

      - `updatePostInPosts`, `useCreatePost`

        ```
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
        ```

  2.  useInfiniteQueries

      - `getCommentsByInfinite`, `useInfiniteComments`

        ```
           const getCommentsByInfinite = async ({ pageParam = 1 }) => {
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
        ```

- Vue Query v5 변경사항 요약

  1.  공통 사항
      1. useQuery를 필두로 API REFERENCE를 사용할 때, 객체로 Argument를 전달(Named Argument)하여 가독성 향상
  2.  useQuery
      1. onSuccess, onError, onSettled가 삭제됨
      2. useErrorBoundary -> throwOnError로 명칭 변경
  3.  useMutation
      1. cacheTime -> gcTime으로 명칭 변경
      2. useErrorBoundary -> throwOnError로 명칭 변경
  4.  useInfiniteQuery
      1. (Required) initialPageParam 옵션 신규 추가
         - 참고 링크 : https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5
      2. (Required) getNextPageParam도 Required로 변경
      3. (Option) getNextPageParam/getPreviousPageParam에 lastPageParam, allPageParam 추가
      4. (Option) maxPages 옵션 신규 추가
         - 참고 링크 : https://tanstack.com/query/v5/docs/framework/vue/reference/useInfiniteQuery

- Query v5 변경사항 REFERENCE
  1.  공식 문서 링크 : https://tanstack.com/query/latest/docs/framework/vue/guides/migrating-to-v5
  2.  번역 문서 링크(React인 점 참고) : https://wonsss.github.io/library/tanstack-query-v5/#7-%EC%A7%80%EC%9B%90-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EB%B3%80%EA%B2%BD
