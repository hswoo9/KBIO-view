import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import ManagerLeft from "@/components/manager/ManagerLeftMember";
import EgovPaging from "@/components/EgovPaging";

import Swal from 'sweetalert2';

/* bootstrip */
import BtTable from 'react-bootstrap/Table';
import BTButton from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getSessionItem } from "@/utils/storage";

function ManagerAllMember(props) {

    return (
        <div id="container" className="container layout cms">
            <ManagerLeft/>
            <div className="inner">
                <h2 className="pageTitle"><p>전체회원</p></h2>
                <div className="cateWrap">
                </div>
                <div className="contBox board type1 customContBox">
                </div>
            </div>
            <div className="uploadModal modalCon">
            </div>
        </div>
    );
}

export default ManagerAllMember;
