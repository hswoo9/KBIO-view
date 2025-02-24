import React, { useState, useRef, useEffect } from 'react';
import {getBnrPopupList} from "@/components/main/MainComponents";

import user_main_rolling_logo01 from "@/assets/images/user_main_rolling_logo01.svg";
import user_main_rolling_logo02 from "@/assets/images/user_main_rolling_logo02.svg";
import user_main_rolling_logo03 from "@/assets/images/user_main_rolling_logo03.svg";
import user_main_rolling_logo04 from "@/assets/images/user_main_rolling_logo04.svg";
import user_main_rolling_logo05 from "@/assets/images/user_main_rolling_logo05.svg";

const MainFooterBanner = ({data}) => {

    const wrapRef = useRef(null);
    const listRef = useRef(null);
    const [windowSize, setWindowSize] = useState(getWindowSize());
    function getWindowSize() {
        if (window.innerWidth > 1279) return 'pc';
        if (window.innerWidth > 767) return 'ta';
        return 'mo';
    }



    const [bannerList, setBannerList] = useState([]);
    useEffect(() => {
        console.log(bannerList);
    }, [bannerList]);
    useEffect(() => {
        getBnrPopupList("bnr").then((data) => {
            if(data != null){
                let list = [];
                data.forEach(function(item, index){
                    if(item.tblBnrPopup.bnrPopupFrm == "footSlides"){
                        list.push(
                            <li key={item.tblBnrPopup.bnrPopupSn}>
                                <img
                                    src={`http://133.186.250.158${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                                    alt={item.tblComFile.atchFileNm}
                                    loading="lazy"
                                />
                            </li>
                        );
                    }
                });
                setBannerList(list);
            }
        });


    }, []);

    useEffect(() => {
        if(wrapRef.current && listRef.current){
            flowBannerAct();
        }
    }, [wrapRef.current, listRef.current]);

    useEffect(() => {
        function handleResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    const flowBannerAct = () => {
        const wrap = wrapRef.current;
        const list = listRef.current;
        console.log(wrap);
        console.log(list);
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
    };

    return (
        <div className="rollingWrap">
            <div className="moveWrap" ref={wrapRef}>
                <ul className="imgMove" ref={listRef}>
                    {bannerList}
                </ul>
            </div>
        </div>
    );
}

export default MainFooterBanner;
