import React, {useState, useEffect, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import Swal from "sweetalert2";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import * as ComScript from "@/components/CommonScript";
import { getComCdList } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";
import moment from "moment/moment.js";

const DiffModal = ({data, onSave }) => {

    const [paramsData, setParamsData] = useState({});

    const [comCdList, setComCdList] = useState([]);
    const [fileList, setFileList] = useState([]);
    const acceptFileTypes = 'pdf,hwp,docx,xls,ppt';

    useEffect(() => {
        console.log(data);
        setParamsData(data);
    }, [data]);

    useEffect(() => {
        setDiff(paramsData);
    }, [paramsData]);

    const handleChange = (value) => {
        setDiff((prevDiff) => ({
            ...prevDiff,
            dfclMttrCn: value
        }));
    }


    useEffect(() => {
        if (paramsData?.diffFiles && paramsData?.diffFiles.length > 0) {
            setFileList(paramsData.diffFiles.map(file => ({
                name: file.atchFileNm,
                size: file.atchFileSz,
                path: file.atchFilePathNm,
                atchFileSn: file.atchFileSn,
                isUploaded: true,
            })));
        }
    }, [paramsData]);


    useEffect(() => {
        setDiff({
            ...paramsData,
            creatrSn: paramsData?.userSn || '',
            userSn: paramsData?.userSn || '',
            frstCrtDt: paramsData?.frstCrtDt || '',
            dfclMttrFldNm: paramsData?.dfclMttrFldNm || '',
            ttl: paramsData?.ttl || '',
            dfclMttrCn: paramsData?.dfclMttrCn || '',
            dfclMttrSn: paramsData?.dfclMttrSn || '',
            dfclMttrFld: paramsData?.dfclMttrFld || '',
            mdfrSn: paramsData?.userSn || '',
            diffFiles: paramsData?.diffFiles || [],
        });
    }, [paramsData]);


    const [diff, setDiff] = useState({});
    useEffect(() => {
    }, [diff]);

    useEffect(() => {
        setFileList([]);
        setParamsData(data);
    }, [data]);

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
        const file = fileList[index];
        if (file.isUploaded) {
            setFileDel(file.atchFileSn); // For fetched files, call setFileDel
        } else {
            const updatedFileList = fileList.filter((_, i) => i !== index);
            setFileList(updatedFileList); // For uploaded files, simply remove from the list
        }
    };

    const setFileDel = (atchFileSn) => {
        Swal.fire({
            title: "삭제한 파일은 복구할 수 없습니다.\n그래도 삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        atchFileSn: atchFileSn,
                    }),
                };

                EgovNet.requestFetch("/commonApi/setFileDel", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("삭제되었습니다.");

                        const updatedFiles = simple.diffFiles.filter(file => file.atchFileSn !== atchFileSn);
                        setSimple({ ...simple, diffFiles: updatedFiles });
                    }
                });
            }
        });
    }



    const setDifficultiesData = async () => {
        if (!diff.dfclMttrCn) {
            Swal.fire("의뢰내용 입력해주세요.");
            return;
        }
        if (!diff.ttl) {
            Swal.fire("의뢰제목 입력해주세요.");
            return;
        }

        const formData = new FormData();
        for (let key in diff) {
            if(diff[key] != null && key != "diffFiles"){
                formData.append(key, diff[key]);
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
                        Swal.fire("수정되었습니다.").then((result) => {
                            ComScript.closeModal("writeModal");
                            if (onSave) {
                                onSave();
                            }
                        });
                    } else {
                    }
                });
            } else {
                //취소
            }
        });
    }

    return (
        <div className="writeModal modalCon diffiModal">
            <div className="bg" onClick={() => ComScript.closeModal("writeModal")}></div>
            <div className="m-inner">
                <div className="boxWrap">
                    <div className="close" onClick={() => ComScript.closeModal("writeModal")}>
                        <div className="icon"></div>
                    </div>
                    <div className="titleWrap type2">
                        <p className="tt1">애로사항 수정</p>
                    </div>
                    <form className="diffiBox">
                        <div className="cont">
                            <ul className="listBox">
                                <li className="inputBox type2 textBox">
                                    <p className="title">신청일시</p>
                                    <p className="text">
                                        {diff?.frstCrtDt ? moment(diff.frstCrtDt).format('YYYY.MM.DD') : "날짜 없음"}
                                    </p>
                                </li>
                                <li className="inputBox type2 textBox">
                                    <p className="title">분야</p>
                                    <p className="text">{diff?.dfclMttrFldNm || "분야 없음"}</p>
                                </li>
                                <li className="inputBox type2">
                                    <label htmlFor="difficulties_title" className="tt1 essential">제목</label>
                                    <div className="input">
                                        <input
                                            type="text"
                                            name="difficulties_title"
                                            id="difficulties_title"
                                            title="제목"
                                            placeholder="제목을 입력해주세요"
                                            value={diff?.ttl || ""}
                                            onChange={(e) => setDiff({...diff, ttl: e.target.value})}
                                        />
                                    </div>
                                </li>
                                <li className="inputBox type2">
                                    <label htmlFor="difficulties_text" className="tt1 essential">애로사항 내용</label>
                                    <div className="input">
                                        <CommonEditor
                                            onChange={handleChange}
                                            value={diff?.dfclMttrCn || ""}
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
                        </div>
                        <button type="button" className="clickBtn black writeBtn" onClick={() => setDifficultiesData()}><span>수정</span></button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default DiffModal;