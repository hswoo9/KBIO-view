import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagerLeftNew from "@/components/manager/ManagerLeftHomepage";

const ManagerPrivacyPolicyEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [privacyPolicyDetail, setPrivacyPolicyDetail] = useState({
        policyTitle: '',
        policyContent: '',
        useYn: 'Y',
    });

    useEffect(() => {
        // 개인정보 처리 방침 데이터 가져오기 (백엔드 구현 전 UI만 구성)
        // getPrivacyPolicyData();
    }, []);

    const handleSave = () => {
        // 저장 버튼 클릭 시 처리 (백엔드 구현 전 UI만 구성)
        console.log("저장 버튼 클릭");
    };

    return (
        <div id="container" className="container layout cms">
            <ManagerLeftNew />
            <h2 className="pageTitle"><p>개인정보 처리 방침 수정</p></h2>
            <div className="contBox infoWrap customContBox">
                <ul className="inputWrap">
                    <li className="inputBox type1 width1">
                        <label className="title essential" htmlFor="policyTitle"><small>제목</small></label>
                        <div className="input">
                            <input type="text"
                                   id="policyTitle"
                                   value={privacyPolicyDetail.policyTitle || ""}
                                   onChange={(e) => setPrivacyPolicyDetail({ ...privacyPolicyDetail, policyTitle: e.target.value })}
                                   required
                            />
                        </div>
                    </li>
                    <li className="inputBox type1 width3">
                        <label className="title" htmlFor="policyContent"><small>내용</small></label>
                        <div className="input">
                            <textarea
                                id="policyContent"
                                value={privacyPolicyDetail.policyContent || ""}
                                onChange={(e) => setPrivacyPolicyDetail({ ...privacyPolicyDetail, policyContent: e.target.value })}
                            />
                        </div>
                    </li>
                    <li className="toggleBox width3">
                        <div className="box">
                            <p className="title essential">사용여부</p>
                            <div className="toggleSwithWrap">
                                <input type="checkbox"
                                       id="useYn"
                                       checked={privacyPolicyDetail.useYn === "Y"}
                                       onChange={(e) => setPrivacyPolicyDetail({ ...privacyPolicyDetail, useYn: e.target.checked ? "Y" : "N" })}
                                />
                                <label htmlFor="useYn" className="toggleSwitch">
                                    <span className="toggleButton"></span>
                                </label>
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="buttonBox">
                    <button type="button" className="clickBtn point" onClick={handleSave}><span>저장</span></button>
                    <button type="button" className="clickBtn gray" onClick={() => navigate(URL.MANAGER_PRIVACY_POLICY_LIST)}><span>목록</span></button>
                </div>
            </div>
        </div>
    );
};

export default ManagerPrivacyPolicyEdit; 