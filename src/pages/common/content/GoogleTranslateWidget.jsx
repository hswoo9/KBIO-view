import React, { useEffect } from 'react';

const GoogleTranslateWidget = () => {
    useEffect(() => {
        // Google Translate 스크립트 로드
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);

        // Google Translate 초기화
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'ko', // 기본 언어 설정
                includedLanguages: 'ko, en', // 번역 지원할 언어 목록 (예시: 영어, 스페인어, 프랑스어, 독일어, 한국어)
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, // 레이아웃 타입
            }, 'google_translate_element');
        };
    }, []);

    return (
        <div>
            <style>{`
            /* GoogleTranslateWidget.css */
.google-translate-widget {
    position: fixed; /* 페이지 어디에 위치할지 설정 */
    bottom: 20px; /* 페이지 하단에 고정 */
    right: 20px; /* 페이지 오른쪽에 고정 */
    background-color: #fff; /* 배경색 설정 */
    padding: 10px; /* 위젯 주변 여백 설정 */
    border-radius: 5px; /* 둥근 모서리 */
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    z-index: 1000; /* 위젯이 다른 요소 위에 표시되도록 */
}

#google_translate_element {
    font-size: 14px; /* 폰트 크기 조정 */
}

.goog-te-gadget-simple {
    font-family: 'Arial', sans-serif !important; /* 폰트 변경 */
    font-size: 14px !important; /* 기본 텍스트 크기 조정 */
}

.goog-te-banner-frame {
    display: none !important; /* 기본 배너를 숨깁니다 */
}
           .skiptranslate iframe { display : none }
           `}</style>
            <div id="google_translate_element">

            </div> {/* 번역 위젯을 표시할 위치 */}
        </div>
    );
};

export default GoogleTranslateWidget;
