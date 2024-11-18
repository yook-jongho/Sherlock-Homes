<template>
    <div class="container">
        <div class="locationBox">
            <span>시도 선택</span>
            <span>시군구 선택</span>
            <span>읍면동 선택</span>
        </div>
        <div class="itemBox">
            <span>서울시</span>
            <span>서울시</span>
            <span>서울시</span>
            <span>서울시</span>
            <span>서울시</span>
            <span>서울시</span>
            <span>서울시</span>
        </div>
    </div>
</template>
<script setup></script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 19px;
    gap: 16px;

    background: #fdfdfd;
    border-radius: 0px 10px 10px 10px;

    flex: none;
    order: 0;
    flex-grow: 0;

    width: 100%; /* 부모 컨테이너의 너비를 기준으로 설정 */
    max-width: 600px; /* 원하는 최대 너비 (예: 600px) */
    box-sizing: border-box; /* 패딩 포함 계산 */
}

.locationBox,
.itemBox {
    width: 100%; /* 부모 컨테이너와 동일한 너비 */
}

.locationBox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 3px 22px;
    gap: 53px;

    background: var(--secondary-color);
    border-radius: 3px;

    flex: none;
    order: 0;
    flex-grow: 0;

    /* 매매 */

    font-family: "pretendard_regular";
    letter-spacing: 0.05em;
    color: #ffffff;
}

.itemBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈 허용 */
    align-items: flex-start;
    align-content: flex-start;
    padding: 3px 10px;
    gap: 10px; /* 아이템 간 간격 */
}

.itemBox span {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px;
    gap: 10px;

    background: #3f72af;
    border-radius: 3px;

    font-family: "pretendard_regular";
    color: var(--background-color);

    /* 각 아이템의 너비 설정 */
    flex: 1 1 calc(25% - 10px); /* 한 줄에 4개 배치 (25%) */
    max-width: calc(25% - 10px); /* 최대 너비 제한 */
    box-sizing: border-box; /* 패딩과 경계 포함 */
}
</style>
