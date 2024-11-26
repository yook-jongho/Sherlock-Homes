<template>
    <div v-if="toggle && mapStore.selectedApt" :class="{ container: true }">
        <div class="image-container">
            <img
                class="aptImg"
                src="https://www.hapt.co.kr/news/photo/202305/158843_29118_1852.jpg"
            />
            <!-- TODO src="mapStore.aptImg" -->
            <button class="back-button" @click="closeDetail">뒤로가기</button>
        </div>
        <div class="header">
            <span class="aptName"> {{ mapStore.selectedApt.aptNm }}</span>
            <img src="../assets/bookmark.svg" class="bookmark" />
        </div>
        <span class="subTitle">거래내역</span>
        <AptTransHistory />
        <span class="subTitle">가격 추이</span>
        <AptTransGraph />
        <div class="reviewBtn" @click="openAptReview">
            <img
                width="100px"
                height="40px"
                src="../assets/logo.svg"
            />셜록홈즈의 평가보기
        </div>
        <span v-if="aptReview" class="subTitle">홈즈 평가</span>
        <AptReview v-if="aptReview" />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { apiClient } from "@/util/Api.js";
import { useMapStore } from "@/stores/store.js";
import { squareMeterToPyeong, formatCurrency } from "@/util/util.js";
import AptTransHistory from "@/components/AptTransHistory.vue";
import AptTransGraph from "@/components/AptTransGraph.vue";
import AptReview from "@/components/AptReview.vue";

const mapStore = useMapStore();

const toggle = ref(false);
const openDetail = () => {
    toggle.value = true;
};

const aptReview = ref();
const openAptReview = async () => {
    await getReview();
};

const closeDetail = () => {
    toggle.value = false;
    mapStore.selectedApt = null;
};
watch(
    () => mapStore.selectedApt,
    (newApt) => {
        if (newApt) openDetail();
    }
);

const getReview = async () => {
    const apiUrl = `http://3.39.93.101:8086/api/ai/gpt/review`;
    if (!mapStore.selectedApt) {
        alert("잘못된 요청입니다");
        return;
    }
    console.log(mapStore.selectedApt.roadNm);
    console.log(mapStore.selectedApt.aptNm);
    try {
        const response = await apiClient.post(apiUrl, {
            address: mapStore.selectedApt.roadNm,
            buildingName: mapStore.selectedApt.aptNm,
        });
        console.log(response.data.payload);
        aptReview.value = response.data.payload;
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped>
.container {
    width: 35%;
    min-width: 400px;
    max-height: calc(100vh - 90px);
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow: auto;
}

.container::-webkit-scrollbar {
    display: none;
}

.image-container {
    position: relative; /* 부모를 기준으로 버튼 위치를 설정 */
    width: 100%;
    height: 200px;
    object-fit: cover;
}
.back-button {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.8); /* 반투명 배경 */
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
    z-index: 1; /* 이미지 위에 표시되도록 설정 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.aptImg {
    width: 100%;
    height: 200px;
}

.header {
    display: flex;
    justify-content: space-between;
}
.aptName {
    font-weight: 600;
    font-size: large;
}

.bookmark {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.subTitle {
    display: inline-block;
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid;
    font-size: large;
    font-family: "pretendard_bold";
}

.reviewBtn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    border: 1px solid var(--primary-color);
    border-radius: 5px;
}
</style>
