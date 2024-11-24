<template>
    <div v-if="toggle && mapStore.selectedApt" :class="{ container: true }">
        <div class="image-container">
            <img
                class="aptImg"
                src="https://cdn.creazilla.com/emojis/56704/office-building-emoji-clipart-lg.png"
            />
            <button class="back-button" @click="closeDetail">뒤로가기</button>
        </div>
        <div class="header">
            <span> {{ mapStore.selectedApt.aptNm }}</span>
            <img src="../assets/bookmark.svg" class="bookmark" />
        </div>
        <table>
            <tr>
                <td>거래일자</td>
                <td>층수</td>
                <td>평</td>
                <td>금액</td>
            </tr>
        </table>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMapStore } from "@/stores/store";

const mapStore = useMapStore();
const toggle = ref(false);
const openDetail = () => {
    toggle.value = true;
    console.log("상세보기 발동!!");
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
</script>

<style scoped>
.container {
    width: 25%;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.image-container {
    position: relative; /* 부모를 기준으로 버튼 위치를 설정 */
    width: 100%;
    height: 30%;
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
    height: 100%;
}

.header {
    display: flex;
    justify-content: space-between;
}

.bookmark {
    width: 20px;
    height: 20px;
}
</style>
