<template>
    <div ref="mapContainer" class="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useMapStore, userChoiceState } from "@/stores/store.js";

const mapContainer = ref(null);
const mapStore = useMapStore();

let map; // 지도 객체
let polygon; // 폴리곤 객체
let infoWindows = [];

onMounted(() => {
    if (!mapContainer.value) return; // 방어 코드
    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
    };
    map = new kakao.maps.Map(mapContainer.value, options);
});

watch(
    () => mapStore.selectedDistrictCode,
    (newselectedDistrictCode) => {
        if (newselectedDistrictCode) {
            moveMapCenterByAddress();
        }
    },
    { immediate: true }
);

watch(
    () => mapStore.coordinates,
    (newCoordinates) => {
        if (newCoordinates) {
            drawBoundary();
        }
    },
    { immediate: true }
);

watch(
    () => mapStore.aptList,
    (newAptList) => {
        if (newAptList) {
            neighborhoodApts();
        }
    }
);

// 지도 중심 이동
const moveMapCenterByAddress = () => {
    const geocoder = new kakao.maps.services.Geocoder();
    const userChoice = userChoiceState(); // store 사용
    const { city, district } = userChoice.location;

    if (!city.name || !district.name) {
        console.error("지도 이동 실패: 위치 정보가 충분하지 않습니다.");
        return;
    }

    // 주소 생성 (예: "서울특별시 강남구 역삼동")
    const address = `${city.name} ${district.name} `;

    geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const kakaoCenter = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(kakaoCenter); // 지도 중심 이동
            map.setLevel(7); // 지도 중심 이동
        } else {
            console.error("주소 검색 실패: ", status);
        }
    });
};

// 경계 그리기
const drawBoundary = () => {
    const coordinates = mapStore.coordinates;
    if (!Array.isArray(coordinates)) {
        console.error("Invalid coordinates 데이터:", coordinates);
        return; // 데이터가 배열이 아니면 실행 중단
    }

    // 기존 폴리곤 제거
    if (polygon) polygon.setMap(null);

    try {
        // 좌표 배열을 폴리곤 경로로 변환
        const paths = coordinates[0].map(
            ([lng, lat]) => new kakao.maps.LatLng(lat, lng)
        );

        polygon = new kakao.maps.Polygon({
            path: paths,
            strokeWeight: 2, // 외곽선 두께
            strokeColor: "#112d4e", // 외곽선 색
            strokeOpacity: 0.8, // 외곽선 투명도
            fillColor: "#3f72af", // 채우기 색
            fillOpacity: 0.1, // 채우기 투명도
        });

        polygon.setMap(map);
    } catch (error) {
        console.error("경계 처리 중 에러:", error);
    }
};

const neighborhoodApts = () => {
    const geocoder = new kakao.maps.services.Geocoder();
    const userChoice = userChoiceState(); // store 사용
    const { city, district, neighborhood } = userChoice.location;
    const address = `${city.name} ${district.name} ${neighborhood.name}`;
    console.log(address);

    if (!city.name || !district.name || !neighborhood.name) {
        console.error("지도 이동 실패: 위치 정보가 충분하지 않습니다.");
        return;
    }

    geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const kakaoCenter = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(kakaoCenter); // 지도 중심 이동
            map.setLevel(6); // 지도 중심 이동
        } else {
            console.error("주소 검색 실패: ", status);
        }
    });

    const aptList = mapStore.aptList;

    // aptList 순회하며 마커 생성
    aptList.forEach((apt) => {
        const address = `${apt.si} ${apt.gu} ${apt.dong} ${apt.roadNm}`;

        geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 마커 생성
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords,
                });

                // 마커에 표시할 정보 생성
                const infoWindowContent = `
                    <div style="padding: 10px; font-size: 14px;">
                        <strong>${apt.aptNm}</strong><br>
                        <span>가격: ${apt.dealAmount}만원</span>
                    </div>
                `;

                const infoWindow = new kakao.maps.InfoWindow({
                    content: infoWindowContent,
                });

                infoWindow.open(map, marker);

                // InfoWindow를 배열에 추가
                infoWindows.push(infoWindow);

                // 마커 클릭 이벤트
                kakao.maps.event.addListener(marker, "click", () => {
                    toggleInfoWindow(infoWindow, marker);
                });
            } else {
                console.error(`주소 검색 실패: ${address}`, status);
            }
        });
    });
};

const toggleInfoWindow = (infoWindow, marker) => {
    const isOpen = infoWindow.getMap(); // InfoWindow가 열려 있는지 확인
    if (isOpen) {
        infoWindow.close(); // 열려 있으면 닫기
    } else {
        closeAllInfoWindows(); // 다른 InfoWindow 모두 닫기
        infoWindow.open(map, marker); // 현재 InfoWindow 열기
    }
};

// 모든 InfoWindow 닫기
const closeAllInfoWindows = () => {
    infoWindows.forEach((infoWindow) => infoWindow.close());
};
</script>
<style scoped>
.mapContainer {
    width: 100%;
    height: calc(100vh - 70px);
}
/* 필요 시 스타일 추가 */
</style>
