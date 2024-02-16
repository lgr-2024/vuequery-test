<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import QueryTest from './components/useQuery.vue'
import ErrorBoundary from './components/ErrorBoundary.vue';
</script>

<template>
  <VueQueryDevtools />
  <ErrorBoundary>
    <QueryTest />
  </ErrorBoundary>
</template>

<style scoped></style>
