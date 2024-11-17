<template>
    <div class="optionBox">
        <span>매매</span>
        <span>전세</span>
        <span>월세</span>
    </div>
</template>

<script></script>

<style scoped>
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

    background: #f9f7f7;
    box-shadow: 0px 4px 100px rgba(214, 217, 240, 0.5);
    border-radius: 0px 0px 10px 20px;
    border-top: 4px solid #112d4e;

    z-index: 100;
}
</style>
