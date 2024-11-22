<template>
    <div class="card">
        <div class="card-header">
            <span>{{ aptData.aptNm }}</span>
            <img src="../assets/bookmark.svg" class="bookmark" />
        </div>
        <div class="card-main">
            <span style="font-size: small">최근 매매 거래가</span>
            <span style="font-size: large; font-weight: 600">
                {{ aptData.dealAmount }} 만원
            </span>
        </div>
        <div class="card-footer">
            <span
                >{{ aptData.dealY }}.{{ aptData.dealM }}.{{ aptData.dealD }} /
                {{ aptData.floor }} 층 / {{ aptData.size }}평</span
            >
            <button>detail</button>
        </div>
    </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
    aptData: {
        type: Object,
        required: true,
    },
});
</script>
<style scoped>
.bookmark {
    width: 20px;
    height: 20px;
}
.card {
    /* Rectangle 6490 */
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px 10px;
    border: 0.2px solid #71717146;
    border-radius: 5px;
    margin-top: 20px;
}

.card-header,
.card-footer {
    display: flex;
    justify-content: space-between;
}

.card-header {
    font-size: large;
    font-weight: 600;
}

.card-main {
    display: flex;
    flex-direction: column;
    color: #ed6a5e;
}

.card-footer {
    font-size: smaller;
    color: #717171;
}
</style>
