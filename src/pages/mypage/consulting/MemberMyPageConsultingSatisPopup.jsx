import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { fileDownLoad } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";
import { useDropzone } from 'react-dropzone';
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";
import { getSessionItem } from "@/utils/storage";

function MemberMyPageSimpleStaisPopup() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const cnsltAplySn = params.get("cnsltAplySn");
    const sessionUser = getSessionItem("loginUser");
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [ratings, setRatings] = useState({
        전문성: 0,
        응답성: 0,
        가격적정성: 0,
        신뢰성: 0,
        친절성: 0,
        cnsltAplySn: cnsltAplySn,
        creatrSn: sessionUser.userSn,
    });

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
            const updatedRatings = {...ratings};

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
    }, [ratings]);


    useEffect(() => {
        getSatisPopup({ cnsltAplySn });
    }, [cnsltAplySn]);

    const handleSubmit = async () => {
        const formDataArray = [];

        for (let category in ratings) {
            if (category !== "cnsltAplySn" && category !== "creatrSn" && ratings[category] != null) {
                const formData = new FormData();
                formData.append("dgstfnArtcl", category);
                formData.append("chcScr", ratings[category].toString());
                formData.append("cnsltAplySn", ratings.cnsltAplySn);
                formData.append("creatrSn", ratings.creatrSn);
                formData.append("actvtnYn", "Y");
                formDataArray.push(formData);
            }
        }

        Swal.fire({
            title: '저장하시겠습니까?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(formDataArray.map((formData) => {
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

                    window.close();

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
        <div style={{
            padding: "20px",
            borderRadius: "8px",
            background: "#f9f9f9",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            margin: "0 auto"
        }}>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>만족도 조사</h2>

            {["전문성", "응답성", "가격적정성", "신뢰성", "친절성"].map((category) => (
                <div key={category} style={{ marginBottom: "20px" }}>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                        {category}
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {["★★★★★", "★★★★", "★★★", "★★", "★"].map((rating, index) => {
                            const value = 5 - index;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleRatingChange(category, value)}
                                    style={{
                                        background: ratings[category] === value ? "#007bff" : "#ccc",
                                        padding: "8px 12px",
                                        margin: "0 5px",
                                        border: "none",
                                        color: "#fff",
                                        cursor: isDataLoaded ? "not-allowed" : "pointer",
                                        borderRadius: "5px",
                                        fontSize: "16px",
                                        transition: "background 0.3s ease"
                                    }}
                                    value={value}
                                    disabled={isDataLoaded}
                                >
                                    {rating}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                {!isDataLoaded ? (
                    <>
                        <button onClick={handleSubmit} style={{
                            padding: "10px 20px",
                            borderRadius: "5px",
                            background: "#007bff",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}>
                            등록
                        </button>
                        <button onClick={() => window.close()} style={{
                            padding: "10px 20px",
                            borderRadius: "5px",
                            background: "#ccc",
                            color: "#333",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}>
                            취소
                        </button>
                    </>
                ) : (
                    <button onClick={() => window.close()} style={{
                        padding: "10px 20px",
                        borderRadius: "5px",
                        background: "#ccc",
                        color: "#333",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}>
                        닫기
                    </button>
                )}
            </div>
        </div>
    );
}

export default MemberMyPageSimpleStaisPopup;
