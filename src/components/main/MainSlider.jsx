import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import "@/css/slickCustomTheme.css";
import "@/css/slickCustom.css";
import {getBnrPopupList} from "./MainComponents.jsx";

const MainSlider = () => {
    const [bannerList, setBannerList] = useState([]);
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [key, setKey] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const autoplaySpeed = 8000;

    const toggleAutoPlay = () => {
        setIsAutoPlay((prev) => {
            if (prev) {
                sliderRef.current.slickPause();
            } else {
                sliderRef.current.slickPlay();
            }
            return !prev;
        });
    }

    const nextSlide = () => {
        sliderRef.current.slickNext();
    };

    const prevSlide = () => {
        sliderRef.current.slickPrev();
    };

    const sliderSettings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        focusOnSelect: false,
        speed : 400,
        arrows : false,
        autoplay : isAutoPlay ,
        autoplaySpeed : autoplaySpeed,
        pauseOnFocus: false,
        pauseOnHover: false,
        draggable: true,
        swipe: true,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex + 1);
            setKey(prevKey => prevKey + 1);
        },
    }

    useEffect(() => {
        getBnrPopupList("bnr").then((data) => {
            if(data != null){
                let list = [];
                data.forEach(function(item, index){
                    if(item.tblBnrPopup.bnrPopupFrm == "mainTopSlides"){
                        list.push(
                            <div className="box" key={item.tblBnrPopup.bnrPopupSn}>
                                <h2 className="tt1">
                                    <strong
                                        dangerouslySetInnerHTML={{__html: item.tblBnrPopup.bnrPopupTtl.replaceAll("^", "<br/>")}}
                                    >
                                    </strong>
                                </h2>
                                <p
                                    className="tt2"
                                    dangerouslySetInnerHTML={{__html: item.tblBnrPopup.bnrCn.replaceAll("^", "<br/>")}}
                                >
                                </p>
                            </div>
                        );
                    }
                });

                if(list.length == 1){
                    data.forEach(function(item, index){
                        if(item.tblBnrPopup.bnrPopupFrm == "mainTopSlides"){
                            list.push(
                                <div className="box" key={item.tblBnrPopup.bnrPopupSn}>
                                    <h2 className="tt1">
                                        <strong
                                            dangerouslySetInnerHTML={{__html: item.tblBnrPopup.bnrPopupTtl.replaceAll("^", "<br/>")}}></strong>
                                    </h2>
                                    <p className="tt2"
                                       dangerouslySetInnerHTML={{__html: item.tblBnrPopup.bnrCn.replaceAll("^", "<br/>")}}></p>
                                </div>
                            );
                        }
                    });
                }

                setBannerList(list);
            }
        });

    }, []);

    return (
        <div className="leftBox">
            <div className="textSlide">
                <Slider {...sliderSettings} ref={sliderRef}>
                    {/*<div className="box">*/}
                    {/*    <h2 className="tt1">글로벌 의약 바이오 스타트업 <br/>육성을 통한 <br/><strong>바이오 강국 실현</strong></h2>*/}
                    {/*    <p className="tt2">의약바이오 분야 창업 기업이 글로벌 혁신 기업으로 <br/>빠르게 성장할 수 있도록 특화지원</p>*/}
                    {/*</div>*/}
                    {/*<div className="box">*/}
                    {/*    <h2 className="tt1">글로벌 의약 바이오 스타트업 <br/>육성을 통한 <br/><strong>바이오 강국 실현2</strong></h2>*/}
                    {/*    <p className="tt2">의약바이오 분야 창업 기업이 글로벌 혁신 기업으로 <br/>빠르게 성장할 수 있도록 특화지원</p>*/}
                    {/*</div>*/}
                    {/*<div className="box">*/}
                    {/*    <h2 className="tt1">글로벌 의약 바이오 스타트업 <br/>육성을 통한 <br/><strong>바이오 강국 실현3</strong></h2>*/}
                    {/*    <p className="tt2">의약바이오 분야 창업 기업이 글로벌 혁신 기업으로 <br/>빠르게 성장할 수 있도록 특화지원</p>*/}
                    {/*</div>*/}
                    {/*<div className="box">*/}
                    {/*    <h2 className="tt1">글로벌 의약 바이오 스타트업 <br/>육성을 통한 <br/><strong>바이오 강국 실현4</strong></h2>*/}
                    {/*    <p className="tt2">의약바이오 분야 창업 기업이 글로벌 혁신 기업으로 <br/>빠르게 성장할 수 있도록 특화지원</p>*/}
                    {/*</div>*/}
                    {bannerList}
                </Slider>
                <div className="slideControl white">
                    <button type="button" className="arrowBtn prevBtn" onClick={prevSlide}>
                        <div className="icon"></div>
                    </button>
                    <p className="nowPage">{"0" + currentSlide}</p>
                    <div className="slideBar">
                        <div className="bar" key={key} style={{ animationDuration: `${autoplaySpeed}ms` }}></div>
                    </div>
                    <button type="button" onClick={toggleAutoPlay} className={isAutoPlay ? "pauseBtn" : "pauseBtn on"}>
                        <div className="icon"></div>
                    </button>
                    <p className="totalPage">{"0" + bannerList.length}</p>
                    <button type="button" className="arrowBtn nextBtn" onClick={nextSlide}>
                        <div className="icon"></div>
                    </button>
                </div>
            </div>
        </div>

    );
}

export default MainSlider;
