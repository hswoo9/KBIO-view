import React, { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import AOS from "aos";
import { useDropzone } from 'react-dropzone';
import CommonSubMenu from "@/components/CommonSubMenu";
import { getSessionItem } from "@/utils/storage";
import Swal from "sweetalert2";
import * as ComScript from "@/components/CommonScript";
import { getComCdList } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";

function contentView(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();
    const [comCdList, setComCdList] = useState([]);
    const acceptFileTypes = 'pdf,hwp,docx,xls,xlsx,ppt';
    const [fileList, setFileList] = useState([]);
    const [dfclMttr, setDfclMttr] = useState({
        creatrSn : sessionUser?.userSn,
        userSn : sessionUser?.userSn
    });

    const handleChange = (value) => {
        setDfclMttr({...dfclMttr, dfclMttrCn: value});
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

    const handleDeleteFile = (index) => {
        const updatedFileList = fileList.filter((_, i) => i !== index);
        setFileList(updatedFileList);  // 파일 리스트 업데이트
    };

    const setDfclMttrData = async () => {
        if (!dfclMttr.dfclMttrFld) {
            Swal.fire("분야를 선택해주세요.");
            return;
        }

        if (!dfclMttr.ttl) {
            Swal.fire("제목을 입력해주세요.");
            return;
        }
        if (!dfclMttr.dfclMttrCn) {
            Swal.fire("내용을 입력해주세요.");
            return;
        }

        const formData = new FormData();
        for (let key in dfclMttr) {
            if(dfclMttr[key] != null){
                formData.append(key, dfclMttr[key]);
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

                EgovNet.requestFetch("/consultingApi/setDfclMttr", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("등록되었습니다.").then((result) => {
                            if(result.isConfirmed) {
                                navigate(
                                    { pathname : URL.CONSULTANT_LIST},
                                    { state: {
                                            menuSn : location.state?.menuSn,
                                            menuNmPath : location.state?.menuNmPath,
                                        }
                                    }
                                );
                            }
                        });
                    } else {
                    }
                });
            } else {
                //취소
            }
        });
    };

    useEffect(() => {
        if(!sessionUser){
            Swal.fire("로그인이 필요한 서비스 입니다.").then((result) => {
                if(result.isConfirmed) {
                    ComScript.openModal("loginModal");
                }
            });
        }

        getComCdList(15).then((data) => {
            setComCdList(data);
        });

        AOS.init();
    }, []);

    return (
        <div id="container" className="container difficulties">
            <div className="inner">
                <CommonSubMenu/>
                <div className="inner2">
                    <form className="diffiBox">
                        <div className="cont">
                            <div className="leftBox">
                                <strong className="title">K-BioLabHub는 <br/>더 나은 서비스를 위해 <br/>애로사항 등록 서비스를 운영합니다.
                                </strong>
                                <p className="text">불편 사항이나 개선이 필요한 점이 있으면 <br/>언제든 알려주세요.</p>
                            </div>
                            <div className="rightBox">
                                <ul className="listBox">
                                    <li className="inputBox type2">
                                        <label htmlFor="title" className="tt1 essential">제목</label>
                                        <div className="input">
                                            <input
                                                type="text"
                                                name="ttl"
                                                title=""
                                                id="ttl"
                                                onChange={(e) =>
                                                    setDfclMttr({...dfclMttr, ttl: e.target.value})
                                                }
                                                title="제목"
                                                placeholder="제목을 입력해주세요"
                                                value={dfclMttr.ttl || ""}
                                            />
                                        </div>
                                    </li>
                                    <li className="inputBox type2 gray">
                                        <p className="tt1 essential">분류</p>
                                        <div className="itemBox">
                                            <select
                                                id="dfclMttrFld"
                                                className="selectGroup"
                                                value={dfclMttr.dfclMttrFld || ""}
                                                onChange={(e) =>
                                                    setDfclMttr({...dfclMttr, dfclMttrFld: e.target.value})
                                                }
                                            >
                                                <option value="">선택</option>
                                                {comCdList.map((item, index) => (
                                                    <option value={item.comCdSn} key={item.comCdSn}>{item.comCdNm}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </li>
                                    <li className="inputBox type2">
                                        <label htmlFor="text" className="tt1 essential">애로사항 내용</label>
                                        <div className="input">
                                            <CommonEditor
                                                onChange={handleChange}
                                                value={dfclMttr.dfclMttrCn || ""}
                                            />
                                        </div>
                                    </li>
                                    <li className="inputBox type2 gray file">
                                        <p className="tt1 essential">첨부파일</p>
                                        <ul className="fileName">
                                            {fileList.length > 0 && (
                                                <>
                                                {fileList.map((file, index) => (
                                                    <li key={index}>
                                                        <div className="nameBox">
                                                            <div className="icon"></div>
                                                            <p className="name">{file.name}</p>
                                                            <span
                                                                className="size">({(file.size / 1024).toFixed(2)}KB)</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="deletBtn"
                                                            onClick={() => handleDeleteFile(index)}  // 삭제 버튼 클릭 시 처리할 함수
                                                        >
                                                            <div className="icon"></div>
                                                        </button>
                                                    </li>
                                                ))}
                                                </>
                                            )}
                                        </ul>
                                        <label className="uploadBox">
                                            <input {...getInputProps()} />
                                            <div className="text1">
                                                <div className="icon"></div>
                                                <strong>첨부파일 업로드</strong>
                                            </div>
                                            <p className="text2">첨부파일은 pdf, hwp, docx, xls, xlsx, ppt 형식만 가능하며 최대 10MB
                                                까지만 지원</p>
                                        </label>
                                    </li>
                                </ul>
                                <div className="botText">
                                    <p>답변을 등록 할 경우 수정이 불가하오니 수정사항이 있으시면 <strong>“답변대기중”</strong> 일때 수정하시기 바랍니다.</p>
                                    <strong>빠른 시간안에 답변을 드리도록 하겠습니다</strong>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="clickBtn black writeBtn" onClick={() => setDfclMttrData()}><span>애로사항 등록하기</span></button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default contentView;
