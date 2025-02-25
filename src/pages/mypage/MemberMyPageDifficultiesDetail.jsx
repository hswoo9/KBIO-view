import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";
import CommonSubMenu from "@/components/CommonSubMenu";
import * as ComScript from "@/components/CommonScript";
import DiffModal from "@/components/DiffModal";
function MemberMyPageDifficultiesDetail(props) {
    const [modalData, setModalData] = useState({});
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const [searchDto, setSearchDto] = useState({
        dfclMttrSn: location.state?.dfclMttrSn || "",
    });

    const [difficultiesDetail, setDifficultiesDetail] = useState(null);



    const modifyClick = (difficultiesDetail) => {
        if (sessionUser) {
            const updatedData = {
                ...difficultiesDetail,
            };
            setModalData(updatedData);
            ComScript.openModal("writeModal");
        } else {
        }
    }
    useEffect(() => {
        if (modalData && Object.keys(modalData).length > 0) {
            ComScript.openModal("writeModal");
        }
    }, [modalData]);

    const getDifficultiesDetail = () => {
        if (!searchDto.dfclMttrSn) return;

        const getDifficultiesDetailURL = "/memberApi/getDifficultiesDetail";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto),
        };

        EgovNet.requestFetch(
            getDifficultiesDetailURL,
            requestOptions,
            (resp) => {
                setDifficultiesDetail(resp.result.difficulties);
            },
            (error) => {
            }
        );
    };

    useEffect(() => {
        getDifficultiesDetail();
    }, [searchDto]);

    return (
        <div id="container" className="container mypage_difficulties">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <div className="board_view" data-aos="fade-up" data-aos-duration="1500">
                        <table>
                            <caption>애로사항 상세</caption>
                            <thead>
                            <tr>
                                <th>
                                    <div className="titleBox">
                                        <td className={`state ${difficultiesDetail?.ansCn ? "complete" : "waiting"}`}>
                                            <p>{difficultiesDetail?.ansCn ? "답변완료" : "답변대기"}</p>
                                        </td>
                                        <strong className="title">{difficultiesDetail?.ttl || ""}</strong>
                                        <ul className="bot">
                                            <li className="date">
                                                <p>{moment(difficultiesDetail?.frstCrtDt || "").format('YYYY-MM-DD')}</p></li>
                                        </ul>
                                    </div>
                                    {difficultiesDetail?.diffFiles && difficultiesDetail?.diffFiles.length > 0 ? (
                                        <ul className="fileBox">
                                            {difficultiesDetail?.diffFiles.map((file, index) => (
                                                <li key={index}>
                                                    <a href="javascript:;"
                                                       onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}>
                                                        <div className="icon"></div>
                                                        <p className="name">{file.atchFileNm}</p>
                                                        <span
                                                            className="size">({(file.atchFileSz / 1024).toFixed(2)} KB)</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : "첨부파일이 없습니다."}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="textBox">
                                        <p style={{fontSize: "1.35rem", fontWeight: "500"}}>
                                            {difficultiesDetail?.ttl}
                                        </p>
                                    </div>
                                    <div className="answerBox">
                                        <div className="titleBox">
                                            {difficultiesDetail?.ansCn ? (
                                                <>
                                                    <div className="state"><p>답변</p></div>
                                                    <p className="title"></p>
                                                    <ul className="bot">
                                                        <li>
                                                            <p>{moment(difficultiesDetail?.ansRegDt || "").isValid() ? moment(difficultiesDetail?.ansRegDt).format('YYYY-MM-DD') : '날짜 없음'}</p>
                                                        </li>
                                                        <li><p>관리자</p></li>
                                                    </ul>
                                                </>
                                            ) : (
                                                <div className="state"><p>답변</p></div>
                                            )}
                                        </div>
                                        <div className="textBox">
                                            {difficultiesDetail?.ansCn ? (
                                                <p dangerouslySetInnerHTML={{__html: difficultiesDetail?.ansCn}}></p>
                                            ) : (
                                                <p>답변대기중입니다.</p>
                                            )}
                                        </div>
                                        <div className="input" style={{marginTop: "5px"}}>
                                            {difficultiesDetail?.answerFiles && difficultiesDetail?.answerFiles.length > 0 ? (
                                                <ul style={{paddingLeft: "20px"}}>
                                                    {difficultiesDetail.answerFiles.map((file, index) => (
                                                        <li key={index} style={{marginBottom: "5px"}}>
                                                        <span onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)}
                                                              style={{cursor: "pointer"}}>
                                                            {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                                        </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : "첨부파일이 없습니다."}
                                        </div>
                                    </div>

                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td>
                                    <div className="buttonBox">
                                        {!difficultiesDetail?.ansCn && (
                                            <button type="button" className="clickBtn cancelBtn"
                                            style={{marginLeft: '10%'}}>
                                                <span>삭제</span>
                                            </button>
                                        )}

                                        {!difficultiesDetail?.ansCn && (
                                            <button type="button" className="clickBtn writeBtn"
                                                    onClick={() => {
                                                        modifyClick(difficultiesDetail);
                                                    }}>
                                                <div className="icon"></div>
                                                <span>수정</span>
                                            </button>
                                        )}

                                        {!difficultiesDetail?.ansCn && (
                                        <NavLink
                                            to={URL.MEMBER_MYPAGE_DIFFICULTIES}
                                            style={{width: '100%'}}
                                            state={{
                                                menuSn: location.state?.menuSn,
                                                menuNmPath: location.state?.menuNmPath
                                            }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                <span>목록</span>
                                            </button>
                                        </NavLink>
                                        )}
                                        {difficultiesDetail?.ansCn && (
                                            <NavLink
                                                to={URL.MEMBER_MYPAGE_DIFFICULTIES}
                                                style={{width: '100%', marginLeft: '40%'}}
                                                state={{
                                                    menuSn: location.state?.menuSn,
                                                    menuNmPath: location.state?.menuNmPath
                                                }}>
                                                <button type="button" className="clickBtn listBtn">
                                                    <div className="icon"></div>
                                                    <span>목록</span>
                                                </button>
                                            </NavLink>
                                            )}
                                    </div>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <DiffModal data={modalData}
            onSave={() => {
                getDifficultiesDetail();
            }}/>
        </div>

    );
}

export default MemberMyPageDifficultiesDetail;