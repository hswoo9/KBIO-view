import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import user_main_sec02_logo01 from "@/assets/images/user_main_sec02_logo01.png";
import user_main_sec02_logo02 from "@/assets/images/user_main_sec02_logo02.png";
import user_main_sec02_logo03 from "@/assets/images/user_main_sec02_logo03.png";
import user_main_sec02_logo04 from "@/assets/images/user_main_sec02_logo04.png";
import user_main_sec02_logo05 from "@/assets/images/user_main_sec02_logo05.png";

const MainSwiper = ({data}) => {
    const swiperRef = useRef(null);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
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
        modules: [Autoplay, Navigation],
        slidesPerView: "auto",
        slidesPerGroup: 1,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2000,
        },
        navigation: {
            nextEl: ".swiperBtn.nextBtn",
            prevEl: ".swiperBtn.prevBtn",
        },
        a11y: { // 웹접근성
            enabled: true,
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
            slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
        },

    }

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.params.navigation.prevEl = ".swiperBtn.prevBtn";
            swiperRef.current.swiper.params.navigation.nextEl = ".swiperBtn.nextBtn";
            swiperRef.current.swiper.navigation.init();
            swiperRef.current.swiper.navigation.update();
        }
    }, []);

    return (
        <>
            <div className="swiper-wrapper">
                <Swiper {...swiperSettings} ref={swiperRef}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo01} alt="서울 바이오 허브" loading="lazy"/>
                        </figure>
                        <div className="textBox">
                            <h3 className="tt1">서울 바이오 허브</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo02} alt="대웅제약" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">대웅제약</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo03} alt="바이오넥스" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">바이오넥스</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo04} alt="동화약품" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">동화약품</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo05} alt="GC 녹십자" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">GC 녹십자</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo01} alt="서울 바이오 허브" loading="lazy"/>
                        </figure>
                        <div className="textBox">
                            <h3 className="tt1">서울 바이오 허브</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo02} alt="대웅제약" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">대웅제약</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo03} alt="바이오넥스" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">바이오넥스</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo04} alt="동화약품" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">동화약품</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide">
                        <figure className="logoBox"><img src={user_main_sec02_logo05} alt="GC 녹십자" loading="lazy"/></figure>
                        <div className="textBox">
                            <h3 className="tt1">GC 녹십자</h3>
                            <p className="tt2">혁신적인 기술력과 신뢰를 바탕으로 <br/>바이오 산업의 미래를 열어가고 있습니다</p>
                        </div>
                        <a href="#" className="linkBtn"><span>바로가기</span></a>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="slideControl blue">
                <button type="button" className="arrowBtn prevBtn swiperBtn">
                    <div className="icon"></div>
                </button>
                <button type="button" onClick={toggleAutoPlay} className={isAutoPlay ? "pauseBtn" : "pauseBtn on"}>
                    <div className="icon"></div>
                </button>
                <button type="button" className="arrowBtn nextBtn swiperBtn">
                    <div className="icon"></div>
                </button>
            </div>
        </>
    );
}

export default MainSwiper;
