import React, {useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";

const TotalSearch = () => {
    const navigate = useNavigate();
    const kwdRef = useRef();
    const [searchCondition, setSearchCondition] = useState({});
    const handleNext = () => {
        navigate(URL.MAIN);
    };

    const [menuIndex, setMenuIndex] = useState({ menu : 0});
    const tabMenuList = {
        0: 0,
        1: 1,
        2: 2,
    };

    const changeMenu = (menuIndex) => {
        setMenuIndex({
            menu: menuIndex
        });
    }

    return (
        <div className="container withdraw join_step">
            <div className="inner">
                <div className="infoWrap customInnerDiv">
                    <ul className="inputWrap customUl">
                        <li className="inputBox type1 width1">
                            <p className="title">검색영역</p>
                            <ul className="checkWrap customCheckWrap">
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                        />
                                        <small>전체</small>
                                    </label>
                                </li>
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                        />
                                        <small>제목</small>
                                    </label>
                                </li>
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                        />
                                        <small>내용</small>
                                    </label>
                                </li>
                                <li className="checkBox">
                                    <label>
                                        <input
                                            type="radio"
                                            name="searchType"
                                        />
                                        <small>첨부파일</small>
                                    </label>
                                </li>
                            </ul>
                        </li>
                        <li className="inputBox type1 width2">
                            <p className="title">시작일</p>
                            <div className="input">
                                <input type="date"
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width2">
                            <p className="title">종료일</p>
                            <div className="input">
                                <input type="date"
                                />
                            </div>
                        </li>
                        <li className="inputBox type1 width1">
                            <p className="title">키워드</p>
                            <div className="input">
                                <input type="text"
                                       ref={kwdRef}
                                       onChange={(e) => {
                                           kwdRef.current.value = e.target.value;
                                           setSearchCondition({
                                               ...searchCondition,
                                               keyWord: e.target.value
                                           })
                                       }}
                                />
                            </div>
                            <span className="blueText">#의료 #바이오 #약품</span>
                        </li>
                    </ul>
                    <div className="buttonBox">
                        <button type="button" className="clickBtn point"><span>검색</span></button>
                    </div>
                    <div className="topBox">
                        <p className="resultText">
                            {searchCondition.keyWord || ""}에 대한 검색결과 총
                            <span className="red">0</span>
                            건이 검색되었습니다.
                        </p>
                        <div className="rightBox">

                        </div>
                    </div>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox">
                        <ul className="tabs">
                            <li className={`${menuIndex.menu === 0 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(0)}>전체
                            </li>
                            <li className={`${menuIndex.menu === 1 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(1)}>예약신청
                            </li>
                            <li className={`${menuIndex.menu === 2 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(2)}>컨설팅
                            </li>
                            <li className={`${menuIndex.menu === 3 ? 'tabActive' : ''}`}
                                onClick={() => changeMenu(3)}>커뮤니티
                            </li>
                        </ul>
                    </div>
                    <div>
                    </div>
                </div>
                <div className="contBox board type1 customContBox">
                    <div className="topBox"></div>
                    <div className="tableBox type1">
                        <table>
                            <caption>검색목록</caption>
                            <colgroup>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div className="pageWrap">
                        {/*<EgovPaging
                            pagination={paginationInfo}
                            moveToPage={(passedPage) => {
                                getBnrPopupList({
                                    ...searchCondition,
                                    pageIndex: passedPage
                                });
                            }}
                        />
                        <NavLink
                            to={{pathname: URL.MANAGER_POPUP_CREATE}}
                        >
                            <button type="button" className="writeBtn clickBtn"><span>등록</span></button>
                        </NavLink>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalSearch;
