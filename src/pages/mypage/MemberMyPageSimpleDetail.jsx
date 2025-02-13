import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";
import Swal from 'sweetalert2';
import CODE from "@/constants/code";

function MemberMyPageSimpleDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const [cnsltDsctnList, setCnsltDsctnList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [searchDto, setSearchDto] = useState({
        cnsltAplySn: location.state?.cnsltAplySn || "",
        cnsltSttsCd: location.state?.cnsltSttsCd || "",
    });
    const [simpleDetail, setSimpleDetail] = useState(null);

    useEffect(() => {
        console.log("컴포넌트가 마운트되었습니다.");
        console.log("초기 searchDto:", searchDto);

        const handleStorageChange = (event) => {
            if (event.key === "refreshCnsltDsctnList") {
                getSimpleDetail();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const getSimpleDetail = () => {
        if (!searchDto.cnsltAplySn) return;

        const getSimpleDetailURL = "/memberApi/getSimpleDetail";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getSimpleDetailURL,
            requestOptions,
            function (resp) {
                setSimpleDetail({
                    ...resp.result.simple
                });
                let dataList = [];
                dataList.push(
                    <p>내역이 없습니다.</p>
                );
                resp.result.cnsltDsctnList.forEach(function (item, index) {
                    if (index === 0) dataList = [];

                    dataList.push(
                        <div key={item.cnsltAplySn}>
                            <div className="input"
                                 style={{
                                     display: "flex",
                                     justifyContent: "center",
                                     alignItems: "center",
                                     gap: "10px"
                                 }}>

                                {item.dsctnSe === "0" ? (
                                    <>
                                        {/* 버튼 */}
                                        <button
                                            style={{
                                                border: "1px solid #007bff",
                                                background: "#007bff",
                                                color: "#fff",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleEditClick(item)} // 수정 버튼 클릭 시 핸들러 호출
                                        >
                                            수정
                                        </button>

                                        {/* 내용 */}
                                        <div
                                            style={{
                                                border: "1px solid #333",
                                                borderRadius: "10px",
                                                padding: "10px",
                                                width: "80%"
                                            }}
                                        >
                                            <div dangerouslySetInnerHTML={{__html: item.cn}}></div>
                                            <p style={{textAlign: "right"}}>
                                                {moment(item.frstCrtDt).format('YYYY.MM.DD  HH:MM')}
                                            </p>
                                        </div>

                                        {/* 사람 */}
                                        <div
                                            style={{
                                                border: "1px solid #333",
                                                borderRadius: "20px",
                                                padding: "10px",
                                                width: "7%"
                                            }}
                                        >
                                            <p style={{ textAlign: "center" }}>
                                                신청자
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* 사람 */}
                                        <div
                                            style={{
                                                border: "1px solid #333",
                                                borderRadius: "20px",
                                                padding: "10px",
                                                width: "7%"
                                            }}
                                        >
                                            <p style={{ textAlign: "center" }}>
                                                컨설턴트
                                            </p>
                                        </div>

                                        {/* 내용 */}
                                        <div
                                            style={{
                                                border: "1px solid #333",
                                                borderRadius: "10px",
                                                padding: "10px",
                                                width: "80%"
                                            }}
                                        >
                                            <div dangerouslySetInnerHTML={{__html: item.cn}}></div>
                                            <p style={{textAlign: "right"}}>
                                                {moment(item.frstCrtDt).format('YYYY.MM.DD  HH:MM')}
                                            </p>
                                        </div>

                                        {/* 버튼 */}
                                        <button
                                            style={{
                                                border: "1px solid #007bff",
                                                background: "#007bff",
                                                color: "#fff",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleEditClick(item)}
                                        >
                                            수정
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );

                });
                setCnsltDsctnList(dataList);
            },
            (error) => {
                console.error("Error fetching simple detail:", error);
            }
        );
    };
    
    const handleComClick = (cnsltAplySn) => {
        const setComSimpleURL = '/memberApi/setComSimple';

        Swal.fire({
            title: `해당 건에 대해 완료처리 하시겠습니까?`,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body:JSON.stringify({
                        cnsltAplySn: cnsltAplySn
                    }),
                };

                EgovNet.requestFetch(setComSimpleURL, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("처리완료 되었습니다.");
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {

            }
        });
    };

    const handleCreateClick = () => {
        const popupURL = `/popup/simple/create?cnsltAplySn=${searchDto.cnsltAplySn}`;
        window.open(popupURL, "_blank", "width=800,height=530");
    }

    const handleEditClick = (item) => {
        const popupData = {
            ...item
        };
        console.log("팝업에 전달될 데이터:", popupData);
        localStorage.setItem('popupData', JSON.stringify(popupData));
        window.open(`/popup/simple`, "_blank", "width=800,height=530");
    };

    useEffect(() => {
        getSimpleDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                {/* Step Indicator */}
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_MODIFY}>
                            <div className="num"><p>1</p></div>
                            <p className="text">회원정보수정</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li className="active">
                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}>
                            <div className="num"><p>3</p></div>
                            <p className="text">간편상담 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_DIFFICULTIES}>
                            <div className="num"><p>4</p></div>
                            <p className="text">애로사항 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CANCEL}>
                            <div className="num"><p>5</p></div>
                            <p className="text">회원탈퇴</p>
                        </NavLink>
                    </li>
                </ul>

                {/* 애로사항 상세 내용 */}
                <div className="contBox" style={{marginTop: "20px"}}>
                    {simpleDetail ? (
                        <div className="contBox infoWrap customContBox"
                             style={{padding: "20px", background: "#f9f9f9", borderRadius: "5px"}}>
                            <ul className="inputWrap" style={{listStyleType: "none", paddingLeft: "0"}}>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>등록일</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{moment(simpleDetail.frstCrtDt).format('YYYY-MM-DD')}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>분류</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{simpleDetail.cnsltAplyFldNm}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>제목</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>{simpleDetail.ttl}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>의뢰내용</small></label>
                                    <div className="input" style={{marginTop: "5px"}}
                                         dangerouslySetInnerHTML={{__html: simpleDetail.cn}}></div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>첨부파일</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>
                                        {simpleDetail.simpleFile && simpleDetail.simpleFile.length > 0 ? (
                                            <ul style={{paddingLeft: "20px"}}>
                                                {simpleDetail.simpleFile.map((file, index) => (
                                                    <li style={{marginBottom: "5px"}} key={index}>
                                                        <span
                                                            onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                                            style={{cursor: "pointer"}}>
                                                            {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : "첨부파일이 없습니다."}
                                    </div>
                                </li>
                            </ul>
                            <div className="contBox infoWrap customContBox">
                                <ul className="inputWrap">
                                    <li className="inputBox type1 email width1">
                                        <label className="title"><small>컨설팅 내역</small></label>
                                        {cnsltDsctnList}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="contBox infoWrap customContBox"
                             style={{padding: "20px", background: "#f9f9f9", borderRadius: "5px"}}>
                            <div className="input" style={{marginTop: "5px"}}>해당 간편상담의 상세 정보가 없습니다.</div>
                        </div>
                    )}
                </div>
                <div className="buttonBox">
                    <div className="leftBox">
                        {simpleDetail && searchDto.cnsltSttsCd !== "200" && (
                            <>
                                <button type="button" className="clickBtn point" onClick={() => handleCreateClick()}>
                                    <span>등록</span>
                                </button>
                                {sessionUser.mbrType !== 2 && (
                                    <button type="button" className="clickBtn point"
                                            onClick={() => handleComClick(searchDto.cnsltAplySn)}>
                                        <span>처리완료</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}>
                        <button type="button" className="clickBtn white">
                            목록
                        </button>
                    </NavLink>
                </div>

            </div>
        </div>
    );
}

export default MemberMyPageSimpleDetail;