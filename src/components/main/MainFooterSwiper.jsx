import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import {getBnrPopupList, getMvnEntList, getPstList} from "@/components/main/MainComponents";



import user_main_sec02_logo01 from "@/assets/images/user_main_sec02_logo01.png";
import user_main_sec02_logo02 from "@/assets/images/user_main_sec02_logo02.png";
import user_main_sec02_logo03 from "@/assets/images/user_main_sec02_logo03.png";
import user_main_sec02_logo04 from "@/assets/images/user_main_sec02_logo04.png";
import user_main_sec02_logo05 from "@/assets/images/user_main_sec02_logo05.png";
import user_main_sec04_banner01 from "@/assets/images/user_main_sec04_banner01.jpg";

const MainFooterSwiper = ({data}) => {
    const swiperRef = useRef(null);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [swiperList, setSwiperList] = useState([]);
    const [bannerList, setBannerList] = useState([]);
    const toggleAutoPlay = () => {
        setIsAutoPlay((prev) => {
            if (prev) {
                swiperRef.current.autoplay.stop();
            } else {
                swiperRef.current.autoplay.start();
            }
            return !prev;
        });
    }

    const prevClickHandler = () => {
        swiperRef.current.swiper.slidePrev();
    };

    const nextClickHandler = () => {
        swiperRef.current.swiper.nextEl();
    };

    const swiperSettings = {
        modules: [Autoplay, Navigation, Pagination],
        slidesPerView: "auto",
        slidesPerGroup: 1,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
        },
        navigation: {
            nextEl: ".footerSwiperBtn.nextBtn",
            prevEl: ".footerSwiperBtn.prevBtn",
        },
        pagination: {
            el: ".footerSwiperBtn.swiper-pagination",
            clickable: true,
        },
        a11y: { // 웹접근성
            enabled: true,
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
            slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
        },

    }

    useEffect(() => {
        getBnrPopupList("bnr").then((data) => {
            setBannerList(data.filter(e => e.tblBnrPopup.bnrPopupFrm == "mainSlides"));
        });

        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.params.navigation.prevEl = ".footerSwiperBtn.prevBtn";
            swiperRef.current.swiper.params.navigation.nextEl = ".footerSwiperBtn.nextBtn";
            swiperRef.current.swiper.navigation.init();
            swiperRef.current.swiper.navigation.update();
        }

        if (swiperRef.current && swiperRef.current.swiper) {
            const swiperInstance = swiperRef.current.swiper;
            swiperInstance.params.pagination.el = ".footerSwiperBtn.swiper-pagination";
            swiperInstance.pagination.init();
            swiperInstance.pagination.update();
        }

    }, []);

    return (
        <>
            <style>
            {`
                .swiper-wrapper .swiper-initialized {width : 100%;
            `}
            </style>
            <div className="box bannerBox" data-aos="fade-in">
                <div className="topBox" data-aos="fade-in" data-aos-duration="1500">
                    <h2 className="secTitle">배너</h2>
                    <div className="slideControl">
                        <button type="button" className="arrowBtn prevBtn footerSwiperBtn">
                            <div className="icon"></div>
                        </button>
                        <button type="button" onClick={toggleAutoPlay} className={isAutoPlay ? "pauseBtn" : "pauseBtn on"}>
                            <div className="icon"></div>
                        </button>
                        <button type="button" className="arrowBtn nextBtn footerSwiperBtn">
                            <div className="icon"></div>
                        </button>
                    </div>
                </div>
                <div className="bannerSwiper swiper" data-aos="fade-up" data-aos-duration="1500">
                    <div className="swiper-wrapper">
                        <Swiper {...swiperSettings} ref={swiperRef}
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {
                                bannerList.length > 0 ? (
                                    bannerList.map( (bnr, index) => (
                                        bnr ? (
                                            <SwiperSlide className="swiper-slide" key={`${bnr.tblBnrPopup.bnrPopupSn || "no_key"}-${index}`}>
                                                <div className="bg"
                                                     onClick={() => {
                                                         window.open(bnr.tblBnrPopup.bnrPopupUrlAddr);
                                                     }}
                                                >
                                                    <img
                                                        src={`http://133.186.250.158${bnr.tblComFile.atchFilePathNm}/${bnr.tblComFile.strgFileNm}.${bnr.tblComFile.atchFileExtnNm}`}
                                                        alt={bnr.tblComFile.atchFileNm}
                                                        style={{
                                                            cursor: "pointer"
                                                        }}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ) : null
                                    ))
                                ) : (
                                    <SwiperSlide className="swiper-slide" key="bnr_no_data">
                                        <div className="bg"><img src={user_main_sec04_banner01} alt="images" loading="lazy"/>
                                        </div>
                                        <div className="textBox">
                                            <h2 className="text"></h2>
                                            <p className="title">등록된 배너가 없습니다.</p>
                                        </div>
                                    </SwiperSlide>
                                )
                            }
                        </Swiper>
                    </div>
                    <div className="swiper-pagination footerSwiperBtn"></div>
                </div>
            </div>
        </>
    );
}

export default MainFooterSwiper;
