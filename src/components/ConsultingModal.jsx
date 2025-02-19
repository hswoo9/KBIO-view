import React, {useState, useEffect, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import Swal from "sweetalert2";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import * as ComScript from "@/components/CommonScript";
import { getComCdList } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";

const ConsultingModal = ({data}) => {

    const [paramsData, setParamsData] = useState({});
    useEffect(() => {
        setFileList([]);
        setParamsData(data);
    }, [data]);
    useEffect(() => {
        setConsulting({
            cnsltSe : paramsData?.cnsltSe,
            cnslttUserSn : paramsData?.cnslttUserSn || '',
            creatrSn : paramsData?.userSn,
            userSn : paramsData?.userSn
        });
    }, [paramsData]);

    const [consulting, setConsulting] = useState({});
    useEffect(() => {
    }, [consulting]);

    const [comCdList, setComCdList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const acceptFileTypes = 'pdf,hwp,docx,xls,ppt';


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

    const handleChange = (value) => {
        setConsulting({...consulting, cn: value});
    };

    const setConsultingData = async () => {
        if (!consulting.cnsltFld) {
            Swal.fire("분야를 선택해주세요.");
            return;
        }

        if (!consulting.ttl) {
            Swal.fire("제목을 입력해주세요.");
            return;
        }
        if (!consulting.cn) {
            Swal.fire("내용을 입력해주세요.");
            return;
        }
        const formData = new FormData();
        for (let key in consulting) {
            if(consulting[key] != null){
                formData.append(key, consulting[key]);
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

                EgovNet.requestFetch("/consultingApi/setConsulting", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("등록되었습니다.").then((result) => {
                            if(result.isConfirmed) {
                                ComScript.closeModal("requestModal");
                                setConsulting({})
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
        getComCdList(10).then((data) => {
            setComCdList(data);
        });
    }, []);

    return (
        <div className="requestModal modalCon">
            <div className="bg" onClick={() => ComScript.closeModal("requestModal")}></div>
            <div className="m-inner">
                <div className="boxWrap">
                    <div className="close" onClick={() => ComScript.closeModal("requestModal")}>
                        <div className="icon"></div>
                    </div>
                    <div className="titleWrap type2">
                        <p className="tt1">{paramsData?.cnsltSe == 26 ? "컨설팅 의뢰" : "간편상담"}</p>
                    </div>
                    <form className="diffiBox">
                        <div className="cont">
                            <ul className="listBox">
                                <li className="inputBox type2 textBox">
                                    <p className="title">컨설턴트명</p>
                                    <p className="text">{paramsData?.kornFlnm}</p>
                                </li>
                                <li className="inputBox type2 gray">
                                    <p className="tt1 essential">분야</p>
                                    <div className="itemBox">
                                        <select
                                            id="cnsltFld"
                                            className="selectGroup"
                                            value={consulting.cnsltFld || ""}
                                            onChange={(e) =>
                                                setConsulting({...consulting, cnsltFld: e.target.value})
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
                                    <label htmlFor="request_title" className="tt1 essential">제목</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            title="제목"
                                            placeholder="제목을 입력해주세요"
                                            id="ttl"
                                            name="ttl"
                                            value={consulting.ttl || ""}
                                            onChange={(e) =>
                                                setConsulting({...consulting, ttl: e.target.value})
                                            }
                                        />
                                    </div>
                                </li>
                                <li className="inputBox type2">
                                    <label htmlFor="request_text" className="tt1 essential">의뢰내용</label>
                                    <div className="input">
                                        <CommonEditor
                                            onChange={handleChange}
                                            value={consulting.cn || ""}
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
                                    <div className="uploadBox"
                                           {...getRootProps({
                                               style: {
                                                   cursor: "pointer",
                                               },
                                           })}
                                    >
                                        <input {...getInputProps()} />
                                        <div className="text1">
                                            <div className="icon"></div>
                                            <strong>첨부파일 업로드</strong></div>
                                        <p className="text2">첨부파일은 pdf, hwp, docx, xls, ppt 형식만 가능하며 최대 10MB 까지만
                                            지원</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="botText">
                                <p>자문위원이 답변을 등록 할 경우 수정이 불가하오니 수정사항이 있으시면 <strong>“답변대기중”</strong> 일때 수정하시기 바랍니다.
                                </p>
                                <strong>빠른 시간안에 답변을 드리도록 하겠습니다</strong>
                            </div>
                        </div>
                        <button type="button" className="clickBtn black writeBtn" onClick={() => setConsultingData()}><span>등록</span></button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ConsultingModal;
