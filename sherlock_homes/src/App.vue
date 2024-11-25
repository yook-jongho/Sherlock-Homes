<template>
    <HomeView></HomeView>
</template>

<script setup>
import HomeView from "./views/HomeView.vue";
import { userChoiceState } from "./stores/store";
import { watch } from "vue";

const userChoice = userChoiceState();
watch(
    () => [userChoice.location, userChoice.header],
    ([newLocation, newHeader], [oldLocation, oldHeader]) => {
        // console.log("Location 상태 변경:", {
        //     이전값: oldLocation,
        //     현재값: newLocation,
        // });
        // console.log("Header 상태 변경:", {
        //     이전값: oldHeader,
        //     현재값: newHeader,
        // });
    },
    { deep: true } // 중첩된 상태 변화 감지
);
</script>

<style scoped></style>
