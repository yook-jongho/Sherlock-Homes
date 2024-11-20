<template>
    <div class="container">
        <div class="locationBox">
            <span
                :class="{ selected: activeStep === '시도 선택' }"
                @click="handleCitySelection('시도 선택')"
                >시도 선택</span
            >
            <span> > </span>
            <span
                :class="{ selected: activeStep === '시군구 선택' }"
                @click="handleCitySelection('시군구 선택')"
                >시군구 선택</span
            >
            <span> > </span>
            <span
                :class="{ selected: activeStep === '읍면동 선택' }"
                @click="handleCitySelection('읍면동 선택')"
                >읍면동 선택</span
            >
        </div>
        <div class="selectionBox">
            <span v-if="locations.city">시도: {{ locations.city.name }}</span>
            <span v-if="locations.district"
                >시군구: {{ getTrimmedName(locations.district.name) }}</span
            >
            <span v-if="locations.neighborhood"
                >읍면동: {{ locations.neighborhood }}</span
            >
        </div>
        <div class="itemBox">
            <table>
                <tbody>
                    <tr
                        v-for="(row, rowIndex) in chunkedCities"
                        :key="rowIndex"
                    >
                        <td
                            @click="setItem(item)"
                            v-for="item in row"
                            :key="item.code"
                            :class="{ selected: selectedItem === item.name }"
                        >
                            {{ getTrimmedName(item.name) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
import { apiClient } from "../util/Api.js";
import { ref, computed, watch } from "vue";
import { userChoiceState } from "@/stores/store.js";

const userChoice = userChoiceState();
const cities = ref([]);
const locations = ref({
    city: null,
    district: null,
    neighborhood: null,
});
const activeStep = ref("시도 선택"); // 현재 활성화된 단계
const setActiveStep = (step) => {
    console.log(step);
    activeStep.value = step;
};

const selectedItem = ref(); // 현재 선택한 목록
const setItem = (item) => {
    console.log(item.name, item.code);
    selectedItem.value = item.name;
    selectLocation(item);
};

const getCityInfo = async (step) => {
    let apiUrl = "";
    if (step === "시도 선택") apiUrl = "http://3.39.93.101:8084/api/map/si";
    if (step === "시군구 선택" && locations.value.city)
        apiUrl = `http://3.39.93.101:8084/api/map/gu?si=${locations.value.city.code}`;
    // if (step === "읍면동 선택" && locations.value.시군구)
    // apiUrl = `http://3.39.93.101:8084/api/map/emd?sggCode=${locations.value.district}`;

    if (apiUrl) {
        try {
            console.log(apiUrl);
            const response = await apiClient.get(apiUrl);
            cities.value = response.data;
            //TODO cities.value = response.data.payload;
        } catch (error) {
            console.error(`Error fetching ${step} data:`, error);
        }
    }
};

// 단일 핸들러 함수
const handleCitySelection = (step) => {
    setActiveStep(step);
    getCityInfo(step);
};

// 항목 선택 처리
const selectLocation = (item) => {
    if (activeStep.value === "시도 선택") {
        locations.value.city = item;
        console.log(locations.value.city);
        // setActiveStep("시군구 선택");
        // getCityInfo("시군구 선택");
    } else if (activeStep.value === "시군구 선택") {
        locations.value.district = item;
        // setActiveStep("읍면동 선택");
        // getCityInfo("읍면동 선택");
    } else if (activeStep.value === "읍면동 선택") {
        locations.value.neighborhood = item.code;
        updateCity();
    }
};

const getTrimmedName = (name) => {
    if (activeStep.value === "시군구 선택" && locations.value.city) {
        // 시도 이름 제거
        return name.replace(locations.value.city.name, "").trim();
    } else if (activeStep.value === "읍면동 선택" && locations.value.district) {
        // 시군구 이름 제거
        return name.replace(locations.value.district.name, "").trim();
    }
    return name; // 기본 반환
};

// Store 업데이트
const updateCity = () => {
    userChoice.updateLocation(locations.value);
};

// 모든 선택이 완료되었을 때 API 요청
watch(
    locations,
    (newVal) => {
        if (newVal.city && newVal.district) {
            // fetchFinalData();
        }
    },
    { deep: true }
);

const fetchFinalData = async () => {
    try {
        const response = await apiClient.post(
            "http://3.39.93.101:8084/api/final",
            {
                city: locations.value.city,
                district: locations.value.district,
                neighborhood: locations.value.neighborhood,
            }
        );
        console.log("Final Data:", response.data);
    } catch (error) {
        console.error("Error fetching final data:", error);
    }
};

const chunkedCities = computed(() => {
    const chunkSize = 3; // 한 행에 표시할 아이템 수
    const result = [];
    for (let i = 0; i < cities.value.length; i += chunkSize) {
        result.push(cities.value.slice(i, i + chunkSize));
    }
    return result;
});
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;

    background: #fdfdfd;
    border-radius: 0px 10px 10px 10px;

    width: 90%; /* 부모 컨테이너의 너비를 기준으로 설정 */
    min-width: 300px; /* 원하는 최대 너비 (예: 600px) */
    box-sizing: border-box; /* 패딩 포함 계산 */
}

.locationBox,
.itemBox {
    width: 100%; /* 부모 컨테이너와 동일한 너비 */
}

.locationBox {
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 3px;

    /* 매매 */
    font-family: "pretendard_regular";
    border: 0.5px solid var(--secondary-color);
    span {
        display: inline-block;
        cursor: pointer;
        font-size: 14px;
    }
    span.selected {
        font-weight: bold; /* 선택된 상태 */
        color: var(
            --primary-color,
            #3f72af
        ); /* 선택된 상태의 색상 변경 (옵션) */
    }
}

.selectionBox {
    margin-top: 10px;
    padding: 10px;
    background: #f7f7f7;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    width: 100%;
    font-family: "pretendard_regular";
    font-size: 14px;
    color: #333;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.selectionBox span {
    font-weight: bold;
}

.itemBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈 허용 */
    align-items: flex-start;
    align-content: flex-start;
    padding: 3px 10px;
    gap: 10px; /* 아이템 간 간격 */
    cursor: pointer;
}

.itemBox table {
    width: 100%; /* 테이블 너비를 부모 컨테이너와 동일하게 */
    border-collapse: collapse; /* 테두리 겹침 제거 */
}

.itemBox td {
    width: 100px;
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
