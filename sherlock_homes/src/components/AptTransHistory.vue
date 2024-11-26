<template>
    <div style="height: 400px; overflow: auto; flex-shrink: 0">
        <table style="width: 100%">
            <thead>
                <tr>
                    <td>거래일자</td>
                    <td>층수</td>
                    <td>평</td>
                    <td>가격</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(detail, index) in mapStore.aptDetails" :key="index">
                    <td>
                        {{
                            formatDate(detail.dealY, detail.dealM, detail.dealD)
                        }}
                    </td>
                    <td>{{ detail.floor }}</td>
                    <td>{{ squareMeterToPyeong(detail.exduUseAr) }}</td>
                    <td>{{ formatCurrency(detail.dealAmount) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { useMapStore } from "@/stores/store.js";
import { squareMeterToPyeong, formatCurrency } from "@/util/util.js";

const mapStore = useMapStore();
const formatDate = (year, month, day) => {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
    )}`;
};
</script>
<style scoped>
table td {
    padding: 10px;
    border-bottom: 1px solid #f5f5f5;
}

tbody tr:hover {
    background: #f3f4f6;
}

thead tr {
    font-size: large;
    color: var(--secondary-color);
}
</style>
