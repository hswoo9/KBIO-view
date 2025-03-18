import React, { useState, useRef, useEffect } from 'react';
import {getBnrPopupList} from "@/components/main/MainComponents";

import user_main_rolling_logo01 from "@/assets/images/user_main_rolling_logo01.svg";
import user_main_rolling_logo02 from "@/assets/images/user_main_rolling_logo02.svg";
import user_main_rolling_logo03 from "@/assets/images/user_main_rolling_logo03.svg";
import user_main_rolling_logo04 from "@/assets/images/user_main_rolling_logo04.svg";
import user_main_rolling_logo05 from "@/assets/images/user_main_rolling_logo05.svg";

const MainFooterBanner = ({data}) => {
    let hostName = window.location.hostname;

    if(hostName == "localhost" || hostName == "127.0.0.1"){
        hostName = "133.186.250.158"
    }else{
        hostName = "133.186.146.192"
    }
    const wrapRef = useRef(null);
    const listRef = useRef(null);
    const [windowSize, setWindowSize] = useState(getWindowSize());
    //const animationRef = useRef(null);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    function getWindowSize() {
        if (window.innerWidth > 1279) return 'pc';
        if (window.innerWidth > 767) return 'ta';
        return 'mo';
    }



    const [bannerList, setBannerList] = useState([]);
    useEffect(() => {
        flowBannerAct();
    }, [bannerList]);
    useEffect(() => {
        getBnrPopupList("bnr").then((data) => {
            if(data != null){
                let list = [];
                data.forEach(function(item, index){
                    if(item.tblBnrPopup.bnrPopupFrm == "footSlides"){
                        list.push(
                            <li key={item.tblBnrPopup.bnrPopupSn}>
                                <a href={item.tblBnrPopup.bnrPopupUrlAddr || "/"} target="_blank">
                                    <img
                                        src={`http://${hostName}${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                                        alt={item.tblComFile.atchFileNm}
                                        loading="lazy"
                                    />
                                </a>
                            </li>
                        );
                    }
                });
                setBannerList(list);
            }
        });


    }, []);

    useEffect(() => {
        function handleResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    // 배너 애니메이션 시작
    const startAnimation = () => {
        const list = listRef.current;
        const speed = 15;
        const listWidth = list.offsetWidth;
        list.style.animation = `${listWidth / speed}s linear infinite flowRolling`;
    };

    // 배너 애니메이션 정지
    const stopAnimation = () => {
        const list = listRef.current;
        list.style.animation = "none";
    };

    // 재생/일시정지 버튼 동작
    const togglePlayPause = () => {
        if (isAutoPlay) {
            stopAnimation();
        } else {
            startAnimation();
        }
        setIsAutoPlay(!isAutoPlay);
    };

    // 이전 배너 이동
    const movePrev = () => {
        //stopAnimation();
        const list = listRef.current;
        list.style.transform = `translateX(100%)`;
        setTimeout(() => {
            list.prepend(list.lastElementChild);
            list.style.transition = "none";
            list.style.transform = `translateX(0)`;
            //startAnimation();
        }, 300);
    };

    // 다음 배너 이동
    const moveNext = () => {
        //stopAnimation();
        const list = listRef.current;
        list.style.transform = `translateX(-100%)`;
        setTimeout(() => {
            list.appendChild(list.firstElementChild);
            list.style.transition = "none";
            list.style.transform = `translateX(0)`;
            //startAnimation();
        }, 300);
    };

    /*const flowBannerAct = () => {
        const wrap = wrapRef.current;
        const list = listRef.current;
        if(listRef.current.children.length > 0){
            let liCount = list.children.length;
            const originalItems = Array.from(list.children); // 기존 li 목록 복사
            let index = 0;
            while (liCount < 10) {
                const cloneItem = originalItems[index].cloneNode(true); // 기존 li 복사
                list.appendChild(cloneItem);
                liCount++;
                index = (index + 1) % originalItems.length; // 순환하면서 복사
            }

            let wrapWidth = wrap.offsetWidth;
            let listWidth = list.offsetWidth;
            const speed = 15;
            let $clone = list.cloneNode(true);
            wrap.appendChild($clone);
            if (listWidth < wrapWidth) {
                const listCount = Math.ceil(wrapWidth * 2 / listWidth);
                for (let i = 2; i < listCount; i++) {
                    $clone = $clone.cloneNode(true);
                    wrap.appendChild($clone);
                }
            }
            wrap.querySelectorAll('.imgMove').forEach((el) => {
                el.style.animation = `${listWidth / speed}s linear infinite flowRolling`;
            });
        }
    };*/

    const flowBannerAct = () => {
        const wrap = wrapRef.current;
        const list = listRef.current;
        if (list.children.length > 0) {
            let liCount = list.children.length;
            const originalItems = Array.from(list.children);
            let index = 0;
            while (liCount < 10) {
                const cloneItem = originalItems[index].cloneNode(true);
                list.appendChild(cloneItem);
                liCount++;
                index = (index + 1) % originalItems.length;
            }
            startAnimation();
        }
    };

    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className="rollingWrap" style={{width: "75%", margin: "0 auto"}}>
                <div className="moveWrap" ref={wrapRef}>
                    <ul className="imgMove" ref={listRef}>
                        {bannerList}
                    </ul>
                </div>
            </div>
            <div className="slideControl blue" style={{width: "10%", display: "flex", justifyContent: "center", gap: "10px"}}>
                <button type="button" className="arrowBtn prevBtn swiperBtn" onClick={movePrev}>
                    <div className="icon"></div>
                </button>
                <button type="button" onClick={togglePlayPause} className={isAutoPlay ? "pauseBtn" : "pauseBtn on"}>
                    <div className="icon"></div>
                </button>
                <button type="button" className="arrowBtn nextBtn swiperBtn" onClick={moveNext}>
                    <div className="icon"></div>
                </button>
            </div>
        </div>
    );
}

export default MainFooterBanner;
