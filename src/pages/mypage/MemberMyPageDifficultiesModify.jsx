import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";
import { useDropzone } from 'react-dropzone';
import Swal from "sweetalert2";

function MemberMyPageDifficultiesModify(props) {
    const sessionUser = getSessionItem("loginUser");
    const navigate = useNavigate();
    const location = useLocation();

    const [searchDto, setSearchDto] = useState({
        dfclMttrSn: location.state?.dfclMttrSn || "",
    });

    const [difficultiesDetail, setDifficultiesDetail] = useState(null);
    const [fileList, setFileList] = useState([]);
    const acceptFileTypes = 'pdf,hwp,docx,xls,xlsx,ppt';

    const handleChange = (value) => {
        setDifficultiesDetail({ ...difficultiesDetail, dfclMttrCn: value });
    };

    const onDrop = useCallback((acceptedFiles) => {
        const allowedExtensions = acceptFileTypes.split(','); // 허용된 확장자 목록
        const validFiles = acceptedFiles.filter((file) => {
            const fileExtension = file.name.split(".").pop().toLowerCase();
            return allowedExtensions.includes(fileExtension);
        });

        if (validFiles.length > 0) {
            setFileList((prevFiles) => [...prevFiles, ...validFiles]); // 유효한 파일만 추가
        }

        if (validFiles.length !== acceptedFiles.length) {
            Swal.fire(
                `허용되지 않은 파일 유형이 포함되어 있습니다! (허용 파일: ${acceptFileTypes})`
            );
        }

    }, [acceptFileTypes]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
    });

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
                console.error("Error fetching difficulties detail:", error);
            }
        );
    };

    const handleDeleteFile = (index) => {
        const updatedFileList = fileList.filter((_, i) => i !== index);
        setFileList(updatedFileList);
    };

    useEffect(() => {
        getDifficultiesDetail();
    }, [searchDto]);


    const setFileDel = (atchFileSn) => {
        Swal.fire({
            title: "삭제한 파일은 복구할 수 없습니다.\n그래도 삭제하시겠습니까?",
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
                    body:  JSON.stringify({
                        atchFileSn: atchFileSn,
                    }),
                };

                EgovNet.requestFetch("/commonApi/setFileDel", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("삭제되었습니다.");

                        const updatedFiles = difficultiesDetail.diffFiles.filter(file => file.atchFileSn !== atchFileSn);
                        setDifficultiesDetail({ ...difficultiesDetail, diffFiles: updatedFiles });
                    } else {
                    }
                });
            } else {
                //취소
            }
        });
    }

    const setDifficultiesData = async () => {
        if (!difficultiesDetail.dfclMttrCn) {
            Swal.fire("의뢰내용 입력해주세요.");
            return;
        }
        if (!difficultiesDetail.ttl) {
            Swal.fire("의뢰제목 입력해주세요.");
            return;
        }

        const formData = new FormData();
        for (let key in difficultiesDetail) {
            if(difficultiesDetail[key] != null && key != "diffFiles"){
                formData.append(key, difficultiesDetail[key]);
            }
        }

        fileList.map((file) => {
            formData.append("files", file);
        });
        Swal.fire({
            title: "저장하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "저장",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    body: formData
                };

                EgovNet.requestFetch("/memberApi/setDifficultiesData", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("수정되었습니다.");
                        navigate(
                            { pathname : URL.MEMBER_MYPAGE_DIFFICULTIES},
                        );
                    } else {
                    }
                });
            } else {
                //취소
            }
        });
    }

    return (
        <div id="container" className="container ithdraw join_step">
            <div className="inner">
                {/* Step Indicator */}
                <ul className="stepWrap" data-aos="fade-up" data-aos-duration="1500">
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_MODIFY} >
                            <div className="num"><p>1</p></div>
                            <p className="text">회원정보수정</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING} >
                            <div className="num"><p>2</p></div>
                            <p className="text">컨설팅의뢰 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE} >
                            <div className="num"><p>3</p></div>
                            <p className="text">간편상담 내역</p>
                        </NavLink>
                    </li>
                    <li className="active">
                        <NavLink to={URL.MEMBER_MYPAGE_DIFFICULTIES} >
                            <div className="num"><p>4</p></div>
                            <p className="text">애로사항 내역</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={URL.MEMBER_MYPAGE_CANCEL} >
                            <div className="num"><p>5</p></div>
                            <p className="text">회원탈퇴</p>
                        </NavLink>
                    </li>
                </ul>
                <div className="detailBox" style={{marginTop: "20px"}}>
                    {difficultiesDetail ? (
                        <div className="contBox infoWrap customContBox"
                             style={{padding: "20px", background: "#f9f9f9", borderRadius: "5px"}}>
                            <ul className="inputWrap" style={{listStyleType: "none", paddingLeft: "0"}}>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>등록일</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{moment(difficultiesDetail.frstCrtDt).format('YYYY-MM-DD')}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>분류</small></label>
                                    <div className="input"
                                         style={{marginTop: "5px"}}>{difficultiesDetail.dfclMttrFldNm}</div>
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>제목</small></label>
                                    <input
                                        type="text"
                                        value={difficultiesDetail.ttl}
                                        onChange={(e) => setDifficultiesDetail({
                                            ...difficultiesDetail,
                                            ttl: e.target.value
                                        })}
                                        style={{marginTop: "5px", width: "100%"}}
                                    />
                                </li>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>의뢰내용</small></label>
                                    <div>
                                        <CommonEditor
                                            value={difficultiesDetail.dfclMttrCn || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </li>
                                <li className="inputBox type1 width1">
                                    <label className="title" style={{fontWeight: "bold"}}><small>첨부파일</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>
                                        <div {...getRootProps({
                                            style: {
                                                border: "2px dashed #cccccc",
                                                padding: "20px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                            },
                                        })}>
                                            <input {...getInputProps()} />
                                            <p>파일을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
                                        </div>
                                        {difficultiesDetail && difficultiesDetail.diffFiles && difficultiesDetail.diffFiles.length > 0 ? (
                                            <ul style={{paddingLeft: "20px"}}>
                                                {difficultiesDetail.diffFiles.map((file, index) => (
                                                    <li key={index} style={{marginBottom: "5px"}}>
                                                            <span onClick={() => fileDownLoad(file.atchFileSn, file.atchFileNm)} style={{cursor: "pointer"}}>
                                                                {file.atchFileNm} - {(file.atchFileSz / 1024).toFixed(2)} KB
                                                            </span>
                                                        <button
                                                            onClick={() => setFileDel(file.atchFileSn)} // 삭제 버튼 클릭 시 처리할 함수
                                                            style={{marginLeft: '10px', color: 'red'}}
                                                        >
                                                            삭제
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}

                                        {/* 새로 업로드한 파일 목록 표시 */}
                                        {fileList.length > 0 && (
                                            <ul style={{paddingLeft: "20px"}}>
                                                {fileList.map((file, index) => (
                                                    <li key={index} style={{marginBottom: "5px"}}>
                                                        {file.name} - {(file.size / 1024).toFixed(2)} KB
                                                        <button
                                                            onClick={() => handleDeleteFile(index)} // 삭제 버튼 클릭 시 처리할 함수
                                                            style={{marginLeft: '10px', color: 'red'}}
                                                        >
                                                            삭제
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* 첨부파일이 없을 때만 메시지 표시 */}
                                        {(!difficultiesDetail || !difficultiesDetail.diffFiles || difficultiesDetail.diffFiles.length === 0) && fileList.length === 0 && (
                                            <div>
                                                <p>첨부파일이 없습니다.</p>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="contBox infoWrap customContBox"
                             style={{padding: "20px", background: "#f9f9f9", borderRadius: "5px"}}>
                            <ul className="inputWrap" style={{listStyleType: "none", paddingLeft: "0"}}>
                                <li className="inputBox type1 width1" style={{marginBottom: "10px"}}>
                                    <label className="title" style={{fontWeight: "bold"}}><small>상세 정보가
                                        없습니다.</small></label>
                                    <div className="input" style={{marginTop: "5px"}}>해당 애로사항의 상세 정보가 없습니다.</div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="buttonBox">
                    <div className="leftBox">
                        <button type="button" className="clickBtn point" onClick={() => setDifficultiesData()}><span>저장</span>
                        </button>
                    </div>
                    <NavLink
                        to={URL.MEMBER_MYPAGE_DIFFICULTIES}
                        className="btn btn_blue_h46 w_100"
                    >
                        <button type="button" className="clickBtn black"><span>목록</span></button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}


export default MemberMyPageDifficultiesModify;