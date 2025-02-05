import { useState, useEffect, useCallback, useRef } from "react";
import * as EgovNet from "@/api/egovFetch";
import {useLocation} from "react-router-dom";

function contentView(props) {
    const location = useLocation();
    const [searchDto, setSearchDto] = useState({
        menuSn : location.state.menuSn
    });
    const [menuContent, setMenuContent] = useState({});

    const getMenu = (searchDto) => {
        const menuListURL = "/menuApi/getMenu";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(searchDto)
        };
        EgovNet.requestFetch(
            menuListURL,
            requestOptions,
            (resp) => {
                if(resp.result.menu.content){
                    setMenuContent(resp.result.menu.content);
                }
            }
        )
    }

    useEffect(() => {
        getMenu(searchDto)
    }, [searchDto.menuSn]);

    return (
        <div id="container" className="container layout">
            <div className="inner">
                <div dangerouslySetInnerHTML={{__html: menuContent.contsCn || "컨텐츠가 없습니다."}}>

                </div>
            </div>
        </div>
    );
}

export default contentView;
