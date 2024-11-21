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
        coordinates: null,
    }),
    actions: {
        setDistrictData(code) {
            this.selectedDistrictCode = code;
        },
        setCoordinates(coordinates) {
            this.coordinates = coordinates;
        }
    },
});