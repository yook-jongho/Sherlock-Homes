<template>
    <header>
        <img src="../assets/logoImg.png" />
        <div class="item" v-for="(menu, index) in menus" :key="index">
            <span @click="toggleDropdown(index)">{{ menu.label }}</span>
            <transition name="slide-down">
                <SelectOption v-if="showDropdown[index]" />
            </transition>
        </div>
        <div class="login">
            <img src="../assets/login.png" />
            <span>로그인</span>
        </div>
    </header>
</template>

<script setup>
import { ref } from "vue";
import SelectOption from "./SelectOption.vue";

// 메뉴 데이터 배열
const menus = [{ label: "아파트" }, { label: "단독 / 다가구" }];

// 각 메뉴별로 드롭다운 상태 관리
const showDropdown = ref(menus.map(() => false));

// 드롭다운 토글 함수
const toggleDropdown = (index) => {
    showDropdown.value = showDropdown.value.map((state, i) =>
        i === index ? !state : false
    );
};
</script>

<style scoped>
/* header 스타일 */
header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 50px;
    background: #f9f7f7;
    min-width: 1200px;
    height: 70px;
}

/* 로그인 스타일 */
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 10px;
    gap: 5px;
}

/* 메뉴 아이템 스타일 */
.item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
}
</style>
