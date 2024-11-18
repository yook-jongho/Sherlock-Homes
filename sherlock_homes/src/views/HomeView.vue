<template>
    <Header></Header>
    <div class="mainContainer">
        <Sidebar></Sidebar>
        <Map></Map>
    </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import Map from "@/components/Map.vue";
</script>

<style scoped>
.mainContainer {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}
</style>
