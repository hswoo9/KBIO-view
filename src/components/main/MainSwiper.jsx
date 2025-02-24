import React, {useState, useRef, useEffect, useCallback} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import {getMvnEntList} from "./MainComponents.jsx";

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

    const swiperSettings = {
        modules: [Autoplay, Navigation],
        slidesPerView: "auto",
        slidesPerGroup: 1,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
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


    /* 입주기업 데이터 */
    const [operationalList, setAuthorityList] = useState([]);
    const getOperationalList = (data) => {
        let dataList = [];
        console.log(data);
        {/* TODO :
                기업별 이미지 맞춰서 수정
        */}
        data.forEach(function (item, index) {
            dataList.push(
                <SwiperSlide className="swiper-slide" key={item.tblMvnEnt.mvnEntSn}>
                    <figure className="logoBox">
                        <img
                            src={`${window.location.protocol}//133.186.250.158${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                            alt={item.tblMvnEnt.mvnEntNm}
                            loading="lazy"
                        />
                    </figure>
                    <div className="textBox">
                        <h3 className="tt1">{item.tblMvnEnt.mvnEntNm}</h3>
                        <p className="tt2" dangerouslySetInnerHTML={{__html: item.bzentyExpln || "기업소개가 없습니다."}}></p>
                    </div>
                    <a href={item.tblMvnEnt.hmpgAddr} target="_blank" rel="noopener noreferrer" className="linkBtn" key={item.tblMvnEnt.mvnEntSn}><span>바로가기</span></a>
                </SwiperSlide>
            );
        });

        if(dataList.length < 5 && dataList.length > 1){
            data.forEach(function(item, index) {
                dataList.push(
                    <SwiperSlide className="swiper-slide" key={item.tblMvnEnt.mvnEntSn + 100}>
                        <figure className="logoBox">
                            <img
                                src={`${window.location.protocol}//133.186.250.158${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                                alt={item.tblMvnEnt.mvnEntNm}
                                loading="lazy"
                            />
                        </figure>
                        <div className="textBox">
                            <h3 className="tt1">{item.tblMvnEnt.mvnEntNm}</h3>
                            <p className="tt2" dangerouslySetInnerHTML={{__html: item.tblMvnEnt.bzentyExpln || "기업소개가 없습니다."}}></p>
                        </div>
                        <a href={item.tblMvnEnt.hmpgAddr} target="_blank" rel="noopener noreferrer" className="linkBtn"  key={item.tblMvnEnt.mvnEntSn + 100}><span>바로가기</span></a>
                    </SwiperSlide>
                )
            })

            data.forEach(function(item, index) {
                dataList.push(
                    <SwiperSlide className="swiper-slide" key={item.tblMvnEnt.mvnEntSn + 1000}>
                        <figure className="logoBox">
                            <img
                                src={`${window.location.protocol}//133.186.250.158${item.tblComFile.atchFilePathNm}/${item.tblComFile.strgFileNm}.${item.tblComFile.atchFileExtnNm}`}
                                alt={item.tblMvnEnt.mvnEntNm}
                                loading="lazy"
                            />
                        </figure>
                        <div className="textBox">
                            <h3 className="tt1">{item.tblMvnEnt.mvnEntNm}</h3>
                            <p className="tt2" dangerouslySetInnerHTML={{__html: item.tblMvnEnt.bzentyExpln || "기업소개가 없습니다."}}></p>
                        </div>
                        <a href={item.tblMvnEnt.hmpgAddr} target="_blank" rel="noopener noreferrer" className="linkBtn"  key={item.tblMvnEnt.mvnEntSn + 1000}><span>바로가기</span></a>
                    </SwiperSlide>
                )
            })
        }

        setAuthorityList(dataList);
    }

    useEffect(() => {
        getMvnEntList().then((data) => {
            getOperationalList(data);
        });
    }, []);

    return (
        <>
            <div className="swiper-wrapper">
                <Swiper {...swiperSettings} ref={swiperRef}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                >
                    {operationalList}
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
