import React, {useCallback, useEffect, useRef, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "@/css/popup.css";
import * as EgovNet from "@/api/egovFetch";

function CommonPopup(props) {
    const location = useLocation();
    const [bnrPopup, setBnrPopup] = useState({tblComFile : {}});

    const params = new URLSearchParams(location.search);

    const getPopupFile = useCallback(
        () => {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    // psnTblPk : "bnrPopup_" + params.get("bnrPopupSn")
                    bnrPopupSn : params.get("bnrPopupSn")
                })
            };
            EgovNet.requestFetch(
                "/bannerPopupApi/getBnrPopup",
                requestOptions,
                (resp) => {
                    setBnrPopup(resp.result.tblBnrPopup)
                },
                function (resp) {
                    console.log("err response : ", resp);
                }
            )
        },
        []
    );

    const clickHandler = (bnrPopupUrlAddr) => {
        window.open(
            bnrPopupUrlAddr, // 여기에 원하는 URL 입력
        );
    }

    useEffect(() => {
        getPopupFile();
    }, []);
    return (
        <>
            <img
                src={`http://133.186.250.158${bnrPopup.tblComFile.atchFilePathNm}/${bnrPopup.tblComFile.strgFileNm}.${bnrPopup.tblComFile.atchFileExtnNm}`}
                id="templatesImgTag"
                alt={bnrPopup.tblComFile.atchFileNm}
                onClick={(e) => {
                    clickHandler(`${bnrPopup.bnrPopupUrlAddr}`)
                }}
            />
        </>
    );
}

export default CommonPopup;
