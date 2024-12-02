import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Kakao Maps 스크립트를 비동기로 로드
const loadKakaoMapScript = () => {
    return new Promise((resolve, reject) => {
        // 이미 스크립트가 로드된 경우
        if (window.kakao && window.kakao.maps) {
            resolve();
            return;
        }

        // 새로 스크립트를 로드
        const script = document.createElement("script");
        script.id = "kakao-map-script";
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
            import.meta.env.VITE_KAKAO_API_KEY
        }&libraries=services,clusterer`;
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
    });
};

loadKakaoMapScript()
    .then(() => {
        console.log("Kakao Maps SDK 로드 완료!");

        // Vue 앱 초기화
        const app = createApp(App);
        const pinia = createPinia();

        app.use(router);
        app.use(pinia);
        app.mount("#app");
    })
    .catch((error) => {
        console.error("Kakao Maps SDK 로드 실패:", error);
    });
