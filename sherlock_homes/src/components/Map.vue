<template>
    <div ref="mapContainer" class="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useMapStore, userChoiceState } from "@/stores/store.js";
import { formatCurrency } from "@/util/util.js";

const mapContainer = ref(null);
const mapStore = useMapStore();

let map; // 지도 객체
let polygon; // 폴리곤 객체
let clusterer = null;
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
    () => mapStore.selectedApt,
    (newselectedApt) => {
        if (newselectedApt) {
            focusApt();
        }
    }
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
            map.setLevel(8); // 지도 중심 이동
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

const neighborhoodApts = async () => {
    const geocoder = new kakao.maps.services.Geocoder();
    const userChoice = userChoiceState(); // store 사용
    const { city, district, neighborhood } = userChoice.location;
    const address = `${city.name} ${district.name} ${neighborhood.name}`;
    console.log(address);

    if (!city.name || !district.name || !neighborhood.name) {
        console.error("지도 이동 실패: 위치 정보가 충분하지 않습니다.");
        return;
    }

    // 지도 중심 이동
    geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const kakaoCenter = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(kakaoCenter); // 지도 중심 이동
            map.setLevel(4); // 지도 중심 이동
        } else {
            console.error("주소 검색 실패: ", status);
        }
    });

    const aptList = mapStore.aptList;

    // 모든 마커를 생성하고 Promise.all로 기다림
    const markerPromises = aptList.map(
        (apt) =>
            new Promise((resolve, reject) => {
                const address = `${apt.si} ${apt.gu} ${apt.dong} ${apt.roadNm}`;
                geocoder.addressSearch(address, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(
                            result[0].y,
                            result[0].x
                        );

                        // const content = `
                        //     <div style="padding: 10px; font-size: 14px; background: #fff; border: 0.2px solid var(--primary-color)">
                        //         <strong>${apt.aptNm}</strong><br>
                        //         <span>가격: ${formatCurrency(
                        //             apt.dealAmount
                        //         )}원</span>
                        //     </div>
                        // `;

                        const content = document.createElement("div");
                        content.style.padding = "10px";
                        content.style.fontSize = "14px";
                        content.style.background = "#fff";
                        content.style.border =
                            "0.2px solid var(--primary-color)";
                        content.innerHTML = `
                            <strong>${apt.aptNm}</strong><br>
                            <span>가격: ${formatCurrency(
                                apt.dealAmount
                            )}원</span>
                        `;

                        // 이벤트 바인딩
                        content.addEventListener("click", () => {
                            alert("test");
                        });

                        const customOverlay = new kakao.maps.CustomOverlay({
                            position: coords,
                            content: content,
                        });

                        resolve(customOverlay); // 마커 반환
                    } else {
                        console.error(`주소 검색 실패: ${address}`, status);
                        resolve(null); // 실패 시 null 반환
                    }
                });
            })
    );

    // 모든 마커 생성 완료
    const markers = (await Promise.all(markerPromises)).filter(
        (marker) => marker !== null
    );

    // 클러스터러 초기화
    if (!clusterer) {
        // 클러스터러가 없을 경우 새로 생성
        clusterer = new kakao.maps.MarkerClusterer({
            map: map, // 클러스터러가 적용될 지도
            averageCenter: true, // 클러스터의 중심을 평균값으로 설정
            minLevel: 7, // 클러스터로 묶을 최소 지도 레벨
        });
    } else {
        // 클러스터러가 이미 존재하면 초기화
        clusterer.clear();
    }

    // 클러스터에 마커 추가
    clusterer.addMarkers(markers); // 새로운 마커 추가
};

let markers = []; // 지도에 표시된 마커들을 저장하는 배열

const focusApt = () => {
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(
        mapStore.selectedApt.roadNm,
        function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 지도 중심 이동
                map.setCenter(coords);
                map.setLevel(1);
            }
        }
    );
};
</script>
<style scoped>
.mapContainer {
    width: 100%;
    height: calc(100vh - 70px);
    z-index: 1;
}
/* 필요 시 스타일 추가 */
</style>
