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
