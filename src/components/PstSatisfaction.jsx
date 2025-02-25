import React, {useState, useEffect, useCallback} from "react";
import { useDropzone } from 'react-dropzone';
import Swal from "sweetalert2";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import * as ComScript from "@/components/CommonScript";
import { getComCdList } from "@/components/CommonComponents";
import CommonEditor from "@/components/CommonEditor";



const PstSatisfaction = ({data}) => {


    const [pstEvlData, setPstEvlData] = useState({});

    const [searchCondition, setSearchCondition] = useState({
        pstSn: data,
    });



    useEffect(() => {
        getPstEvl(searchCondition);
    }, [searchCondition.pstSn]);

    useEffect(() => {
        setSearchCondition({
            ...searchCondition,
            pstSn: data
        });
    }, [data]);


    const [evalComCdList, setEvalComCdList] = useState([]);
    useEffect(() => {
    }, [evalComCdList]);

    const getEvalComCdListToHtml = (dataList) => {
        let htmlData = [];
        if(dataList != null && dataList.length > 0){
            dataList.forEach(function(item, index) {
                htmlData.push(
                    <th className="th1" key={item.comCdSn}><p>{item.comCdNm}</p></th>
                )
            });
        }
        return htmlData;
    }

    const getPstEvl = useCallback(
        (searchCondition) => {
            const requestURL = "/pstApi/getPstEvlList.do";
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(searchCondition)
            };
            EgovNet.requestFetch(
                requestURL,
                requestOptions,
                (resp) => {
                    console.log(searchCondition);
                    console.log(resp);
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        if(resp.result.pstEvlList != null){
                            let ds = {};
                            let impvOpnnCnList = [];
                            let countHtml = [];
                            let pstEvlList = resp.result.pstEvlList;
                            if(evalComCdList != null && evalComCdList.length > 0){
                                evalComCdList.forEach(function(item, index){
                                    let count = 0;

                                    pstEvlList.forEach(function(subItem, subIndex){
                                        if(item.comCdSn == subItem.comCdSn){
                                            count++;
                                        }

                                    });
                                    countHtml.push(
                                        <td key={item.comCdSn}><p>{count}</p></td>
                                    )
                                });

                                pstEvlList.forEach(function(item, index){
                                    impvOpnnCnList.push(
                                        <tr key={item.pstEvlSn}>
                                            <td><p>{index+1}</p></td>
                                            <td><p>{item.impvOpnnCn}</p></td>
                                        </tr>
                                    )
                                });
                                if(impvOpnnCnList.length < 1){
                                    impvOpnnCnList.push(
                                        <tr key="noData">
                                            <td><p></p></td>
                                            <td><p>등록된 의견이 없습니다.</p></td>
                                        </tr>
                                    )
                                }
                                ds.countHtml = countHtml;
                                ds.impvOpnnCnList = impvOpnnCnList;
                            }
                            setPstEvlData(ds);
                        }
                    } else {
                    }
                }
            )
        },
        [pstEvlData, searchCondition]
    );


    useEffect(() => {
        getComCdList(2).then((ds) => {
            setEvalComCdList(ds);
        });
    }, []);

    return (
        <div className="programModal modalCon">
            <div className="bg" onClick={() => ComScript.closeModal("programModal")}></div>
            <div className="m-inner">
                <div className="boxWrap">
                    <div className="top">
                        <h2 className="title">만족도</h2>
                        <div className="close" onClick={() => ComScript.closeModal("programModal")}>
                            <div className="icon"></div>
                        </div>
                    </div>
                    <div className="box">
                        <div className="tableBox type1">
                            <table>
                                <caption>만족도</caption>
                                <colgroup>
                                    <col width="20%"/>
                                    <col width="20%"/>
                                    <col width="15%"/>
                                    <col width="20%"/>
                                    <col width="25%"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    {getEvalComCdListToHtml(evalComCdList)}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {pstEvlData.countHtml != null && (
                                        pstEvlData.countHtml
                                    )}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="tableBox type1">
                            <table>
                                <caption>만족도의견</caption>
                                <thead>
                                <tr>
                                    <th className="th1"><p>번호</p></th>
                                    <th className="th2"><p>의견</p></th>
                                </tr>
                                </thead>
                                <tbody>
                                {pstEvlData.impvOpnnCnList != null && (
                                    pstEvlData.impvOpnnCnList
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="pageWrap">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PstSatisfaction;
