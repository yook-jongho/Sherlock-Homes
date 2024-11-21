<template>
    <div class="sidebar">
        <span class="title">검색 조건</span>
        <LocationSelect></LocationSelect>
    </div>
</template>
<script setup>
import LocationSelect from "@/components/LocationSelect.vue";
</script>
<style>
.sidebar {
    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 25px;

    width: 25%;
    min-width: 310px;
    background: #ffffff;
    box-shadow: 0px 20px 10px 2px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    position: relative;
    z-index: 2;
}

.title {
    border-spacing: 10px;
    border-bottom: 1px solid;
    display: inline-block;
    font-size: large;
    font-family: "pretendard_bold";
    padding-bottom: 10px;
}
</style>
