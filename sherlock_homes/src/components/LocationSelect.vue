<template>
    <div class="container">
        <div class="locationBox">
            <span @click="getCityInfo">시도 선택</span>
            <span> > </span>
            <span>시군구 선택</span>
            <!-- <span> > </span>
            <span>읍면동 선택</span> -->
        </div>
        <div class="itemBox">
            <span v-for="item in cities" :key="item.code">
                {{ item.name }}
            </span>
        </div>
    </div>
</template>
<script setup>
import { apiClient } from "../util/Api.js";
import { ref } from "vue";

const cities = ref([]);
const crntCity = ref({});

const getCityInfo = async () => {
    try {
        // TODO:
        const response = await apiClient.get(
            "http://3.39.93.101:8084/api/map/si"
        );
        cities.value = response.data;
        console.log(cities.value);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
};
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 19px;
    gap: 16px;

    background: #fdfdfd;
    border-radius: 0px 10px 10px 10px;

    flex: none;
    order: 0;
    flex-grow: 0;

    width: 100%; /* 부모 컨테이너의 너비를 기준으로 설정 */
    max-width: 600px; /* 원하는 최대 너비 (예: 600px) */
    box-sizing: border-box; /* 패딩 포함 계산 */
}

.locationBox,
.itemBox {
    width: 100%; /* 부모 컨테이너와 동일한 너비 */
}

.locationBox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 22px;

    background: var(--secondary-color);
    border-radius: 3px;

    flex: none;
    order: 0;
    flex-grow: 0;

    /* 매매 */

    font-family: "pretendard_regular";
    color: #ffffff;
}

.itemBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈 허용 */
    align-items: flex-start;
    align-content: flex-start;
    padding: 3px 10px;
    gap: 10px; /* 아이템 간 간격 */
}

.itemBox span {
    display: flex;
    flex-direction: row;
    padding: 5px;

    font-size: small;
    font-family: "pretendard_regular";

    /* 각 아이템의 너비 설정 */
    flex: 1 1 calc(33% - 10px); /* 한 줄에 4개 배치 (25%) */
    border: 1px solid #3f72af; /* 테두리 색상 */
    border-radius: 3px; /* 테두리 둥글게 */
}
</style>
