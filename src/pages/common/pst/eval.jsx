import React, {useEffect, useState} from 'react';
import {getSessionItem} from "@/utils/storage";
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
                    <div className="checkBox type3" key={item.comCdSn}>
                        <label className="checkBox type2">
                            <input
                                type="radio"
                                name="rating"
                                value={item.comCdSn}
                                onChange={(e) =>
                                    setPstEvl({...pstEvl, comCdSn: e.target.value})
                                }
                            />
                            <small>{item.comCdNm}</small>
                        </label>
                    </div>
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
            if (resp.result.pstEvl != null){
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
            <form className="satisfactionBox" data-aos="fade-up" data-aos-duration="1500">
                <strong className="title">현재 페이지의 내용이나 사용 편의성에 대해 만족하시나요?</strong>
                <div className="checkWrap">
                    {getComCdListToHtml(comCdList)}
                </div>
                <div className="inputBox type1">
                    <label className="input">
                        <input
                            type="text"
                            id="impvOpnnCn"
                            placeholder="정보에 대한 의견이 있으시면 작성해 주세요."
                            onChange={(e) =>
                                setPstEvl({...pstEvl, impvOpnnCn: e.target.value})
                            }
                        />
                    </label>
                </div>
                <button type="button" className="clickBtn blue" onClick={handleSubmit}><span>평가보내기</span></button>
            </form>
        )}
        </>

    );
};

export default CommonPstEval;