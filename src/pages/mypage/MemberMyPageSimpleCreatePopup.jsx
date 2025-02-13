import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { fileDownLoad } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";
import { useDropzone } from 'react-dropzone';
import * as EgovNet from "@/api/egovFetch";
import CODE from "@/constants/code";

function MemberMyPageSimplePopup() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cnsltAplySn = queryParams.get('cnsltDsctnSn');

    const [simplePopupModify, setSimplePopupModify] = useState({
        content: '',
        simpleFiles: [],
        cn: ''// 파일 목록도 관리
    });
    const [fileList, setFileList] = useState([]);
    const acceptFileTypes = 'pdf,hwp,docx,xls,xlsx,ppt';

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
        setFileList(updatedFileList);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSimplePopupModify({ ...simplePopupModify, [name]: value });
    };

    const handleEditorChange = (value) => {
        console.log("Editor 변경된 값:", value);
        setSimplePopupModify({ ...simplePopupModify, content: value, cn: value });
    };

    const handleSave = () => {
        const formData = new FormData();

        console.log("저장할 데이터:", simplePopupModify.cn);

        for (let key in simplePopupModify) {
            if (simplePopupModify[key] != null && key !== "simpleFiles") {
                formData.append(key, simplePopupModify[key]);
            }
        }

        fileList.forEach((file) => {
            formData.append("simpleFiles", file);
        });

        Swal.fire({
            title: '저장하시겠습니까?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소',
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    body: formData
                };
                const apiUrl = simplePopupModify.mode === CODE.MODE_CREATE ? "/memberApi/setSimpleCreateData" : "/memberApi/setSimpleData";
                EgovNet.requestFetch(apiUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("수정되었습니다.").then(() => {
                            localStorage.setItem("refreshCnsltDsctnList", Date.now());
                            window.close();
                        });
                    } else {
                        // 오류 처리
                    }
                });
            } else {
                // 취소
            }
        });
    };

    return (
        <div style={{
            padding: "20px",
            borderRadius: "8px",
            background: "#f9f9f9",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
            <h2 style={{marginBottom: "20px", color: "#333"}}>상담 수정</h2>

            {/* 내용 수정 */}
            <div style={{marginBottom: "15px"}}>
                <label style={{fontWeight: "bold"}}>내용:</label>
                <CommonEditor
                    value={simplePopupModify.content}
                    onChange={handleEditorChange}
                />
            </div>

            {/* 첨부파일 */}
            <div style={{marginBottom: "15px"}}>
                <label style={{fontWeight: "bold"}}>첨부파일</label>
                <div
                    {...getRootProps({
                        style: {
                            border: "2px dashed #cccccc",
                            padding: "20px",
                            textAlign: "center",
                            cursor: "pointer",
                        },
                    })}
                >
                    <input {...getInputProps()} />
                    <p>파일을 이곳에 드롭하거나 클릭하여 업로드하세요</p>
                </div>

                {fileList.length > 0 && (
                    <ul>
                        {fileList.map((file, index) => (
                            <li key={index}>
                                {file.name} - {(file.size / 1024).toFixed(2)} KB

                                <button
                                    onClick={() => handleDeleteFile(index)}  // 삭제 버튼 클릭 시 처리할 함수
                                    style={{marginLeft: '10px', color: 'red'}}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <span className="warningText"></span>
            </div>

            <button onClick={handleSave} style={{
                padding: "10px 15px",
                borderRadius: "5px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer"
            }}>
                등록
            </button>
        </div>
    );
}

export default MemberMyPageSimplePopup;
