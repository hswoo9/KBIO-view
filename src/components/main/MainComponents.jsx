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

                reject(error);
            }
        );
    });
};

/**
 * 입주기관 리스트
 * @returns {Promise<unknown>}
 */
export const getMvnEntList = async () => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: ""
    };

    return new Promise((resolve, reject) => {
        EgovNet.requestFetch(
            "/mainApi/getMvnEntList",
            requestOptions,
            (resp) => {
                resolve(resp.result.mvnEntList);
            },
            (error) => {

                reject(error);
            }
        );
    });
};

/**
 * 게시글 조회
 * @param bbsSn
 * @returns {Promise<unknown>}
 */
export const getPstList = async (bbsSn) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({bbsSn : bbsSn})
    };

    return new Promise((resolve, reject) => {
        EgovNet.requestFetch(
            "/mainApi/getPstList.do",
            requestOptions,
            (resp) => {
                resolve({
                    bbs : resp.result.bbs,
                    pstList : resp.result.pstList,
                    authrt : resp.result.authrt
                });
            },
            (error) => {

                reject(error);
            }
        );
    });
};
