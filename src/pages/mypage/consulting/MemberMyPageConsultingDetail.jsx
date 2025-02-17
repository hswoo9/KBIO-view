import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";
import Swal from 'sweetalert2';
import CODE from "@/constants/code";

function MemberMyPageConsultingDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const [cnsltDsctnList, setCnsltDsctnList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [latestCreator, setLatestCreator] = useState(null);

    const [filesByDsctnSn, setFilesByDsctnSn] = useState([]);
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

    console.log(searchDto.cnsltSttsCd)

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
                setSimpleDetail({ ...resp.result.simple });

                if (resp.result.filesByDsctnSn) {
                    setFilesByDsctnSn(resp.result.filesByDsctnSn);
                }

                let dataList = [];
                if (resp.result.cnsltDsctnList.length === 0) {
                    dataList.push(<p key="no-data">내역이 없습니다.</p>);
                } else {
                    // 가장 최근 데이터 찾기 (frstCrtDt 기준 최신)
                    const latestItem = resp.result.cnsltDsctnList.reduce((latest, item) =>
                        moment(item.frstCrtDt).isAfter(moment(latest.frstCrtDt)) ? item : latest
                    );

                    setLatestCreator(latestItem.creatrSn);

                    console.log("최신 :",latestItem);

                    resp.result.cnsltDsctnList.forEach(function (item, index) {
                        if (index === 0) dataList =[];

                        const files = resp.result.filesByDsctnSn[item.cnsltDsctnSn] || [];
                        console.log("file : ", files);

                        const isLatest = item.cnsltAplySn === latestItem.cnsltAplySn;
                        const isOwnComment = item.creatrSn === sessionUser.userSn;
                        const isSn = latestItem.cnsltDsctnSn === item.cnsltDsctnSn;
                        const showEditButton = isLatest && isOwnComment && isSn && searchDto.cnsltSttsCd !== "200" && searchDto.cnsltSttsCd !== "999"

                        dataList.push(
                            <div key={index} className="input" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {item.dsctnSe === "0" ? (
                                    <>
                                        {showEditButton &&  (
                                            <button
                                                style={{ border: "1px solid #007bff", background: "#007bff", color: "#fff", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                                                onClick={() => handleEditClick(item)}
                                            >
                                                수정
                                            </button>
                                        )}
                                        <div style={{ border: "1px solid #333", borderRadius: "10px", padding: "10px", width: "80%" }}>
                                            <div dangerouslySetInnerHTML={{ __html: item.cn }}></div>
                                            {files.length > 0 && (
                                                <ul style={{paddingLeft: "20px"}}>
                                                    {files.map((file, fileIndex) => (
                                                        <li style={{marginBottom: "5px", marginTop: "20px"}} key={index}>
                                                        <span
                                                            onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                                            style={{cursor: "pointer"}}>
                                                            {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                                        </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <p style={{ textAlign: "right" }}>{moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}</p>
                                        </div>
                                        <div style={{ border: "1px solid #333", borderRadius: "20px", padding: "10px", width: "7%" }}>
                                            <p style={{ textAlign: "center" }}>신청자</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ border: "1px solid #333", borderRadius: "20px", padding: "10px", width: "7%" }}>
                                            <p style={{ textAlign: "center" }}>컨설턴트</p>
                                        </div>
                                        <div style={{ border: "1px solid #333", borderRadius: "10px", padding: "10px", width: "80%" }}>
                                            <div dangerouslySetInnerHTML={{ __html: item.cn }}></div>
                                            {files.length > 0 && (
                                                <ul style={{paddingLeft: "20px"}}>
                                                    {files.map((file, fileIndex) => (
                                                        <li style={{marginBottom: "5px", marginTop: "20px"}} key={index}>
                                                        <span
                                                            onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                                            style={{cursor: "pointer"}}>
                                                            {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                                        </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <p style={{ textAlign: "right" }}>{moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}</p>
                                        </div>
                                        {showEditButton && (
                                            <button
                                                style={{ border: "1px solid #007bff", background: "#007bff", color: "#fff", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                                                onClick={() => handleEditClick(item)}
                                            >
                                                수정
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    });
                }
                setCnsltDsctnList(dataList);
            },
            (error) => {
                console.error("Error fetching simple detail:", error);
            }
        );
    };

    const handleCancleClick = (cnsltAplySn) => {
        const setCancleSimpleURL = '/memberApi/setCancelSimple';

        Swal.fire({
            title: `해당 건에 대해 취소 하시겠습니까?`,
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

                EgovNet.requestFetch(setCancleSimpleURL, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("취소 되었습니다.").then(() => {
                            setSearchDto((prev) => ({
                                ...prev,
                                cnsltSttsCd: "999"
                            }));
                            getSimpleDetail();
                        });

                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {

            }
        });
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
                        Swal.fire("처리완료 되었습니다.").then(() => {
                            setSearchDto((prev) => ({
                                ...prev,
                                cnsltSttsCd: "200"
                            }));
                            getSimpleDetail();
                        });

                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {

            }
        });
    };


    const handleSatisClick = () => {
        const popupURL = `/popup/simple/satis?cnsltAplySn=${searchDto.cnsltAplySn}`;
        window.open(popupURL, "_blank", "width=800, height=600");
    }

    const handleCreateClick = () => {
        const popupURL = `/popup/simple/create?cnsltAplySn=${searchDto.cnsltAplySn}`;
        window.open(popupURL, "_blank", "width=800,height=530");
    }

    const handleEditClick = (item) => {

        const files = filesByDsctnSn[item.cnsltDsctnSn] || [];
        console.log(files)
        console.log("item 객체 확인:", item);
        const popupData = {
            ...item,
            simpleFiles: files
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
                    <li className="active">
                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li >
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
                                {/*<li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
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
                                </li>*/}
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
                        {simpleDetail && (
                            <>
                                {/* 취소상태일때 */}
                                {searchDto.cnsltSttsCd === "999" ? (
                                    <>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                                            <button type="button" className="clickBtn white">
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : cnsltDsctnList.length === 1 && latestCreator === sessionUser.userSn ? (
                                    <>
                                        <button type="button" className="clickBtn point"
                                                onClick={() => handleCancleClick(searchDto.cnsltAplySn)}>
                                            <span>취소</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                                            <button type="button" className="clickBtn white">
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : searchDto.cnsltSttsCd === "200" ? (
                                    // 처리 완료 상태일 경우
                                    <>
                                        <button type="button" className="clickBtn point"
                                                onClick={() => handleSatisClick()}>
                                            <span>만족도 조사</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                                            <button type="button" className="clickBtn white">
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : latestCreator === sessionUser.userSn ? (
                                    // 사용자가 로그인했을 때 마지막 작성자가 사용자일 경우
                                    <>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                                            <button type="button" className="clickBtn white">
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : latestCreator !== sessionUser.userSn && sessionUser.mbrType !== 2 ? (
                                    // 사용자가 로그인했을 때 마지막 작성자가 컨설턴트일 경우
                                    <>
                                        <button type="button" className="clickBtn point"
                                                onClick={() => handleCreateClick()}>
                                            <span>등록</span>
                                        </button>
                                        <button type="button" className="clickBtn point"
                                                onClick={() => handleComClick(searchDto.cnsltAplySn)}>
                                            <span>처리완료</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                                            <button type="button" className="clickBtn white">
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : sessionUser.mbrType === 2 ? (
                                    // 컨설턴트가 로그인했을 때 마지막 작성자가 사용자일 경우
                                    <>
                                        <button type="button" className="clickBtn point"
                                                onClick={() => handleCreateClick()}>
                                            <span>등록</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                                            <button type="button" className="clickBtn white">
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : (
                                    // 컨설턴트가 로그인했을 때 마지막 작성자가 컨설턴트일 경우
                                    <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}>
                                        <button type="button" className="clickBtn white">
                                            목록
                                        </button>
                                    </NavLink>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MemberMyPageConsultingDetail;