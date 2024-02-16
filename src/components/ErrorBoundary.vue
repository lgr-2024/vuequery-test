<script setup lang="ts">

import { onErrorCaptured, ref } from 'vue';

const errorEixst = ref(false);
onErrorCaptured(handler);

function handler(e: Error) {
  console.log('I capture the error', e)
  errorEixst.value = true
}
</script>

<template>
  <div>
    <div v-if="errorEixst">에러가 있단다</div>
    <slot></slot>
  </div>
</template>

<style></style>