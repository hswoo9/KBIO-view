import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";
import ManagerLeft from "@/components/manager/ManagerLeftMember";

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function MemberMessage(props) {
    const [memberList, setMemberList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        totalRecordCount: 8,   
        currentPageNo: 1,
        totalPageCount: 1,
        pageSize: 8        
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const hardcodedData = [
            { userSn: 1, mbrType: '입주기업', userId: 'user01', kornFlnm: '홍길동', mvnEntNm: '홍길동 회사', snsClsf: '네이버', phoneNumber: '010-1234-5678' },
            { userSn: 2, mbrType: '컨설턴트', userId: 'user02', kornFlnm: '이순신', mvnEntNm: '이순신 회사', snsClsf: '카카오', phoneNumber: '010-9876-5432' },
            { userSn: 3, mbrType: '입주기업', userId: 'user03', kornFlnm: '김철수', mvnEntNm: '철수 회사', snsClsf: '페이스북', phoneNumber: '010-1111-2222' },
            { userSn: 4, mbrType: '컨설턴트', userId: 'user04', kornFlnm: '박영희', mvnEntNm: '영희 회사', snsClsf: '인스타그램', phoneNumber: '010-3333-4444' },
            { userSn: 5, mbrType: '입주기업', userId: 'user05', kornFlnm: '이동훈', mvnEntNm: '동훈 회사', snsClsf: '트위터', phoneNumber: '010-5555-6666' },
            { userSn: 6, mbrType: '컨설턴트', userId: 'user06', kornFlnm: '조하나', mvnEntNm: '하나 회사', snsClsf: '카카오', phoneNumber: '010-7777-8888' },
            { userSn: 7, mbrType: '입주기업', userId: 'user07', kornFlnm: '김유진', mvnEntNm: '유진 회사', snsClsf: '네이버', phoneNumber: '010-9999-0000' },
            { userSn: 8, mbrType: '컨설턴트', userId: 'user08', kornFlnm: '최태영', mvnEntNm: '태영 회사', snsClsf: '페이스북', phoneNumber: '010-1234-9876' }
        ];

        setMemberList(hardcodedData);
    }, []);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessages = () => {
        if (!message) {
            Swal.fire('Error', 'Please enter a message to send.', 'error');
            return;
        }

        memberList.forEach((member) => {
            sendSms(member.phoneNumber, message);
        });
    };

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft />
            <div className="inner">
                <h2 className="pageTitle"><p>회원 메시지 발송</p></h2>

                <div className="cateWrap">
                    <form action="">
                        <ul className="cateList">
                            <li className="inputBox type1">
                                <p className="title">문자종류</p>
                                <div className="itemBox">
                                    <select
                                        className="selectGroup"
                                        id="searchType"
                                        name="searchType"
                                    >
                                        <option value="">전체</option>
                                        <option value="">일반문자</option>
                                        <option value="">광고문자</option>
                                    </select>
                                </div>
                            </li>
                            <li className="searchBox inputBox type1" style={{ width: "100%" }}>
                                <label className="input">
                                    <input
                                        type="text"
                                        name="searchVal"
                                    />
                                </label>
                            </li>
                        </ul>
                        <div className="rightBtn">
                            <button
                                type="button"
                                className="refreshBtn btn btn1 gray"
                            >
                                <div className="icon"></div>
                            </button>
                            <button
                                type="button"
                                className="searchBtn btn btn1 point"
                            >
                                <div className="icon"></div>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <p className="resultText">전체 : <span className="red">{paginationInfo.totalRecordCount}</span>건</p>
                    </div>
                    <div className="tableBox type1">
                        <table>
                            <caption>회원목록</caption>
                            <thead>
                            <tr>
                                <th className="th1">번호</th>
                                <th className="th1">회원분류</th>
                                <th className="th2">아이디</th>
                                <th className="th2">성명</th>
                                <th className="th2">기업명</th>
                                <th className="th1">소셜구분</th>
                                <th className="th2">전화번호</th>
                            </tr>
                            </thead>
                            <tbody>
                            {memberList.slice(0, paginationInfo.pageSize).map((item, index) => (
                                <tr key={item.userSn}>
                                    <td>{index + 1}</td>
                                    <td>{item.mbrType}</td>
                                    <td>{item.userId}</td>
                                    <td>{item.kornFlnm}</td>
                                    <td>{item.mvnEntNm}</td>
                                    <td>{item.snsClsf}</td>
                                    <td>{item.phoneNumber}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        <EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                setPaginationInfo((prev) => ({
                                    ...prev,
                                    currentPageNo: passedPage
                                }));
                            }}
                        />
                        <NavLink to={""}>
                            <button type="button" className="writeBtn clickBtn">
                                <span>문자발송</span>
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberMessage;
