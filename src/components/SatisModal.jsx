import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import * as EgovNet from "@/api/egovFetch";
import { getSessionItem } from "@/utils/storage";
import * as ComScript from "@/components/CommonScript";

const SatisModal = ({cnsltAplySn}) => {
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (!cnsltAplySn) return;
        getSatisPopup({ cnsltAplySn });
    }, [cnsltAplySn]);

    useEffect(() => {
        if (cnsltAplySn) {
            setRatings((prevRatings) => ({
                ...prevRatings,
                cnsltAplySn,
            }));
            getSatisPopup({ cnsltAplySn });
        }
    }, [cnsltAplySn]);

    const [ratings, setRatings] = useState({
        전문성: 0,
        응답성: 0,
        가격적정성: 0,
        신뢰성: 0,
        친절성: 0,
        cnsltAplySn: '',
        creatrSn: sessionUser.userSn,
    });


    const categories = ["전문성", "응답성", "가격적정성", "신뢰성", "친절성"];

    const getSatisPopup = (searchDto) => {
        const getSatisPopupURL = `/memberApi/getSatisPopup`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(getSatisPopupURL, requestOptions, function (resp) {
            if (!resp || !resp.result || !resp.result.ratings) return;

            const resultArray = resp.result.ratings;
            const updatedRatings = { ...ratings };

            resultArray.forEach((item) => {
                if (updatedRatings.hasOwnProperty(item.dgstfnArtcl)) {
                    updatedRatings[item.dgstfnArtcl] = parseInt(item.chcScr, 10);
                }
            });

            setRatings(updatedRatings);
            setIsDataLoaded(true);
        });
    };

    const handleRatingChange = (category, rating) => {
        if (isDataLoaded) {
            return;
        }

        setRatings((prevRatings) => ({
            ...prevRatings,
            [category]: rating,
        }));
    };

    useEffect(() => {
        getSatisPopup({ cnsltAplySn });
    }, [cnsltAplySn]);

    const handleSubmit = async () => {
        Swal.fire({
            title: '저장하시겠습니까?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(categories.map((category) => {
                        const formData = new FormData();
                        formData.append("dgstfnArtcl", category);
                        formData.append("chcScr", ratings[category].toString());
                        formData.append("cnsltAplySn", ratings.cnsltAplySn);
                        formData.append("creatrSn", ratings.creatrSn);
                        formData.append("actvtnYn", "Y");

                        const requestOptions = {
                            method: "POST",
                            body: formData,
                        };
                        return EgovNet.requestFetch("/memberApi/setSatisSimpleData", requestOptions);
                    }));

                    await Swal.fire({
                        title: "등록되었습니다.",
                        confirmButtonText: "확인",
                    });
                    ComScript.closeModal("surveyModal");
                } catch (error) {
                    Swal.fire({
                        title: "등록에 실패했습니다.",
                        icon: "error",
                        confirmButtonText: "확인",
                    });
                }
            }
        });
    };

    return (
            <div className="surveyModal modalCon">
                <div className="bg"  onClick={() => ComScript.closeModal("surveyModal")}></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="close" onClick={() => ComScript.closeModal("surveyModal")}>
                            <div className="icon"></div>
                        </div>
                        <div className="titleWrap type2">
                            <p className="tt1">만족도조사</p>
                        </div>
                        <div className="surveyBox">
                            <div className="cont">
                                <ul className="list">
                                    {categories.map((category) => (
                                        <li key={category}>
                                            <strong className="title">{category}</strong>
                                            <div className="starBox">
                                                {[1, 2, 3, 4, 5].map((value, index) => (
                                                    <div
                                                        key={index}
                                                        className={`icon ${ratings[category] >= value ? "click" : ""}`}
                                                        onClick={() => !isDataLoaded && handleRatingChange(category, value)}
                                                        style={{ cursor: "pointer" }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                type="button"
                                className="clickBtn black writeBtn"
                                onClick={handleSubmit}
                                disabled={isDataLoaded}
                                style={{ cursor: "pointer" }}
                            >
                                <span>등록</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default SatisModal;
