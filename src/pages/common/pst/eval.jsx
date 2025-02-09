import React, {useEffect, useState} from 'react';
import {getSessionItem} from "../../../utils/storage.js";
import * as EgovNet from "@/api/egovFetch";
import Swal from "sweetalert2";
import moment from "moment/moment.js";
import CODE from "@/constants/code";
import { getComCdList } from "@/components/CommonComponents";

const CommonPstEval  = ({ pstSn }) => {
    const sessionUser = getSessionItem("loginUser");
    const [htmlView, setHtmlView] = useState(true);
    const [comCdList, setComCdList] = useState([]);
    const [paramsPstSn, setParamsPstSn] = useState({});
    useEffect(() => {
        getComCdList(2).then((data) => {
            setComCdList(data);
        })
        initMode();
    }, [paramsPstSn]);
    const [pstEvl, setPstEvl] = useState({
        evlYmd : moment(new Date()).format('YYYYMMDD'),
        evlUserSn : sessionUser ? sessionUser.userSn : "",
        creatrSn : sessionUser ? sessionUser.userSn : "",
        pstSn: pstSn,
        userSn: sessionUser ? sessionUser.userSn : ""
    });
    useEffect(() => {
    }, [pstEvl]);
    const handleSubmit = () => {
        if (!pstEvl.comCdSn) {
          alert('만족도를 선택해 주세요.');
          return;
        }

        const setPstEvlUrl = "/pstApi/setPstEvl";
        Swal.fire({
            title: "평가하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(pstEvl),
                };

                EgovNet.requestFetch(setPstEvlUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("평가가 제출되었습니다.");
                        document.getElementById("impvOpnnCn").value = ""
                        document.getElementsByName('rating').forEach((radio) => {
                            radio.checked = false;
                        });
                        setHtmlView(false);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
    };

    const getComCdListToHtml = (dataList) => {
        let htmlData = [];
        if(dataList != null && dataList.length > 0){
            dataList.forEach(function(item, index) {
                htmlData.push(
                    <label className="checkBox type2" key={item.pstEvlSn}>
                        <input
                            type="radio"
                            name="rating"
                            key={item.pstEvlSn}
                            value={item.comCdSn}
                            onChange={(e) =>
                                setPstEvl({...pstEvl, comCdSn: e.target.value})
                            }
                        />{item.comCdNm}</label>
                )
            });
        }
        return htmlData;
    }

    const initMode = () => {
        const requestURL = "/pstApi/getPstEvl.do";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(pstEvl)
        };

        EgovNet.requestFetch(requestURL, requestOptions, function (resp) {
           if(resp.result.pstEvl != null){
               setHtmlView(false);
           }else{
               setHtmlView(true);
           }
        });

    }

    useEffect(() => {
        setPstEvl((pstEvl) => ({
            ...pstEvl,
            pstSn: pstSn,
        }));
        setParamsPstSn(
            {
                pstSn: pstSn
            }
        )
    }, [pstSn]);


    return (
        <>
        {htmlView && (
            <div className="survey-container">
                <style>{`
                .survey-container {
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 5px;
                margin: 20px auto;
                font-family: Arial, sans-serif;
                }
                
                h3 {
                font-size: 16px;
                margin-bottom: 15px;
                }
                
                .rating-options {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 15px;
                }
                
                label {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 14px;
                }
                
                textarea.comment-box {
                width: 90%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 14px;
                resize: none;
                }
                
                .submit-button {
                background-color: #e91e63;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
                }
                
                .submit-button:hover {
                background-color: #c2185b;
                }
                
                `}
                </style>
                <h3>※ 현재 페이지의 내용이나 사용 편의성에 대해 만족하시나요?</h3>
                <div className="rating-options">
                    {getComCdListToHtml(comCdList)}
                </div>
                <div style={{display: "flex"}}>
                <textarea
                    className="comment-box"
                    id="impvOpnnCn"
                    placeholder="정보에 대한 의견이 있으시면 작성해 주세요."
                    onChange={(e) =>
                        setPstEvl({...pstEvl, impvOpnnCn: e.target.value})
                    }
                />
                    <button className="submit-button" onClick={handleSubmit}>
                        평가
                    </button>
                </div>
            </div>
        )}
        </>

    );
};

export default CommonPstEval;