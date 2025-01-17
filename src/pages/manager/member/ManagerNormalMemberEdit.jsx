import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMember";
import EgovRadioButtonGroup from "@/components/EgovRadioButtonGroup";
import Swal from "sweetalert2";

function setNormalMember(props) {
    console.group("ManagerNormalMemberEdit");
    console.log("[Start] ManagerNormalMemberEdit------------------------------");
    console.log("ManagerNormalMemberEdit [props] : ", props);

    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);

    const mberSttusRadioGroup = [
        { value: "P", label: "가능" },
        { value: "A", label: "대기" },
        { value: "D", label: "탈퇴" },
    ];
    const [searchDto, setSearchDto] = useState({userSn : location.state?.userSn});

    const [modeInfo, setModeInfo] = useState({ mode: props.mode });
    const [memberDetail, setMemberDetail] = useState({});

    const initMode = () => {
        setModeInfo({
            ...modeInfo,
            modeTitle: modeInfo.mode === CODE.MODE_CREATE ? "회원 등록" : "회원 수정",
            editURL: `/memberApi/setNormalMember`,
        });

        getNormalMember(searchDto);
    };

    const getNormalMember = (serachDto) => {
        if (modeInfo.mode === CODE.MODE_CREATE) {
            // 조회/등록이면 초기값 지정
            setMemberDetail({
                tmplatId: "TMPLAT_MEMBER_DEFAULT", //Template 고정
            });
            return;
        }
        const getNormalMemberURL = `/memberApi/getNormalMember`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };

        EgovNet.requestFetch(getNormalMemberURL, requestOptions, function (resp) {
            if (modeInfo.mode === CODE.MODE_MODIFY) {
                setMemberDetail(resp.result.member);
                console.log(memberDetail)
            }
        });
    };

    const checkIdDplct = () => {
        return new Promise((resolve) => {
            let checkId = memberDetail["emplyrId"];
            if (checkId === null || checkId === undefined) {
                alert("회원ID를 입력해 주세요");
                return false;
            }
            const regex = /^[a-zA-Z0-9]{6,12}$/;
            if (!regex.test(checkId)) {
                alert("회원ID는 6~12자의 영문 대소문자와 숫자만 사용 가능합니다.");
                return false;
            }
            const checkIdURL = `/memberApi/checkMemberId.do`;
            const reqOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    memberId : checkId
                })
            };
            EgovNet.requestFetch(checkIdURL, reqOptions, function (resp) {
                if (resp.resultCode === 400 && resp.result.usedCnt > 0
                ) {
                    setMemberDetail({
                        ...memberDetail,
                        checkIdResult: "중복된 아이디입니다.",
                        checkIdResultColor: "red",
                        mberId: checkId,
                    });
                    resolve(resp.result.usedCnt);
                } else {
                    setMemberDetail({
                        ...memberDetail,
                        checkIdResult: "사용 가능한 아이디입니다.",
                        checkIdResultColor: "green",
                        mberId: checkId,
                    });
                    resolve(0);
                }
            });
        });
    };

    const setNormalMember = () => {
        let requestOptions = {};
        const formData = new FormData();

        if (memberDetail.checkIdResultColor === "red") {
            alert("아이디 중복이 확인되었습니다. 다른 아이디를 사용해주세요.");
            return;
        }

        if (!memberDetail.emplyrId) {
            alert("회원ID은 필수 값입니다.");
            return;
        }
            /*if (!memberDetail.mbtlnum) {
                alert("휴대전화는 필수 값입니다.");
                return;
            }

            if (!memberDetail.userType) {
                alert("회원 유형은 필수 값입니다.");
                return;
            }*/


            for (let key in memberDetail) {
                formData.append(key, memberDetail[key]);
            }

            Swal.fire({
                title: "저장하시겠습니까?",
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: "저장",
                cancelButtonText: "취소",
            }).then((result) => {
                if (result.isConfirmed) {
                    requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify(memberDetail),
                    };

                    EgovNet.requestFetch(modeInfo.editURL, requestOptions, (resp) => {
                        if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                            Swal.fire("등록되었습니다.");
                            navigate(URL.MANAGER_NORMAL_MEMBER);
                        } else {
                            navigate(
                                { pathname: URL.ERROR },
                                { state: { msg: resp.resultMessage } }
                            );
                        }
                    });
                } else {
                    // 취소
                }
        });
    };

    const setNormalMemberDel = (userSn) => {
        const setNormalMemberUrl = "/memberApi/setNormalMemberDel";

        Swal.fire({
            title: "삭제하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        ...memberDetail,
                        zip: "N",
                        userSn: userSn
                    }),
                };

                EgovNet.requestFetch(setNormalMemberUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("삭제되었습니다.");
                        navigate(URL.MANAGER_NORMAL_MEMBER);
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
    };

    const getSelectedLabel = (objArray, findLabel = "") => {
        let foundValueLabelObj = objArray.find((o) => o["value"] === findLabel);
        return foundValueLabelObj["label"];
    };

    useEffect(() => {
        initMode();
    }, []);

    console.log("------------------------------EgovAdminMemberEdit [End]");
    console.groupEnd("EgovAdminMemberEdit");

    return (
        <div className="container">
            <div className="c_wrap">
                {/* <!-- Location --> */}
                <div className="location">
                    <ul>
                        <li>
                            <Link to={URL.MAIN} className="home">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to={URL.MANAGER_NORMAL_MEMBER}>회원관리</Link>
                        </li>
                        <li>{modeInfo.mode === CODE.MODE_CREATE ? "회원 생성" : "회원 수정"}</li>
                    </ul>
                </div>
                {/* <!--// Location --> */}

                <div className="layout">
                    {/* <!-- Navigation --> */}
                    <EgovLeftNav></EgovLeftNav>
                    {/* <!--// Navigation --> */}

                    <div className="contents MEMBER_CREATE_REG" id="contents">
                        <h2 className="tit_2">{modeInfo.mode === CODE.MODE_CREATE ? "회원 생성" : "회원 수정"}</h2>

                        <div className="board_view2">
                            <dl>
                                <dt>
                                    <label htmlFor="emplyrId">회원ID</label>
                                    <span className="req">필수</span>
                                </dt>
                                <dd>
                                    <input
                                        className="f_input2 w_full"
                                        type="text"
                                        name="emplyrId"
                                        title=""
                                        id="emplyrId"
                                        placeholder=""
                                        defaultValue={memberDetail.emplyrId}
                                        onChange={(e) =>
                                            setMemberDetail({
                                                ...memberDetail,
                                                emplyrId: e.target.value,
                                            })
                                        }
                                        ref={(el) => (checkRef.current[0] = el)}
                                        readOnly={modeInfo.mode === CODE.MODE_MODIFY}
                                        style={{ width: '300px', marginRight: '5px' }}
                                    />
                                    {modeInfo.mode === CODE.MODE_CREATE && (
                                        <button
                                            className="btn btn_skyblue_h46"
                                            onClick={() => {
                                                checkIdDplct();
                                            }}
                                        >
                                            중복확인
                                        </button>
                                    )}
                                    {memberDetail.checkIdResult && (
                                        <div
                                            style={{
                                                marginTop: '10px',
                                                color: memberDetail.checkIdResultColor,
                                                fontSize: '16px',
                                            }}
                                        >
                                            {memberDetail.checkIdResult}
                                        </div>
                                    )}
                                </dd>
                            </dl>
                            <dl>
                                <dt>
                                    <label htmlFor="password">회원암호</label>
                                    <span className="req">필수</span>
                                </dt>
                                <dd>
                                    <input
                                        className="f_input2 w_full"
                                        type="password"
                                        name="password"
                                        title=""
                                        id="password"
                                        placeholder=""
                                        defaultValue={memberDetail.password}
                                        onChange={(e) =>
                                            setMemberDetail({
                                                ...memberDetail,
                                                password: e.target.value,
                                            })
                                        }
                                        ref={(el) => (checkRef.current[1] = el)}
                                        required
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>
                                    <label htmlFor="bbsNm">회원명</label>
                                    <span className="req">필수</span>
                                </dt>
                                <dd>
                                    <input
                                        className="f_input2 w_full"
                                        type="text"
                                        name="mberNm"
                                        title=""
                                        id="mberNm"
                                        placeholder=""
                                        defaultValue={memberDetail.userNm}
                                        onChange={(e) =>
                                            setMemberDetail({
                                                ...memberDetail,
                                                userNm: e.target.value,
                                            })
                                        }
                                        ref={(el) => (checkRef.current[2] = el)}
                                        readOnly={modeInfo.mode === CODE.MODE_MODIFY}
                                    />
                                </dd>
                            </dl>
                            <dl>
                                <dt>
                                    회원 권한<span className="req">필수</span>
                                </dt>
                                <dd>
                                    <label className="f_select w_200" htmlFor="groupId">
                                        <select
                                            id="groupId"
                                            name="groupId"
                                            title="회원권한유형선택"
                                            onChange={(e) =>
                                                setMemberDetail({
                                                    ...memberDetail,
                                                    groupId: e.target.value,
                                                })
                                            }
                                            value={memberDetail.groupId}
                                        >
                                            {/* Options can be added here */}
                                        </select>
                                    </label>
                                </dd>
                            </dl>

                            {/* <!-- 버튼영역 --> */}
                            <div className="board_btn_area">
                                <div className="left_col btn1">
                                    <button
                                        className="btn btn_skyblue_h46 w_100"
                                        onClick={() => setNormalMember()}
                                    >
                                        저장
                                    </button>
                                    {modeInfo.mode === CODE.MODE_MODIFY && (
                                        <button
                                            className="btn btn_skyblue_h46 w_100"
                                            onClick={() => {
                                                setNormalMemberDel(memberDetail.userSn);
                                            }}
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>

                                <div className="right_col btn1">
                                    <Link
                                        to={URL.MANAGER_NORMAL_MEMBER}
                                        className="btn btn_blue_h46 w_100"
                                    >
                                        목록
                                    </Link>
                                </div>
                            </div>
                            {/* <!--// 버튼영역 --> */}
                        </div>

                        {/* <!--// 본문 --> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default setNormalMember;
