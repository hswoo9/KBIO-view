import Slider from 'react-slick';
import "@/css/slickCustomTheme.css";
import "@/css/slickCustom.css";

const CommonSlider = ({data}) => {

    const sliderSettings = {
        dots: true, //슬라이드 및 동그라미 사용 여부
        infinite: true, // 슬라이드 반복 여부
        speed: 500, //슬라이드 넘기는 속도 ms
        slidesToShow: 5, // 한번에 보여질 슬라이드 개수
        slidesToScroll: 1, // 한번에 넘어가는 슬라이드 수
        arrows: false, //슬라이드 양 옆 뜨는 화살표 표시 여부
        autoplay: true, //자동재생
        autoplaySpeed: 5000, //자동재생속도
        pauseOvHover: true, //호버시 일시중지
    }
    
    return (
        <div className="slider-container">
            <Slider {...sliderSettings}>
                {
                    data.map( (item) => (
                        <div
                            key={item.tblBnrPopup.bnrPopupSn}
                            style={{
                                width: "300px",
                                height: "300px",
                                textAlign: "center"
                            }}
                        >
                            <img
                                //src={window.location.hostname + item.tblComFile.atchFilePathNm + '/' + item.tblComFile.strgFileNm + '.' + item.tblComFile.atchFileExtnNm}
                                src={'http://133.186.250.158'  + item.tblComFile.atchFilePathNm  + '/' + item.tblComFile.strgFileNm + '.' + item.tblComFile.atchFileExtnNm}
                                alt={`슬라이드 이미지`}
                                className="slickImg"
                            />
                        </div>
                    ))
                }
            </Slider>
        </div>
    );
}

export default CommonSlider;
