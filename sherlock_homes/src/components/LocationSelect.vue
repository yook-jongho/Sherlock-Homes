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
        <div class="selectionBox" v-if="locations.city">
            <span v-if="locations.city">{{ locations.city.name }}</span>
            <span v-if="locations.district">{{
                getTrimmedName(locations.district.name)
            }}</span>
            <span v-if="locations.neighborhood">{{
                locations.neighborhood.name
            }}</span>
        </div>
        <button
            class="map-button"
            v-if="locations.district"
            @click="showDistrictMap"
        >
            > 해당 시군구 지도 이동
        </button>
        <button
            class="map-button"
            v-if="locations.neighborhood"
            @click="getAptData"
        >
            > 해당 읍면동 지도 이동
        </button>
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
import { useMapStore } from "@/stores/store.js";
import koreaData from "../json/korea.json";

const userChoice = userChoiceState();
const cities = ref([]);
const locations = ref({
    city: null,
    district: null,
    neighborhood: null,
});
const activeStep = ref(""); // 현재 활성화된 단계
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
    if (step === "읍면동 선택" && locations.value.district)
        apiUrl = `http://3.39.93.101:8084/api/map/dong?gu=${locations.value.district.name}`;

    if (apiUrl) {
        try {
            console.log(apiUrl);
            const response = await apiClient.get(apiUrl);
            // cities.value = response.data;
            cities.value = response.data.payload;
            console.log(cities.value);
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
        locations.value.district = null;
        locations.value.neighborhood = null;

        userChoice.location.city = item;
        userChoice.location.district = null;
        userChoice.location.neighborhood = null;
    } else if (activeStep.value === "시군구 선택") {
        locations.value.district = item;
        userChoice.location.district = item;

        locations.value.neighborhood = null;
        userChoice.location.neighborhood = null;
    } else if (activeStep.value === "읍면동 선택") {
        locations.value.neighborhood = item;
        userChoice.location.neighborhood = item;
        // updateCity();
    }
};

const getTrimmedName = (name) => {
    if (activeStep.value === "시군구 선택" && locations.value.city) {
        // 시도 이름 제거
        return name.replace(locations.value.city.name, "").trim();
    }
    return name; // 기본 반환
};

// Store 업데이트
const updateCity = () => {
    userChoice.updateLocation(locations.value);
};

const getAptData = async () => {
    try {
        const response = await apiClient.get(
            `http://3.39.93.101:8081/api/apt/trade/dong/${locations.value.neighborhood.name}`
        );
        if (response.data.payload.length === 0) {
            alert("데이터가 없습니다");
            return;
        }
        const aptList = response.data.payload;
        mapStore.setAptList(aptList);
    } catch (error) {
        console.error("Error fetching final data:", error);
    }
};

const chunkedCities = computed(() => {
    const chunkSize = 3;

    // 빈 값 및 중복 데이터 제거
    const validCities = cities.value
        .map((item) => ({
            ...item,
            name: getTrimmedName(item.name, activeStep.value), // 이름 가공
        }))
        .filter((item, index, self) => {
            // 조건 분기: activeStep에 따라 고유값 확인 방식 변경
            if (activeStep.value === "읍면동 선택") {
                // guname + name으로 중복 제거
                return (
                    item &&
                    item.name &&
                    self.findIndex(
                        (i) => i.guname === item.guname && i.name === item.name
                    ) === index
                );
            } else {
                // 기존 방식: code로 중복 제거
                return (
                    item &&
                    item.name &&
                    self.findIndex((i) => i.code === item.code) === index
                );
            }
        });

    console.log(validCities);

    // 청크 데이터 생성
    const chunks = [];
    for (let i = 0; i < validCities.length; i += chunkSize) {
        chunks.push(validCities.slice(i, i + chunkSize));
    }
    console.log(chunks);
    return chunks;
});

const mapStore = useMapStore();

const showDistrictMap = () => {
    // 전역 상태에서 선택된 시군구 코드 가져오기
    const selectedSigCode = locations.value.district.code; // Pinia 상태에서 코드 가져오기

    if (!selectedSigCode) {
        console.error("선택된 시군구 코드가 없습니다.");
        return;
    }

    // JSON 데이터에서 선택된 시군구 찾기
    const selectedDistrict = koreaData.features.find(
        (feature) => feature.properties.SIG_CD === selectedSigCode
    );

    if (
        selectedDistrict &&
        Array.isArray(selectedDistrict.geometry.coordinates)
    ) {
        const coordinates = selectedDistrict.geometry.coordinates;

        // 지도 데이터 설정
        mapStore.setDistrictData(selectedSigCode);
        mapStore.setCoordinates(coordinates);
    } else {
        console.error(
            "Invalid district data or no match found:",
            selectedDistrict
        );
    }
};
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
.selectionBox,
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
    display: flex;
    gap: 5px;
}

.selectionBox span {
    display: inline-block;
    padding: 7px;
    align-content: center;
    text-align: center;
    border-radius: 20px;
    font-family: "pretendard_regular";
    font-size: 14px;
    background: var(--secondary-color);
    color: var(--background-color);
}

.map-button {
    padding: 10px;
    margin-right: auto;
    background-color: #ffffff;
    font-family: "pretendard_bold";
    border: 0.5px solid var(--secondary-color);
    border: 0.5px solid #e1e1e1;
    border-radius: 50px;
    filter: drop-shadow(0px 4px 100px rgba(0, 0, 0, 0.15));
    cursor: pointer;
}

.itemBox {
    height: 300px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* 줄 바꿈 허용 */
    align-items: flex-start;
    align-content: flex-start;
    padding: 3px 10px;
    gap: 10px; /* 아이템 간 간격 */
    cursor: pointer;
    overflow: auto;
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
