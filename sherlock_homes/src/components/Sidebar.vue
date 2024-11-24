<template>
    <div class="sidebar">
        <LocationSelect></LocationSelect>
        <div class="aptContainer">
            <span v-if="aptList">검색 결과 ({{ aptList.length }})</span>
            <div v-for="(apt, index) in aptList" :key="index">
                <AptInfoCard :aptData="apt" />
            </div>
        </div>
    </div>
    <AptDetailsCard />
</template>
<script setup>
import { computed } from "vue";
import { useMapStore } from "@/stores/store.js";
import LocationSelect from "@/components/LocationSelect.vue";
import AptInfoCard from "@/components/AptInfoCard.vue";
import AptDetailsCard from "./AptDetailsCard.vue";

const mapStore = useMapStore();
const aptList = computed(() => mapStore.aptList);
</script>
<style scoped>
.sidebar {
    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 25px;
    width: 25%;
    max-height: calc(100vh - 90px);
    min-width: 310px;
    background: #ffffff;
    box-shadow: 0px 20px 10px 2px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    position: relative;
    z-index: 2;
    overflow-y: auto;
}

.aptContainer {
    overflow: auto;
}
</style>
