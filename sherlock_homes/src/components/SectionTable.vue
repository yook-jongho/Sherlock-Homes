<template>
    <div class="itemBox">
        <table>
            <tbody>
                <tr
                    v-for="(row, rowIndex) in props.chunkedCities"
                    :key="rowIndex"
                >
                    <td
                        @click="onSelectItem(item)"
                        v-for="item in row"
                        :key="item.code"
                        :class="{
                            selected: selectedItem === item.name,
                        }"
                    >
                        {{ item.name }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { defineProps, computed } from "vue";
import { userChoiceState } from "@/stores/store.js";

const props = defineProps(["actvieStep", "chunkedCities"]);
const emit = defineEmits(["valueSelected"]);

const userChoice = userChoiceState();
const onSelectItem = (item) => {
    console.log(item.name, item.code);
    const selectedValue = item; // 선택된 값
    emit("valueSelected", selectedValue); // 이벤트와 선택된 값 전달
};
</script>
<style scoped>
.itemBox {
    max-height: 300px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈 허용 */
    align-items: flex-start;
    align-content: flex-start;
    gap: 10px; /* 아이템 간 간격 */
    cursor: pointer;
    overflow: auto;
}

.itemBox table {
    width: 100%; /* 테이블 너비를 부모 컨테이너와 동일하게 */
    border-collapse: collapse; /* 테두리 겹침 제거 */
}

.itemBox td {
    padding: 10px; /* 셀 내부 간격 */
    border: 1px solid #f5f5f5; /* 셀 테두리 */
    font-size: small;
    font-family: "pretendard_regular";
    border-radius: 3px; /* 모서리 둥글게 */
    background: #ffffff; /* 셀 배경색 */
}

.itemBox td.selected {
    background: var(--secondary-color);
    color: var(--background-color);
    font-weight: 500;
}

.itemBox span {
    display: flex;
    flex-direction: row;
    padding: 5px;

    font-size: small;
    font-family: "pretendard_regular";

    /* 각 아이템의 너비 설정 */
    flex: 1 1 calc(33% - 10px); /* 한 줄에 4개 배치 (25%) */
    border: 1px solid #3f72af; /* 테두리 색상 */
    border-radius: 3px; /* 테두리 둥글게 */
}
</style>
