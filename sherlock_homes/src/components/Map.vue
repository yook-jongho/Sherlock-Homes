<template>
    <div ref="mapContainer" class="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const mapContainer = ref(null);

onMounted(() => {
    if (!mapContainer.value) return; // 방어 코드
    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
    };
    const map = new kakao.maps.Map(mapContainer.value, options);
});
</script>
<style scoped>
.mapContainer {
    width: 100%;
    height: calc(100vh - 70px);
}
/* 필요 시 스타일 추가 */
</style>
