import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import { getSessionItem } from "@/utils/storage";
import moment from "moment/moment.js";
import { fileDownLoad } from "@/components/CommonComponents";
import Swal from 'sweetalert2';
import CODE from "@/constants/code";
import CommonSubMenu from "@/components/CommonSubMenu";
import {getComCdList} from "@/components/CommonComponents";

function MemberMyPageSimpleDetail(props) {
    const sessionUser = getSessionItem("loginUser");
    const location = useLocation();
    const [cnsltDsctnList, setCnsltDsctnList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [latestCreator, setLatestCreator] = useState(null);
    const [consulttUser, setConsulttUser] = useState({});
    const [comCdList, setComCdList] = useState([]);
    const [filesByDsctnSn, setFilesByDsctnSn] = useState({});
    const [consulttUserName, setConsulttUserName] = useState({});

    const [cnsltProfileFile, setCnsltProfileFile] = useState({});
    const [cnsltCertificateFile, setCnsltCertificateFile] = useState([]);

    const [searchDto, setSearchDto] = useState({
        cnsltAplySn: location.state?.cnsltAplySn || "",
        cnsltSttsCd: location.state?.cnsltSttsCd || "",
        cnslttUserSn: location.state?.cnslttUserSn || "",
    });
    const [simpleDetail, setSimpleDetail] = useState(null);

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


    useEffect(() => {
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

    const getSimpleDetail = (searchDto) => {
        console.log(searchDto)

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
                        const showEditButton = isLatest && isOwnComment && isSn && searchDto.cnsltSttsCd !== "200" && searchDto.cnsltSttsCd !== "999"

                        dataList.push(
                            <div key={index} className="chatBox">
                                {item.dsctnSe === "0" ? (
                                    <>
                                        <div className="questionBox box">
                                          <span className="time">
                                            {moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}
                                          </span>
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
                                            {showEditButton && (
                                                <button
                                                    type="button"
                                                    className="editBtn"
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    <div className="icon"></div>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="answerBox">
                                        <figure className="profileBox">
                                                <img
                                                    src={cnsltProfileFile
                                                        ? `http://133.186.250.158${cnsltProfileFile.atchFilePathNm}/${cnsltProfileFile.strgFileNm}.${cnsltProfileFile.atchFileExtnNm}`
                                                        : ""}
                                                    alt="profile image"
                                                />
                                            </figure>
                                            <div className="rightBox">
                                                <p className="name">{consulttUserName.kornFlnm}</p>
                                                <div className="box">
                                                    <div className="chatText">
                                                        <p className="text" dangerouslySetInnerHTML={{ __html: item.cn }}></p>
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
                                                    {showEditButton && (
                                                        <button
                                                            type="button"
                                                            className="editBtn2"
                                                            onClick={() => handleEditClick(item)}
                                                        >
                                                            <div className="icon"></div>
                                                        </button>
                                                    )}
                                                    <span className="time">
                                                    {moment(item.frstCrtDt).format('YYYY.MM.DD HH:mm')}
                                                  </span>
                                                </div>
                                            </div>
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
                                cnsltSttsCd: "201"
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
        localStorage.setItem('popupData', JSON.stringify(item));
        window.open(`/popup/simple`, "_blank", "width=800,height=530");
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
                                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}
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
                                ) : cnsltDsctnList.length === 1 && latestCreator === sessionUser.userSn ? (
                                    <>
                                        <button type="button" className="clickBtn writeBtn"
                                                onClick={() => handleCancleClick(searchDto.cnsltAplySn)}>
                                            <span>취소</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}
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
                                ) : searchDto.cnsltSttsCd === "200" ? (
                                    // 처리 완료 상태일 경우
                                    <>
                                        <button type="button" className="clickBtn point"
                                                onClick={() => handleSatisClick()}>
                                            <span>만족도 조사</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}
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
                                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}
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
                                                onClick={() => handleCreateClick()}>
                                            <span>등록</span>
                                        </button>
                                        <button type="button" className="clickBtn completeBtn"
                                                onClick={() => handleComClick(searchDto.cnsltAplySn)}>
                                            <span>처리완료</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}
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
                                                style={{marginLeft: '25%'}}
                                                onClick={() => handleCreateClick()}>
                                            <span>등록</span>
                                        </button>
                                        <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}
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
                                    <NavLink to={URL.MEMBER_MYPAGE_SIMPLE}
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
        </div>
    );
}

export default MemberMyPageSimpleDetail;