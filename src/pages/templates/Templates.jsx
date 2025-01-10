import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/EgovLeftNavTemplates";

//alert
import Swal from 'sweetalert2';

function Templates(props) {
  const fetchTemplates = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        a: "aa",
        b: "bb",
        code: "200",
      }),
    };
    
    EgovNet.requestFetch(`/callback`, requestOptions, function (resp) {
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
