import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "@/css/popup.css";
import { getSessionItem } from "@/utils/storage";

function ManagerImagesPopup(props) {
    const location = useLocation();
    const imgFile = getSessionItem("imgFile");
    const imgWidth = getSessionItem("imgWidth");
    const imgHeight = getSessionItem("imgHeight");

    useEffect(() => {
        document.getElementById("templatesImgTag").style.width = imgWidth || "200px";
        document.getElementById("templatesImgTag").style.height = imgHeight || "200px";
    }, []);
    return (
        <>
            <img src={imgFile} id="templatesImgTag" />
        </>
    );
}

export default ManagerImagesPopup;
