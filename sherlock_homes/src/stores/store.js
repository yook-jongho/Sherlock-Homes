import { defineStore } from "pinia";

export const userChoiceState = defineStore("userChoiceState", {
    state: () => ({
        // 지역 선택 상태
        location: {
            city: null, // 시
            district: null, // 구
            neighborhood: null, // 동
        },
        // 헤더 선택 상태
        header: {
            menu: null, // 아파트 or 단독/다가구
            option: null, // 매매, 전세, 월세
        },
    }),
    actions: {
        // 상태 업데이트 함수
        updateLocation({ city, district, neighborhood }) {
            this.location = { city, district, neighborhood };
        },
        updateHeader({ menu, option }) {
            this.header = { menu, option };
        },
    },
});

export const useMapStore = defineStore("mapStore", {
    state: () => ({
        selectedDistrictCode: null, // 선택된 시군구 코드
        aptList: null,
        coordinates: null,
        selectedApt: null,
        aptDetails: null,
        aptImg: null,
    }),
    actions: {
        setDistrictData(code) {
            this.selectedDistrictCode = code;
        },
        setCoordinates(coordinates) {
            this.coordinates = coordinates;
        },
        setAptList(aptList) {
            this.aptList = aptList;
        },
        setSelectedApt(selectedApt) {
            this.selectedApt = selectedApt;
        },
        setAptDetails(aptDetails) {
            this.aptDetails = aptDetails;
        },
        setAptUrl(aptImg) {
            this.aptImg = aptImg;
        },
    },
});

export const useRegionStore = defineStore("region", {
    state: () => ({
        regions: {},
    }),
    actions: {
        addRegions(cityCode, data) {
            this.regions[cityCode] = data;
            console.log("시군구 추가!!", this.regions[cityCode]);
        },
        getRegionData(cityCode) {
            return this.regions[cityCode] || null;
        },
    },
});
