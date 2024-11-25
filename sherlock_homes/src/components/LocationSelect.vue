<template>
    <div class="container">
        <span class="title"
            >검색 조건
            <img
                @click="setToggle"
                src="../assets/under.svg"
                style="cursor: pointer"
        /></span>
        <div v-if="toggle" class="filterContainer">
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
            <SectionTable
                :activeStep="activeStep"
                :chunkedCities="chunkedCities"
                @valueSelected="handleValueSelected"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { apiClient } from "../util/Api.js";
import {
    userChoiceState,
    useMapStore,
    useRegionStore,
} from "@/stores/store.js";
import SectionTable from "@/components/SectionTable.vue";
import koreaData from "../json/korea.json";

onMounted(() => {
    // "시도 선택" 단계에서 캐싱된 데이터 확인 및 로드
    getCityInfo("시도 선택");
});

const regionStore = useRegionStore();

const toggle = ref(true);
const setToggle = () => {
    toggle.value = !toggle.value;
};
const userChoice = userChoiceState();
const cities = ref([]);
const locations = ref({
    city: null,
    district: null,
    neighborhood: null,
});
const activeStep = ref("시도 선택"); // 현재 활성화된 단계
const setActiveStep = (step) => {
    activeStep.value = step;
};

const selectedItem = ref(); // 현재 선택한 목록
const handleValueSelected = (value) => {
    selectedItem.value = value; // 자식에서 전달받은 값 저장
    selectLocation(value);
};

const getCityInfo = async (step) => {
    let apiUrl = "";

    if (step === "시도 선택") {
        const startTime = performance.now(); // 수행 시간 측정 시작

        // LocalStorage에서 데이터 확인
        const cachedData = localStorage.getItem("cities");
        if (cachedData) {
            cities.value = JSON.parse(cachedData);
            const endTime = performance.now(); // 수행 시간 측정 종료
            console.log(
                `(캐싱된 데이터 사용) 데이터 로딩 시간: ${
                    endTime - startTime
                }ms`
            );
            return; // 캐싱된 데이터 사용 후 종료
        }
        apiUrl = "http://3.39.93.101:8084/api/map/si";
    }

    if (step === "시군구 선택" && locations.value.city) {
        const startTime = performance.now(); // 수행 시간 측정 시작
        const cityCode = locations.value.city.code;
        const cachedData = regionStore.getRegionData(cityCode);
        if (cachedData) {
            cities.value = cachedData;
            const endTime = performance.now(); // 수행 시간 측정 종료
            console.log(
                `(캐싱된 데이터 사용) 데이터 로딩 시간: ${
                    endTime - startTime
                }ms`
            );
            return; // 캐싱된 데이터 사용 후 종료
        }
        apiUrl = `http://3.39.93.101:8084/api/map/gu?si=${locations.value.city.code}`;
    }
    if (step === "읍면동 선택" && locations.value.district) {
        apiUrl = `http://3.39.93.101:8084/api/map/dong?gu=${locations.value.district.name}`;
    }

    if (apiUrl) {
        const startTime = performance.now(); // 수행 시간 측정 시작
        try {
            const response = await apiClient.get(apiUrl);
            cities.value = response.data.payload;

            // 시/도 데이터 캐싱
            if (step === "시도 선택") {
                localStorage.setItem(
                    "cities",
                    JSON.stringify(response.data.payload)
                );
                console.log("시/도 데이터를 캐싱하였습니다.");
            }
            if (step === "시군구 선택") {
                regionStore.addRegions(
                    locations.value.city.code,
                    response.data.payload
                );
            }
        } catch (error) {
            console.error(`Error fetching ${step} data:`, error);
        }
        const endTime = performance.now(); // 수행 시간 측정 종료
        console.log(`(API 요청) 데이터 로딩 시간: ${endTime - startTime}ms`);
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

    // 청크 데이터 생성
    const chunks = [];
    for (let i = 0; i < validCities.length; i += chunkSize) {
        chunks.push(validCities.slice(i, i + chunkSize));
    }
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
        console.alert("해당 시군구의 정보는 없습니다");
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
}

.filterContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.filterContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.title {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-spacing: 10px;
    border-bottom: 1px solid;
    font-size: large;
    font-family: "pretendard_bold";
    padding-bottom: 10px;
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
</style>
