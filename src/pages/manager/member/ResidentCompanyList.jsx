import React, {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import 'moment/locale/ko';

import EgovPaging from "@/components/EgovPaging";

import BtTable from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.css';
import moment from "moment/moment.js";

function ResidentCompanyList(){

    const [searchDto, setSearchDto] = useState(
        location.state?.searchDto || {
            pageIndex: 1,
            brno: "",
            mvnEntNm : "",
            rpsvNm : "",
        }
    );

    const [paginationInfo, setPaginationInfo] = useState({});
    const brnoRef = useRef();
    const mvnEntNmRef = useRef();
    const rpsvNmRef = useRef();
    const [rcList, setAuthorityList] = useState([]);

    const getRcList = useCallback(
        (searchDto)=>{


            const rcListUrl = "/mvnEntApi/getMvnEntList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchDto)
            };
            EgovNet.requestFetch(
                rcListUrl,
                requestOptions,
                (resp) => {
                    setPaginationInfo(resp.paginationInfo);
                    let dataList = [];
                    rcList.push(
                        <tr>
                            <td colSpan="5">검색된 결과가 없습니다.</td>
                        </tr>
                    );

                    resp.result.rcList.forEach(function (item,index){
                        if(index === 0) dataList = [];

                        dataList.push(
                            <tr key={item.mvnEntSn}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={URL.RESIDENT_COMPANY_MODIFY}
                                          state={{ mode: CODE.MODE_MODIFY, mvnEntSn: item.mvnEntSn }}>
                                        {item.mvnEntNm}
                                    </Link>

                                </td>
                                <td>{item.rpsvNm}</td>
                                <td>{formatBrno(item.brno)}</td>
                                <td>{moment(item.frstCrtDt).format('YYYY-MM-DD')}</td>
                            </tr>
                        );
                    });
                    setAuthorityList(dataList);

                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        [rcList, searchDto]
    );

    useEffect(()=>{
       getRcList(searchDto);
    }, []);

    function formatBrno(brno) {
        if (!brno || brno.length < 10) {
            console.error("Invalid brno length or undefined value.");
            return brno; // 값이 유효하지 않을 경우 원래 값을 반환
        }

        return `${brno.slice(0, 3)}-${brno.slice(3, 5)}-${brno.slice(5)}`;
    }

    return(

        <div className="board_list BRD006">
        <BtTable
            striped bordered hover size="sm"
            className="btTable"
        >
            <colgroup>
                <col width="20"/>
                <col width="100"/>
                <col width="50"/>
                <col width="80"/>
                <col width="50"/>
            </colgroup>
            <thead>
            <tr>
                <th>번호</th>
                <th>기업이름</th>
                <th>대표자</th>
                <th>사업자등록번호</th>
                <th>등록일</th>
            </tr>
            </thead>
            <tbody>
            {rcList}
            </tbody>
        </BtTable>

    <div className="board_bot">
        <EgovPaging
            pagination={paginationInfo}
            moveToPage={(passedPage) => {
                getRcList({
                    ...searchDto,
                    pageIndex: passedPage
                });
            }}
        />
    </div>
        </div>

    );
}

export default ResidentCompanyList;