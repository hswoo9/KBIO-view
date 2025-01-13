import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import * as EgovNet from "@/api/egovFetch";
import URL from "@/constants/url";
import CODE from "@/constants/code";

import { default as EgovLeftNav } from "@/components/leftmenu/ManagerLeftMenu";

import CheckboxTree from 'react-checkbox-tree';
import '@/css/ReactCheckBoxTree.css';

function Index(props) {

    const nodes = [
        {
            value: "1",
            label: "1번",
            children: [
                {
                    value: "11",
                    label: "1-1번"
                }, {
                    value: "12",
                    label: "1-2번"
                }
            ]
        }, {
            value: "2",
            label: "2번",
            children: [
                {
                    value: "22",
                    label: "2-1번"
                }
            ]
        }, {
            value: "3",
            label: "3번",
            children: [
                {
                    value: "33",
                    label: "3-1번"
                }
            ]
        }
    ];
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState(['Documents']);

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };


  const location = useLocation();
    
  const Location = React.memo(function Location() {
    return (
        <div className="location">
            <ul>
                <li>
                    <Link to={URL.MANAGER} className="home">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to={URL.MANAGER_MENU_MANAGEMENT}>메뉴관리</Link>
                </li>
                <li>메뉴관리</li>
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
          {/* <!--// Navigation --> */}
            <EgovLeftNav/>

            <CheckboxTree
                nodes={nodes}
                checked={checked}
                expanded={expanded}
                nodes={nodes}
                onCheck={onCheck}
                onExpand={onExpand}
            >
            </CheckboxTree>
        </div>
      </div>
    </div>
  )
}



export default Index;
