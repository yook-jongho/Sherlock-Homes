<template>
    <header>
        <img src="../assets/logoImg.png" alt="Logo" />
        <div class="item" v-for="(menu, index) in menus" :key="index">
            <span @click="toggleDropdown(index)">{{ menu.label }}</span>
            <transition name="slide-down">
                <div v-if="showDropdown[index]" class="optionBox">
                    <span
                        v-for="option in menu.options"
                        :key="option"
                        @click="updateHeader(menu.label, option)"
                        class="option"
                        :class="{ selected: isSelected(menu.label, option) }"
                    >
                        {{ option }}
                    </span>
                </div>
            </transition>
        </div>
        <div class="login">
            <img src="../assets/login.png" alt="Login" />
            <span>로그인</span>
        </div>
    </header>
</template>

<script setup>
import { ref } from "vue";
import { userChoiceState } from "@/stores/store.js";

const userChoice = userChoiceState();

const isSelected = (menu, option) => {
    return (
        userChoice.header.menu === menu && userChoice.header.option === option
    );
};
// 메뉴 데이터
const menus = ref([
    { label: "아파트", options: ["매매", "전세", "월세"] },
    { label: "단독 / 다가구", options: ["매매", "전세", "월세"] },
]);

// 드롭다운 상태 관리
const showDropdown = ref(menus.value.map(() => false));

// 드롭다운 토글
const toggleDropdown = (index) => {
    showDropdown.value = showDropdown.value.map((state, i) =>
        i === index ? !state : false
    );
};

const updateHeader = (menu, option) => {
    userChoice.updateHeader({ menu, option });
};
</script>

<style scoped>
/* header 스타일 */
header {
    display: flex;
    align-items: center;
    gap: 200px;
    padding: 15px 50px;
    background: var(--background-color);
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
    margin-left: auto;
}

/* 메뉴 아이템 스타일 */
.item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 20px;
    font-family: "pretendard_medium";
}

.optionBox {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 7px 33px;

    position: absolute; /* 부모 요소를 기준으로 독립적인 위치 */
    top: 195%; /* "아파트" 아래에 위치 */
    left: 0; /* 왼쪽 정렬 */

    width: 247px;
    height: 49px;

    background: var(--background-color);
    box-shadow: 0px 4px 100px rgba(214, 217, 240, 0.5);
    border-radius: 0px 0px 10px 20px;
    border-top: 4px solid var(--primary-color);

    z-index: 100;
}

.option {
    font-size: medium;
    font-family: "pretendard_light";
}
.option:hover {
    font-weight: bold; /* 볼드체 */
}

.option.selected {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px 13px;
    gap: 10px;

    background: var(--secondary-color);
    border-radius: 50px;
    color: var(--background-color);
}
</style>
