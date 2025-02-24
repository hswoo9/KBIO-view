import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as EgovNet from "@/api/egovFetch";
import * as ComScript from "@/components/CommonScript";

const MainFooterInfo = () => {

    const [searchCondition, setSearchCondition] = useState({});
    const [dataList, setDataList] = useState([]);
    const [viewData, setViewData] = useState({});

    const selectHandle = (e) => {
        const selectedValue = e.target.value;
        dataList.forEach(function(item, index){
            if(item.utztnTrmsSn == selectedValue){
                setViewData(item);
            }
        })
    }

    const makerOption = (data) => {
        let resultList = [];
        data.forEach(function(item, index){
            resultList.push(
                <option value={item.utztnTrmsSn} key={item.utztnTrmsSn}>
                    {item.utztnTrmsTtl}
                </option>
            );
        });
        return resultList;
    }

    const getDataList = useCallback(
        (searchCondition) => {
            const requestURL = "/utztnApi/getPrivacyPolicyListNotPaging.do";
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
                    let resultList = [];
                    let indexNumber = 0;
                    resp.result.dataList.forEach(function (item, index) {
                        if(item.utztnTrmsKnd == "1"){
                            if(indexNumber === 0){
                                setViewData(item);
                            }
                            resultList.push(item);
                            indexNumber++;
                        }
                    });
                    setDataList(resultList);
                },
                function (resp) {

                }
            )
        },
        [dataList, searchCondition]
    );

    useEffect(() => {
        getDataList(searchCondition);
    }, []);

    return (
        <div className="privacyPolicyModal modalCon">
            <div className="bg" onClick={() => ComScript.closeModal("privacyPolicyModal")}></div>
            <div className="m-inner">
                <div className="boxWrap">
                    <div className="close" onClick={() => ComScript.closeModal("privacyPolicyModal")}>
                        <div className="icon"></div>
                    </div>
                    <div className="titleWrap type2">
                        <p className="tt1 fontColorCustom">개인정보처리방침</p>
                    </div>
                    <form className="diffiBox">
                        <div className="cont">
                            <ul className="listBox">
                                <li className="inputBox type2">
                                    <label htmlFor="request_text" className="">의뢰내용</label>
                                    <div className="input fontColorCustom" dangerouslySetInnerHTML={{__html: viewData.utztnTrmsCn}}>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <ul className="listBox">
                            <p className="tt1 fontColorCustom">개정이력</p>
                            <select
                                id="cnsltFld"
                                className="selectGroup"
                                defaultValue={viewData.utztnTrmsSn || ""}
                                onChange={selectHandle}
                            >
                                {makerOption(dataList)}
                            </select>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MainFooterInfo;
