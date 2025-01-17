import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavTemplates";

//alert
import Swal from 'sweetalert2';
import {getSessionItem} from "../../utils/storage.js";

function Templates(props) {

  const fetchTemplates = async () => {
    const sessionUser = getSessionItem("loginUser");
    const response = await axios.post(
        "http://localhost:8080/menuApi/setMenuAuthGroupUserDel.do",
        JSON.stringify({
          authrtGroupUserSns : "14,15"
        }),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
    );


    console.log("response:", response);
    console.log("response.data:", response.data);
  }

  //첨부파일 관련
  const [selectedFiles, setSelectedFiles] = useState({});
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  }

  const fileUploadTemplates = async () => {
    const formData = new FormData();
    selectedFiles.map((file) => {
      formData.append("files", file);
    });

    for (let [key, value] of formData.entries()) {
      console.log(key, value); // FormData 내용 확인
    }

    const requestOptions = {
      method: "POST",
      body: formData
    };

    EgovNet.requestFetch(`/fileCheck`, requestOptions, function (resp) {
      console.log("--------------------------------------------");
      console.log(resp);
      console.log("--------------------------------------------");
      if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
        console.log(resp);
      } else {
        console.log("ERROR");
        console.log(resp);
      }
    });
  }

  const location = useLocation();

  const swalNormal = () => {
    Swal.fire('문구');
  };

  const Location = React.memo(function Location() {
    return (
        <div className="location">
          <ul>
            <li>
              <Link to={URL.MAIN} className="home">
                Home
              </Link>
            </li>
            <li>
              <Link to={URL.TEMPLATES}>공통양식</Link>
            </li>
            <li>공통양식</li>
          </ul>
        </div>
    );
  });


  return (
    <div className="container">
      <div className="c_wrap">
        {/* <!-- Location --> */}
        <Location/>
        {/* <!--// Location --> */}

        <div className="layout">
          {/* <!-- Navigation --> */}
          <EgovLeftNav/>
          {/* <!--// Navigation --> */}

          <button onClick={swalNormal}>기본알럿</button>
          <br/>
          <button onClick={fetchTemplates}>api</button>
          <br/>
          <input type={"file"} name={"files"} onChange={handleFileChange} multiple={"multiple"}/>
          <button onClick={fileUploadTemplates}>업로드</button>
        </div>
      </div>
    </div>
  )
      ;
}

export default Templates;
