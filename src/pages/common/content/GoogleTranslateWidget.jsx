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
                includedLanguages: 'ko,en', // 번역 지원할 언어 목록 (예시: 영어, 스페인어, 프랑스어, 독일어, 한국어)
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE, // 레이아웃 타입
            }, 'google_translate_element');
        };
    }, []);

    return (
        <div>
            <div id="google_translate_element">
            </div> {/* 번역 위젯을 표시할 위치 */}
        </div>
    );
};

export default GoogleTranslateWidget;
