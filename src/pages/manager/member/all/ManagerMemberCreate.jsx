import React, {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate, NavLink, useLocation, Link} from "react-router-dom";

import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";
import axios from "axios";
import Swal from "sweetalert2";
import CommonEditor from "@/components/CommonEditor";
import {useDropzone} from "react-dropzone";
import { getSessionItem } from "@/utils/storage";
import {getComCdList} from "@/components/CommonComponents";


function ManagerMemberCreate(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
        </div>
    )
}

export default ManagerMemberCreate;