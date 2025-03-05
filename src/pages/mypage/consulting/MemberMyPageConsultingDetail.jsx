import React, {useState, useEffect, useCallback} from "react";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";
import * as ComScript from "@/components/CommonScript";
import CommonEditor from "@/components/CommonEditor";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";
import Swal from 'sweetalert2';
import CODE from "@/constants/code";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getComCdList} from "@/components/CommonComponents";
import { useDropzone } from 'react-dropzone';
import SimpleModal from "@/components/SimpleModal";
import SatisModal from "@/components/SatisModal";


function MemberMyPageConsultingDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const navigate = useNavigate();
    const [cnsltDsctnList, setCnsltDsctnList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [latestCreator, setLatestCreator] = useState(null);
    const [consulttUser, setConsulttUser] = useState({});
    const [comCdList, setComCdList] = useState([]);
    const [filesByDsctnSn, setFilesByDsctnSn] = useState({});
    const [consulttUserName, setConsulttUserName] = useState({});
    const [fileList, setFileList] = useState([]);
    const [cnsltAplySn, setCnsltAplySn] = useState([]);
    const [simplePopupModify, setSimplePopupModify] = useState({
        creatrSn : sessionUser.userSn,
        dsctnSe: sessionUser.mbrType === 2 ? 1 : 0,
        actvtnYn : 'Y',
        cnsltAplySn : location.state?.cnsltAplySn,
    });

    const [cnsltProfileFile, setCnsltProfileFile] = useState({});
    const [cnsltCertificateFile, setCnsltCertificateFile] = useState([]);
    const acceptFileTypes = 'pdf,hwp,docx,xls,ppt';

    const [searchDto, setSearchDto] = useState({
        cnsltAplySn: location.state?.cnsltAplySn || "",
        cnsltSttsCd: location.state?.cnsltSttsCd || "",
        cnslttUserSn: location.state?.cnslttUserSn || "",
    });
    const [simpleDetail, setSimpleDetail] = useState(null);

    const handleEditorChange = (value) => {
        setSimplePopupModify({ ...simplePopupModify, cn: value });
    };

    const initMode = () => {
        getSimpleDetail(searchDto);
    };


    useEffect(() => {
        initMode();
    }, []);

    useEffect(() => {
        getComCdList(10).then((data) => {
            setComCdList(data);
        })
    }, []);

    const handleDeleteFile = (index) => {
        const updatedFileList = fileList.filter((_, i) => i !== index);
        setFileList(updatedFileList);  // 파일 리스트 업데이트
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

    const getSimpleDetail = (searchDto) => {

        const getSimpleDetailURL = "/memberApi/getSimpleDetail.do";
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
                setConsulttUser({
                    ...resp.result.consulttUser,
                });

                if (resp.result.cnsltProfileFile) {
                    setCnsltProfileFile({
                        ...resp.result.cnsltProfileFile
                    });
                }

                if (resp.result.cnsltCertificateFile) {
                    setCnsltCertificateFile(resp.result.cnsltCertificateFile);
                }

                if (resp.result.consulttUserName) {
                    setConsulttUserName(resp.result.consulttUserName);
                }

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

                    resp.result.cnsltDsctnList.forEach(function (item, index) {
                        if (index === 0) dataList =[];

                        const files = resp.result.filesByDsctnSn[item.cnsltDsctnSn];
                        item.simpleFiles = files

                        const isLatest = item.cnsltAplySn === latestItem.cnsltAplySn;
                        const isOwnComment = item.creatrSn === sessionUser.userSn;
                        const isSn = latestItem.cnsltDsctnSn === item.cnsltDsctnSn;
                        const showEditButton = isLatest && isOwnComment && isSn && searchDto.cnsltSttsCd !== "200" && searchDto.cnsltSttsCd !== "999" && searchDto.cnsltSttsCd !== "201"


                        dataList.push(
                            <div key={index} className="chatBox">
                                {item.dsctnSe === "0" ? (
                                    <>
                                        <div className={sessionUser.mbrType === 2 ? "answerBox" : "questionBox box"}>
                                            {sessionUser.mbrType === 2 ? ("") : (<span
                                                className={sessionUser.mbrType === 2 ? "time right" : "time left"}>{moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}</span>)}
                                            {sessionUser.mbrType === 2 ? (<figure className="profileBox">
                                                <img
                                                    src={cnsltProfileFile
                                                        ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                                        : ""}
                                                    alt="profile image"
                                                />
                                            </figure>) : ("")}

                                            <div className="rightBox">
                                                {sessionUser.mbrType === 2 ? (
                                                    <p className="name">{consulttUserName.kornFlnm}</p>) : ("")}
                                                <div className="box">
                                                    <div className="chatText">

                                                        <p className="text" dangerouslySetInnerHTML={{__html: item.cn}}></p>
                                                        {files?.length > 0 && (
                                                            <ul className="fileBox">
                                                                {files.map((file, fileIndex) => (
                                                                    <li key={fileIndex}>
                                                                        <a
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                fileDownLoad(file.atchFileSn, file.atchFileNm);
                                                                            }}
                                                                        >
                                                                            <div className="icon"></div>
                                                                            <p className="name">{file.atchFileNm}</p>
                                                                            <span className="size">
                                                                        ({(file.atchFileSz / 1024).toFixed(2)} KB)
                                                                    </span>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                    {sessionUser.mbrType === 2 ? (<span
                                                        className={sessionUser.mbrType === 2 ? "time" : "time left"}>{moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}</span>) : ("")}
                                                </div>

                                            </div>
                                            {showEditButton && (
                                                <button
                                                    type="button"
                                                    className="editBtn"
                                                    style={{marginLeft: "7%"}}
                                                    onClick={() => {
                                                        modifyClick(item);
                                                    }}>
                                                    <div className="icon"></div>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={sessionUser.mbrType === 2 ? "questionBox box" : "answerBox"}>
                                            {sessionUser.mbrType === 2 ? (<span
                                                className={sessionUser.mbrType === 2 ? "time left" : "time right"}>{moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}</span>) : ("")}
                                            {sessionUser.mbrType === 2 ? ("") : (<figure className="profileBox">
                                                <img
                                                    src={cnsltProfileFile
                                                        ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                                        : ""}
                                                    alt="profile image"
                                                />
                                            </figure>)}

                                            <div className="rightBox">
                                                {sessionUser.mbrType === 2 ? ("") : (
                                                    <p className="name">{consulttUserName.kornFlnm}</p>)}

                                                <div className="box">
                                                    <div className="chatText">
                                                        <p className="text"
                                                           dangerouslySetInnerHTML={{__html: item.cn}}></p>
                                                        {files?.length > 0 && (
                                                            <ul className="fileBox">
                                                                {files.map((file, fileIndex) => (
                                                                    <li key={fileIndex}>
                                                                        <a
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                fileDownLoad(file.atchFileSn, file.atchFileNm);
                                                                            }}
                                                                        >
                                                                            <div className="icon"></div>
                                                                            <p className="name">{file.atchFileNm}</p>
                                                                            <span className="size">
                                                                            ({(file.atchFileSz / 1024).toFixed(2)} KB)
                                                                        </span>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>

                                                    {sessionUser.mbrType === 2 ? ("") : (<span
                                                        className={sessionUser.mbrType === 2 ? "time left" : "time right"}>{moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}</span>)}


                                                </div>
                                            </div>
                                            {showEditButton && (
                                                <button
                                                    type="button"
                                                    className="editBtn"
                                                    style={{marginLeft: "7%"}}
                                                    onClick={() => {
                                                        modifyClick(item);
                                                    }}>
                                                    <div className="icon"></div>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    });
                }
                setCnsltDsctnList(dataList);
            },
            (error) => {
            }
        );
    };

    const [modalData, setModalData] = useState({});

    const modifyClick = (data) => {
        if(sessionUser){
            data.userSn = sessionUser?.userSn;
            data.dsctnSe = sessionUser?.mbrType === 2 ? 1 : 0;
            data.actvtnYn = 'Y';
            data.cnsltAplySn = location.state?.cnsltAplySn;
            setModalData(data)
            ComScript.openModal("modifyModal");
        }else{

        }
    }

    const acceptCnslt = (cnsltAplySn) => {
        const acceptCnsltUrl = "/memberApi/setAcceptCnslt";

        Swal.fire({
            title: `해당 의뢰를 수락 하시겠습니까?`,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        cnsltAplySn: cnsltAplySn
                    }),
                };

                EgovNet.requestFetch(acceptCnsltUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("완료 되었습니다.").then(() => {
                            setSearchDto((prev) => ({
                                ...prev,
                                cnsltSttsCd: "101"
                            }));
                            getSimpleDetail();
                        });

                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                return;
                //취소
            }
        });

    }

    const cancleCnsltRequest = (cnsltAplySn) => {
        const cancleCnsltRequestUrl = "/memberApi/setCancleCnsltRequest";
        Swal.fire({
            title: `해당 의뢰를 거절 하시겠습니까?`,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        cnsltAplySn: cnsltAplySn
                    }),
                };

                EgovNet.requestFetch(cancleCnsltRequestUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("처리 되었습니다.").then(() => {
                            navigate(URL.MEMBER_MYPAGE_CONSULTING, {
                                state : {
                                    menuSn: location.state?.menuSn,
                                    menuNmPath: location.state?.menuNmPath
                                }
                            });
                        });

                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                return;
                //취소
            }
        });
    }


    useEffect(() => {
        if (modalData && Object.keys(modalData).length > 0) {
            ComScript.openModal("modifyModal");
        }
    }, [modalData]);

    const handleSave = () => {
        const formData = new FormData();
        for (let key in simplePopupModify) {
            if(simplePopupModify[key] != null){
                formData.append(key, simplePopupModify[key]);
            }
        }

        fileList.map((file) => {
            formData.append("files", file);
        });
        const cnsltSttsCd = sessionUser.mbrType === 2 ? "102" : "101";
        formData.append("cnsltSttsCd", cnsltSttsCd);

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
                EgovNet.requestFetch("/memberApi/setCreateSimpleData", requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("등록되었습니다.").then(() => {
                            ComScript.closeModal("writeModal");
                            getSimpleDetail(searchDto)
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

    const handleCancleClick = (cnsltAplySn) => {
        const setCancleSimpleURL = '/memberApi/setCancelSimple';

        Swal.fire({
            title: `해당 건에 대해 취소 하시겠습니까?`,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then((result) => {
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
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
            if (result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        cnsltAplySn: cnsltAplySn
                    }),
                };

                EgovNet.requestFetch(setComSimpleURL, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("처리완료 되었습니다.").then(() => {
                            setSearchDto((prev) => ({
                                ...prev,
                                cnsltSttsCd: "201"
                            }));
                            getSimpleDetail();
                            console.log("se :", searchDto);
                        });

                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {

            }
        });
    };




    return (
        <div id="container" className="container mypage_consultant view">
            <div className="inner">
                <CommonSubMenu/>

                <div className="inner2" data-aos="fade-up" data-aos-duration="1500">
                    <div className="profileWrap">
                        <div className="profileBox">
                            <figure className="imgBox">
                                <img src={cnsltProfileFile
                                    ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                    : ""}
                                     alt="profile image"/>
                            </figure>
                            <div className="textBox">
                                <div className="departBox cate4">
                                    <div className="icon"></div>
                                    <p className="text">{comCdList.find(item => item.comCd === String(consulttUser.cnsltFld))?.comCdNm || ""}</p>
                                </div>
                                <div className="nameBox">
                                    <strong className="name">{consulttUserName.kornFlnm || ""}</strong>
                                    <p className="company">{consulttUser.jbpsNm}({consulttUser.ogdpNm})</p>
                                </div>
                                <p className="intro">
                                    {consulttUser.rmrkCn?.match(/.{1,50}/g)?.map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br/>
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="chatWrap">
                        <div className="titleWrap type2">
                            {searchDto.cnsltSttsCd === "201" && (
                                <div className="state complete">
                                    <p>처리완료</p>
                                </div>
                            )}
                            <p className="tt1">컨설팅의뢰</p>
                        </div>
                        {cnsltDsctnList}
                    </div>
                    <div className="buttonBox">
                        {simpleDetail && (
                            <>
                                {/* 취소상태일때 */}
                                {searchDto.cnsltSttsCd === "999" ? (
                                    <>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                                 style={{width: '100%', marginLeft: '40%'}}
                                                 state={{
                                                     menuSn: location.state?.menuSn,
                                                     menuNmPath: location.state?.menuNmPath
                                                 }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                )   : searchDto.cnsltSttsCd === "13" && sessionUser.mbrType === 2 ? (
                                    //상태가 매칭대기이며 사용자가 컨설턴트인 경우
                                    <>
                                        <button type="button" className="clickBtn writeBtn"
                                                style={{width: '100%',marginLeft : '3%'}}
                                                onClick={()=>acceptCnslt(searchDto.cnsltAplySn)}
                                        >
                                            <span>수락</span>
                                        </button>
                                        <button type="button" className="clickBtn gray"
                                                style={{width: '100%', marginLeft : '3%'}}
                                                onClick={()=>cancleCnsltRequest(searchDto.cnsltAplySn)}
                                        >
                                            <span>거절</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                                 style={{width: '100%', marginLeft: '3%'}}
                                                 state={{
                                                     menuSn: location.state?.menuSn,
                                                     menuNmPath: location.state?.menuNmPath
                                                 }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : cnsltDsctnList.length === 1 && latestCreator === sessionUser.userSn ? (
                                    <>
                                        <button type="button" className="clickBtn writeBtn"
                                                onClick={() => handleCancleClick(searchDto.cnsltAplySn)}
                                                style={{marginLeft : '20%'}}>
                                            <span>취소</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                                 style={{width: '100%'}}
                                                 state={{
                                                     menuSn: location.state?.menuSn,
                                                     menuNmPath: location.state?.menuNmPath
                                                 }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : searchDto.cnsltSttsCd === "201" ? (
                                    // 처리 완료 상태일 경우
                                    <>
                                        <button type="button" className="clickBtn surveyBtn"
                                                onClick={() => {
                                                    setCnsltAplySn(searchDto.cnsltAplySn);
                                                    ComScript.openModal("surveyModal");
                                                }}
                                                style={{width: '100%', marginLeft: '20%'}}>
                                            <div className="icon"></div>
                                            <span>만족도 조사</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                                 style={{width: '100%'}}
                                                 state={{
                                                     menuSn: location.state?.menuSn,
                                                     menuNmPath: location.state?.menuNmPath
                                                 }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : latestCreator === sessionUser.userSn ? (
                                    // 사용자가 로그인했을 때 마지막 작성자가 사용자일 경우
                                    <>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                                 style={{width: '100%', marginLeft: '40%'}}
                                                 state={{
                                                     menuSn: location.state?.menuSn,
                                                     menuNmPath: location.state?.menuNmPath
                                                 }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : latestCreator !== sessionUser.userSn && sessionUser.mbrType !== 2 ? (
                                    // 사용자가 로그인했을 때 마지막 작성자가 컨설턴트일 경우
                                    <>
                                        <button type="button" className="clickBtn writeBtn"
                                                style={{marginLeft: "7%"}}
                                                onClick={() => {
                                                    ComScript.openModal("writeModal");
                                                }}>
                                            <span>답변 등록</span>
                                        </button>
                                        <button type="button" className="clickBtn completeBtn"
                                                onClick={() => handleComClick(searchDto.cnsltAplySn)}>
                                            <span>처리완료</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                                 style={{width: '100%'}}
                                                 state={{
                                                     menuSn: location.state?.menuSn,
                                                     menuNmPath: location.state?.menuNmPath
                                                 }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : sessionUser.mbrType === 2 ? (
                                    // 컨설턴트가 로그인했을 때 마지막 작성자가 사용자일 경우
                                    <>
                                        <button type="button" className="clickBtn writeBtn"
                                                style={{marginLeft: "25%"}}
                                                onClick={() => {
                                                    ComScript.openModal("writeModal");
                                                }}>
                                            <span>답변 등록</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                                 style={{width: '100%'}}
                                                 state={{
                                                     menuSn: location.state?.menuSn,
                                                     menuNmPath: location.state?.menuNmPath
                                                 }}>
                                            <button type="button" className="clickBtn listBtn">
                                                <div className="icon"></div>
                                                목록
                                            </button>
                                        </NavLink>
                                    </>
                                ) : (
                                    // 컨설턴트가 로그인했을 때 마지막 작성자가 컨설턴트일 경우
                                    <NavLink to={URL.MEMBER_MYPAGE_CONSULTING}
                                             style={{width: '100%'}}
                                             state={{
                                                 menuSn: location.state?.menuSn,
                                                 menuNmPath: location.state?.menuNmPath
                                             }}>
                                        <button type="button" className="clickBtn listBtn">
                                            <div className="icon"></div>
                                            목록
                                        </button>
                                    </NavLink>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="writeModal modalCon diffiModal">
                <div className="bg" onClick={() => ComScript.closeModal("writeModal")}></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="close" onClick={() => ComScript.closeModal("writeModal")}>
                            <div className="icon"></div>
                        </div>
                        <div className="titleWrap type2">
                            <p className="tt1">질문 등록</p>
                        </div>
                        <form className="diffiBox">
                            <div className="cont">
                                <ul className="listBox">
                                    <li className="inputBox type2">
                                        <label htmlFor="question_text" className="tt1 essential">질문내용</label>
                                        <div className="input">
                                            <CommonEditor
                                                value={simplePopupModify.cn}
                                                onChange={handleEditorChange}
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
                            <button type="button" className="clickBtn black writeBtn" onClick={handleSave}>
                                <span>등록</span></button>
                        </form>
                    </div>
                </div>
            </div>
            <SatisModal cnsltAplySn={cnsltAplySn} onSave={() => {
                getSimpleDetail();}}/>
            <SimpleModal data={modalData} onSave={() => {
                getSimpleDetail();}}/>
        </div>
    );
}


export default MemberMyPageConsultingDetail;