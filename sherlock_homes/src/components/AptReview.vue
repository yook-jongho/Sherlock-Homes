<template>
    <div>
        <span>홈즈 평가</span>
        <div v-for="(review, index) in props.reviews.reviewList" :key="index">
            <span> {{ review.category }} </span>
            <span> 점수 {{ review.score }} / 10 </span>
        </div>
        <div>
            <span> 총점 {{ props.reviews.totalScore }}</span>
            <span> 총평 {{ props.reviews.totalComment }} </span>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps(["reviews"]);
</script>
<style scoped></style>
