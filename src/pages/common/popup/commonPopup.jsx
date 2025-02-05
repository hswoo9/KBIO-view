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

    const handleClose = () => {
        window.close();
    };

    const handleCloseForToday = () => {
        const expireTime = Date.now() + 24 * 60 * 60 * 1000;
        // const expireTime = Date.now() + 60 * 1000;
        localStorage.setItem(bnrPopup.bnrPopupSn, expireTime);
        window.close();
    };

    const clickHandler = (bnrPopupUrlAddr) => {
        window.open(bnrPopupUrlAddr);
    }

    useEffect(() => {
        getPopupFile();
    }, []);
    return (
        <>
            <img
                src={`http://133.186.250.158${bnrPopup.tblComFile.atchFilePathNm}/${bnrPopup.tblComFile.strgFileNm}.${bnrPopup.tblComFile.atchFileExtnNm}`}
                alt={bnrPopup.tblComFile.atchFileNm}
                onClick={(e) => {
                    clickHandler(`${bnrPopup.bnrPopupUrlAddr}`)
                }}
            />
            <div style={{textAlign: "right"}}>
                <button onClick={handleCloseForToday}>오늘 하루 열지 않음</button>
                <button onClick={handleClose}>닫기</button>
            </div>
        </>
    );
}

export default CommonPopup;
