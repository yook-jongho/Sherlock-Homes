<template>
    <div class="chart-container">
        <Line :data="chartData" :options="options" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
import { useMapStore } from "@/stores/store.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale, // Fix for the "category" scale issue
    LinearScale,
    PointElement,
    LineElement
);
const mapStore = useMapStore();

// Extract unique deal years
const dealYears = computed(() => {
    return [...new Set(mapStore.aptDetails.map((item) => item.dealY))];
});

// Chart Data
const chartData = computed(() => ({
    labels: dealYears.value, // X-axis labels (unique deal years)
    datasets: [
        {
            label: "거래 금액",
            backgroundColor: "#112D4E",
            data: dealYears.value.map((year) => {
                const amounts = mapStore.aptDetails
                    .filter((item) => item.dealY === year)
                    .map((item) =>
                        parseFloat(item.dealAmount.replace(",", ""))
                    );
                return amounts.reduce((sum, value) => sum + value, 0); // 합산된 금액
            }),
        },
    ],
}));

// Chart Options
const options = {
    responsive: true,
    maintainAspectRatio: false,
};
</script>

<style scoped>
.chart-container {
    width: 100%; /* 원하는 너비 */
    height: 400px; /* 원하는 높이 */
    position: relative; /* 차트가 컨테이너에 맞게 렌더링되도록 설정 */
    overflow: auto;
}
</style>
