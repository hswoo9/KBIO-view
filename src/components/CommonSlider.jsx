import Slider from 'react-slick';
import "@/css/slickCustomTheme.css";
import "@/css/slickCustom.css";

const CommonSlider = ({data}) => {
    let hostName = window.location.hostname;

    if(hostName == "localhost" || hostName == "127.0.0.1"){
        hostName = "133.186.250.158"
    }else{
        hostName = "133.186.146.192"
    }

    const sliderSettings = {
        centerMode: true, //현재 컨텐츠 가운데 정렬
        variableWidth: true,
        dots: true, //슬라이드 및 동그라미 사용 여부
        infinite: true, // 슬라이드 반복 여부
        speed: 500, //슬라이드 넘기는 속도 ms
        slidesToShow: 5, // 한번에 보여질 슬라이드 개수
        slidesToScroll: 1, // 한번에 넘어가는 슬라이드 수
        arrows: false, //슬라이드 양 옆 뜨는 화살표 표시 여부
        autoplay: true, //자동재생
        autoplaySpeed: 5000, //자동재생속도
        pauseOvHover: true, //호버시 일시중지
        centerPadding: "60px",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    }

    return (
        <div className="slider-container">
            <Slider {...sliderSettings}>
                {
                    data.map( (item) => (
                        <div
                            key={item.tblBnrPopup.bnrPopupSn}
                            className="sliderInDiv"
                        >
                            <img
                                //src={window.location.hostname + item.tblComFile.atchFilePathNm + '/' + item.tblComFile.strgFileNm + '.' + item.tblComFile.atchFileExtnNm}
                                src={'http://' + hostName  + item.tblComFile.atchFilePathNm  + '/' + item.tblComFile.strgFileNm + '.' + item.tblComFile.atchFileExtnNm}
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
