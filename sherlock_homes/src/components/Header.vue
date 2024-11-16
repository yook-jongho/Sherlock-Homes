<template>
    <header>
        <img src="../assets/logoImg.png" />
        <span>아파트</span>
        <span>단독/다가구</span>
        <div class="login">
            <img src="../assets/login.png" />
            <span>로그인</span>
        </div>
    </header>
</template>

<script setup></script>

<style scoped>
/* header */
header {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px 50px;
    justify-content: space-between;
    background: #f9f7f7;
    min-width: 1200px; /* 최소 너비 설정 */
}

/* log-in */

/* Auto layout */
.login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2px 0px;
    gap: 10px;

    width: 30px;
    height: 40px;

    /* Inside auto layout */
    span {
        font-size: 10px;
    }
}
</style>
