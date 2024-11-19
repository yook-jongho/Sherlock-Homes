<template>
    <div class="sidebar">
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
    align-items: center;
    padding: 10px;
    gap: 25px;

    width: 45%;
    min-width: 400px;
    height: calc(100vh - 70px);

    background: #ffffff;
    box-shadow: 0px 20px 10px 2px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    position: relative;
    z-index: 2;
}
</style>
