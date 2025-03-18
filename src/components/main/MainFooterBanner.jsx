import React, { useState, useRef, useEffect } from 'react';
import {getBnrPopupList} from "@/components/main/MainComponents";
import play from '@/css/images/rel_play.png'
import pause from '@/css/images/rel_pause.png'
import next from '@/css/images/rel_next.png'
import prev from '@/css/images/rel_prev.png'

import topBtn from '@/css/images/top-btn.svg'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const MainFooterBanner = ({data}) => {
    let hostName = window.location.hostname;

    if(hostName == "localhost" || hostName == "127.0.0.1"){
        hostName = "133.186.250.158"
    }else{
        hostName = "133.186.146.192"
    }

    const sliderRef = useRef(null);
    const [bannerList, setBannerList] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true); // 자동 재생 상태

    const togglePlayPause = () => {
        if (isPlaying) {
            sliderRef.current.slickPause(); // 슬라이드 일시정지
        } else {
            sliderRef.current.slickPlay(); // 슬라이드 다시 시작
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        getBnrPopupList("bnr").then((data) => {
            if(data != null){
                let list = [];
                data.forEach(function(item, index){
                    if(item.tblBnrPopup.bnrPopupFrm == "footSlides"){
                        list.push(
                            <div key={item.tblBnrPopup.bnrPopupSn}>
                                <a  href={item.tblBnrPopup.bnrPopupUrlAddr || "/"} target="_blank">
                                    <img
                                        src={`${window.location.protocol}//${hostName}${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                                        alt={item.tblComFile.atchFileNm}
                                        loading="lazy"
                                        style={{height: "3.5rem"}}
                                    />
                                </a>
                            </div>
                        );
                    }
                });

                if(list.length < 6 && list.length > 1){
                    data.forEach(function(item, index){
                        if(item.tblBnrPopup.bnrPopupFrm == "footSlides"){
                            list.push(
                                <div key={item.tblBnrPopup.bnrPopupSn + 100}>
                                    <a  href={item.tblBnrPopup.bnrPopupUrlAddr || "/"} target="_blank">
                                        <img
                                            src={`${window.location.protocol}//${hostName}${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                                            alt={item.tblComFile.atchFileNm}
                                            loading="lazy"
                                            style={{height: "3.5rem"}}
                                        />
                                    </a>
                                </div>
                            );
                        }
                    });

                    data.forEach(function(item, index){
                        if(item.tblBnrPopup.bnrPopupFrm == "footSlides"){
                            list.push(
                                <div key={item.tblBnrPopup.bnrPopupSn + 1000}>
                                    <a  href={item.tblBnrPopup.bnrPopupUrlAddr || "/"} target="_blank">
                                        <img
                                            src={`${window.location.protocol}//${hostName}${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                                            alt={item.tblComFile.atchFileNm}
                                            loading="lazy"
                                            style={{height: "3.5rem"}}
                                        />
                                    </a>
                                </div>
                            );
                        }
                    });
                }
                setBannerList(list);
            }
        });
    }, []);

    const settings = {
        draggable : false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        responsive: [
            { breakpoint: 1430, settings: { slidesToShow: 5, variableWidth: false } },
            { breakpoint: 1200, settings: { slidesToShow: 4, variableWidth: false } },
            { breakpoint: 960, settings: { slidesToShow: 3, variableWidth: false } },
            { breakpoint: 500, settings: { slidesToShow: 2, variableWidth: false } },
            { breakpoint: 400, settings: { slidesToShow: 1, variableWidth: false } },
        ],
    };

    return (
        <div id="footer">
            <div className="WRAP">
                <div className="banner_list">
                    <Slider {...settings} ref={sliderRef}>
                        {bannerList}
                    </Slider>
                </div>

                <div className="banner_control">
                    <button
                        type="button"
                        className="banner_prev slick-arrow"
                        id="banner_prev"
                        onClick={() => sliderRef.current.slickPrev()} // 이전 버튼 클릭
                    >
                        <img
                            src={prev}
                            alt="이전"
                        />
                    </button>
                    <button
                        type="button"
                        className="banner_next slick-arrow"
                        id="banner_next"
                        onClick={() => sliderRef.current.slickNext()} // 다음 버튼 클릭
                    >
                        <img
                            src={next}
                            alt="다음"
                        />
                    </button>
                    <button
                        type="button"
                        className={`banner_play slick-arrow ${isPlaying ? "playing" : ""}`}
                        onClick={togglePlayPause} // 재생 / 일시정지 토글
                    >
                        <img
                            src={isPlaying ? pause : play}
                            alt={isPlaying ? "일시정지" : "재생"}
                        />
                    </button>

                    <div id="topBtn" title="상단으로 가기" onClick={() => window.scrollTo(0, 0)}>
                        <img src={topBtn} alt="상단으로 가기"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainFooterBanner;
