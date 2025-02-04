import React, {useState, useEffect, useRef, useCallback} from "react";
import $ from 'jquery';
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';
import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";
import Swal from "sweetalert2";

import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function ManagerTermsAgreementEdit(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const checkRef = useRef([]);
    const sessionUser = getSessionItem("loginUser");

    const [termsAgreementDetail, setTermsAgreementDetail] = useState({
        termsTitle: '',
        termsContent: '',
        useYn: 'Y',
    });

    const [modeInfo, setModeInfo] = useState({ mode: props.mode });


    const handleSave = () => {

        console.log("저장 버튼 클릭");
    };



    useEffect(() => {
        setModeInfo({ mode: props.mode });
    }, [props.mode]);

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew />
            <div className="inner">
                {modeInfo.mode === CODE.MODE_CREATE && (
                    <h2 className="pageTitle"><p>이용약관 등록</p></h2>
                )}

                {modeInfo.mode === CODE.MODE_MODIFY && (
                    <h2 className="pageTitle"><p>이용약관 수정</p></h2>
                )}
                <div className="contBox infoWrap customContBox">
                    <ul className="inputWrap">
                        <li className="inputBox type1 width1">
                            <label className="title essential" htmlFor="termsTitle"><small>제목</small></label>
                            <div className="input">
                                <input type="text"
                                       id="termsTitle"
                                       value={termsAgreementDetail.termsTitle || ""}
                                       onChange={(e) => setTermsAgreementDetail({ ...termsAgreementDetail, termsTitle: e.target.value })}
                                       required
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width3">
                            <label className="title" htmlFor="termsContent"><small>내용</small></label>
                            <div className="input">
                            <textarea
                                id="termsContent"
                                value={termsAgreementDetail.termsContent || ""}
                                onChange={(e) => setTermsAgreementDetail({ ...termsAgreementDetail, termsContent: e.target.value })}
                            />
                            </div>
                        </li>
                        <li className="toggleBox width3">
                            <div className="box">
                                <p className="title essential">사용여부</p>
                                <div className="toggleSwithWrap">
                                    <input type="checkbox"
                                           id="useYn"
                                           checked={termsAgreementDetail.useYn === "Y"}
                                           onChange={(e) => setTermsAgreementDetail({ ...termsAgreementDetail, useYn: e.target.checked ? "Y" : "N" })}
                                    />
                                    <label htmlFor="useYn" className="toggleSwitch">
                                        <span className="toggleButton"></span>
                                    </label>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className="buttonBox">
                        <div className="leftBox">
                            <button type="button" className="clickBtn point" onClick={""}><span>저장</span></button>
                            {modeInfo.mode === CODE.MODE_MODIFY && (
                                <button type="button" className="clickBtn gray" onClick={""}><span>삭제</span>
                                </button>
                            )}
                        </div>
                        <NavLink
                            to={URL.MANAGER_HOMEPAGE_TERMS_AGREEMENT}
                        >
                            <button type="button" className="clickBtn black"><span>목록</span></button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerTermsAgreementEdit;


