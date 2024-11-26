<template>
    <div class="reviewContainer">
        <div
            class="category"
            v-for="(review, index) in props.reviews.standard.reviewList"
            :key="index"
        >
            <span> {{ review.category }} </span>
            <span> 점수 {{ review.score }} / 10 </span>
        </div>
        <div class="totalBox">
            <span> 총점 {{ props.reviews.totalScore }}</span>
            <span> 총평 {{ props.reviews.totalComment }} </span>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps(["reviews"]);
console.log(props.reviews);
console.log(props.reviews.totalComment);
</script>
<style scoped>
.reviewContainer {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    height: 200px;
    flex-shrink: 0;
}

.totalBox,
.category {
    display: flex;
    justify-content: space-between;
}

.totalBox {
    gap: 5px;
    flex-direction: column;
}
</style>
