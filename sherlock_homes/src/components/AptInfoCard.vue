<template>
    <div class="card" @click="clickAptCard">
        <div class="card-header">
            <span>{{ aptData.aptNm }}</span>
            <img src="../assets/bookmark.svg" class="bookmark" />
        </div>
        <div class="card-main">
            <span style="font-size: small">최근 매매 거래가</span>
            <span style="font-size: large; font-weight: 600">
                {{ formatCurrency(aptData.dealAmount) }}원
            </span>
        </div>
        <div class="card-footer">
            <span
                >{{ aptData.dealY }}.{{ aptData.dealM }}.{{ aptData.dealD }} /
                {{ aptData.floor }} 층 /
                {{ squareMeterToPyeong(aptData.exduUseAr) }}평</span
            >
        </div>
    </div>
</template>
<script setup>
import { defineProps, computed } from "vue";
import { apiClient } from "@/util/Api.js";
import { useMapStore } from "@/stores/store.js";
import { formatCurrency } from "@/util/util.js";

const mapStore = useMapStore();
const props = defineProps({
    aptData: {
        type: Object,
        required: true,
    },
});

const squareMeterToPyeong = (squareMeter) => {
    const conversionRate = 3.305785; // 1평 = 3.305785 제곱미터
    return (squareMeter / conversionRate).toFixed(1);
};

const getAptDetailsInfo = async () => {
    const { aptNm, si, gu, dong } = props.aptData;
    const apiUrl = `http://3.39.93.101:8081/api/apt/trade/page?offset=0&limit=100&aptName=${aptNm}`;
    try {
        const response = await apiClient.get(apiUrl);
        return response.data.payload;
    } catch (error) {
        console.error(`Error fetching data:`, error);
    }
};

const getAptImg = async () => {
    const { aptNm } = props.aptData;
    const apiUrl = `http://3.39.93.101:8081/api/apt/trade/page?offset=0&limit=100&aptName=${aptNm}`;
    try {
        const response = await apiClient.get(apiUrl);
        return response.data.payload.imgUrl;
    } catch (error) {
        console.error(`Error fetching data:`, error);
    }
};

const clickAptCard = async () => {
    const aptDetails = await getAptDetailsInfo();
    // const aptImg = await getAptImg();
    mapStore.setAptDetails(aptDetails);
    mapStore.setSelectedApt(props.aptData);
    // mapStore.setAptUrl(props.aptImg);
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
    cursor: pointer;
}

.card:hover {
    background: #f3f4f6;
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
