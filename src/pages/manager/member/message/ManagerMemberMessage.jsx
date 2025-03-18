import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Swal from 'sweetalert2';
import EgovPaging from "@/components/EgovPaging";
import ManagerLeft from "@/components/manager/ManagerLeftMember";
import CommonEditor from "@/components/CommonEditor";
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";
import * as ComScript from "@/components/CommonScript";

function MemberMessage(props) {
    const [memberList, setMemberList] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        setPaginationInfo({
            currentPageNo: 1,
            firstPageNo: 1,
            firstPageNoOnPageList: 1,
            firstRecordIndex: 0,
            lastPageNo: 1,
            pageSize: 10,
            recordCountPerPage: 10,
            totalPageCount: 1,
            totalRecordCount: 8
        });
    }, [memberList]);



    useEffect(() => {
        const messageData = [
            { userSn: 1, title: '일반메시지1', phoneNumber: '010-1234-5678', sendDate: '2025-03-18' },
            { userSn: 2, title: '일반메시지2', phoneNumber: '010-9876-5432', sendDate: '2025-03-18' },
            { userSn: 3, title: '광고메시지1', phoneNumber: '010-1111-2222', sendDate: '2025-03-18' },
            { userSn: 4, title: '광고메시지2', phoneNumber: '010-3333-4444', sendDate: '2025-03-18' },
            { userSn: 5, title: 'K-BIO에 회원가입이 완료되었습니다.', phoneNumber: '010-5555-6666', sendDate: '2025-03-18' },
            { userSn: 6, title: '회원가입 신청이 완료되었습니다. 관리자의 승인을 기다려주세요.', phoneNumber: '010-7777-8888', sendDate: '2025-03-18' },
            { userSn: 7, title: '김유진의 메시지', phoneNumber: '010-9999-0000', sendDate: '2025-03-18' },
            { userSn: 8, title: '최태영의 메시지', phoneNumber: '010-1234-9876', sendDate: '2025-03-18' }
        ];

        setMemberList(messageData);
    }, []);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessages = () => {
        if (!message) {
            Swal.fire('메시지를 입력해주시기 바랍니다.');
            return;
        }

        memberList.forEach((member) => {
            sendSms(member.phoneNumber, message);
        });
    };

    const sendingSms = () => {
        Swal.fire("발송이 완료되었습니다.");
        ComScript.closeModal("requestModal");
    }



    return (
        <div id="container" className="container message">
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
                                <th className="th2">번호</th>
                                <th className="th4">제목</th>
                                <th className="th2">수신번호</th>
                                <th className="th2">발송일</th>
                                <th className="th1">재발송</th>
                            </tr>
                            </thead>
                            <tbody>
                            {memberList.slice(0, paginationInfo.pageSize).map((item, index) => (
                                <tr key={item.userSn}>
                                    <td>{index + 1}</td>
                                    <td>{item.title}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.sendDate}</td>
                                    <td>
                                        <button type="button"
                                        >
                                            재발송
                                        </button>
                                    </td>
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
                            <button type="button" className="writeBtn clickBtn" onClick={() => {
                                ComScript.openModal("requestModal")
                                }}>
                                <span>문자발송</span>
                            </button>
                    </div>
                </div>
            </div>
            <div className="requestModal modalCon">
                <div className="bg" onClick={() => ComScript.closeModal("requestModal")}></div>
                <div className="m-inner">
                    <div className="boxWrap">
                        <div className="close" onClick={() => ComScript.closeModal("requestModal")}>
                            <div className="icon"></div>
                        </div>
                        <div className="titleWrap type2">
                            <p className="tt1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', fontSize: '20px' }}>문자 발송</p>
                        </div>
                        <form className="diffiBox">
                            <div className="cont">
                                <ul className="listBox">
                                    <li className="inputBox type2" style={{marginBottom:"10px"}}>
                                        <label htmlFor="request_title" className="tt1 essential">발송번호</label>
                                        <div className="input">
                                            <input
                                                type="text"
                                                title="제목"
                                                id="ttl"
                                                name="ttl"
                                            />
                                        </div>
                                    </li>
                                    <li className="inputBox type2" style={{marginBottom:"10px"}}>
                                        <label htmlFor="request_title" className="tt1 essential">수신번호</label>
                                        <div className="input">
                                            <input
                                                type="text"
                                                title="제목"
                                                id="ttl"
                                                name="ttl"
                                            />
                                        </div>
                                    </li>
                                    <li className="inputBox type2 gray" style={{marginBottom:"10px", paddingTop: "2.3rem", height:"100px"}}>
                                        <label className="tt1 essential">문자종류</label>
                                        <div className="itemBox">
                                            <select
                                                id="cnsltFld"
                                                className="selectGroup"
                                            >
                                                <option value="">선택</option>
                                                <option value="1">일반문자</option>
                                                <option value="2">광고문자</option>
                                            </select>
                                        </div>
                                    </li>
                                    <li className="inputBox type2" style={{marginBottom:"10px"}}>
                                        <label htmlFor="request_title" className="tt1 essential">문자제목</label>
                                        <div className="input">
                                            <input
                                                type="text"
                                                title="제목"
                                                id="ttl"
                                                name="ttl"
                                            />
                                        </div>
                                    </li>
                                    <li className="inputBox type2">
                                        <label htmlFor="request_text" className="tt1 essential">문자내용</label>
                                        <div className="input">
                                            <CommonEditor
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <button
                                type="button"
                                className="clickBtn black writeBtn"
                                onClick={sendingSms}
                                style={{ width: '200px', display: 'block', margin: '0 auto' }}
                            >
                                <span>전송</span>
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MemberMessage;
