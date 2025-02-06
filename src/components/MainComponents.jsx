import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import {useNavigate} from "react-router-dom";
import URL from "@/constants/url";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import axios from "axios";
import Swal from "sweetalert2";

/**
 * 팝업조회
 * @param upperMenuSn 상위메뉴 일련번호
 * @param menuSeq 메뉴 뎁스
 * @returns {Promise<unknown>}
 * 조회 예시
 * const [menuList, setMenuList] = useState([]);
 *
 * useEffect(() => {
 *     getMenu().then((data) => {
 *         setMenuList(data);
 *     })
 * }, []);
 */
export const getBnrPopupList = async (bnrPopupKnd) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({bnrPopupKnd : bnrPopupKnd})
    };

    return new Promise((resolve, reject) => {
        EgovNet.requestFetch(
            "/mainApi/getBnrPopupList.do",
            requestOptions,
            (resp) => {
                resolve(resp.result.bnrPopupList);
            },
            (error) => {
                console.log("err response : ", error);
                reject(error);
            }
        );
    });
};