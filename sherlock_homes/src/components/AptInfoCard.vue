<template>
    <div class="card" @click="clickAptCard">
        <div class="card-header">
            <span>{{ aptData.aptNm }}</span>
            <img src="../assets/bookmark.svg" class="bookmark" />
        </div>
        <div class="card-main">
            <span style="font-size: small">최근 매매 거래가</span>
            <span style="font-size: large; font-weight: 600">
                {{ formatCurrency(aptData.dealAmount) }} 원
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
import { defineProps, computed } from "vue";
import { useMapStore } from "@/stores/store.js";

const mapStore = useMapStore();
const props = defineProps({
    aptData: {
        type: Object,
        required: true,
    },
});
const formatCurrency = (amount) => {
    let numericAmount = parseInt(amount.replace(/,/g, ""), 10) * 10000;

    if (numericAmount >= 100000000) {
        const billion = Math.floor(numericAmount / 100000000);
        const remainder = numericAmount % 100000000;
        const million = Math.floor(remainder / 10000);
        return million > 0 ? `${billion}억 ${million}만` : `${billion}억`;
    } else if (numericAmount >= 10000) {
        return `${Math.floor(numericAmount / 10000)}만`;
    } else {
        return `${numericAmount.toLocaleString()}원`;
    }
};

const aptDetailsInfo = () => {
    // TODO: apt 상세정보 api 요청
};

const clickAptCard = () => {
    mapStore.setAptLocation(props.aptData.roadNm);
};
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
