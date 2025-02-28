/**
 * 모달창 열기
 * @param className
 */
export function openModal(className) {
    const element = document.querySelector("." + className);
    if(element){
        const htmlElement = document.querySelector("html");
        const bodyElement = document.querySelector("body");
        if(htmlElement){
            htmlElement.style.overflow = "hidden";
        }
        if(bodyElement){
            bodyElement.style.overflow = "hidden";
        }
        element.classList.add("open");
    }
}

/**
 * 유튜브 등 외부 링크 있는 경우
 */
export function convertOembedToIframe(html) {
    return String(html).replace(
        /<oembed url="(.*?)"><\/oembed>/g,
        (match, url) => {
            if (url.includes("youtube.com") || url.includes("youtu.be")) {
                const videoId = url.split("/").pop().split("?")[0];
                return `
            <div class="video-container">
              <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
            }
            return match;
        }
    );
}

/**
 * 모달창 닫기
 * @param className
 */
export function closeModal(className) {
    const element = document.querySelector("." + className);
    if(element){
        const htmlElement = document.querySelector("html");
        const bodyElement = document.querySelector("body");
        if(htmlElement){
            htmlElement.style.overflow = "visible";
        }
        if(bodyElement){
            bodyElement.style.overflow = "visible";
        }
        element.classList.remove("open");
    }
}

/**
 * 연락처 - 추가
 * telNumber 숫자 ( ex 01012341234 )
 */
export function formatTelNumber(telNumber){
    if (!telNumber) return "";
    const numbers = telNumber.replace(/\D/g, ""); // 숫자만 추출
    if(numbers.length === 8){
        return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
    } else if (numbers.length === 9) {
        // 지역번호 2자리 (서울 02) + 3자리 + 4자리
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    } else if (numbers.length === 10) {
        if (numbers.startsWith("02")) {
            // 서울 (02) -> 2자리 지역번호 + 4자리 + 4자리
            return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        } else {
            // 일반 지역번호 (031, 032 등) -> 3자리 지역번호 + 3자리 + 4자리
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
        }
    } else if (numbers.length === 11) {
        // 휴대폰 또는 3자리 지역번호 (010, 031 등) + 4자리 + 4자리
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
    return numbers;
}
