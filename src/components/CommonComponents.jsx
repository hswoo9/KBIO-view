import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import {useNavigate} from "react-router-dom";
import URL from "@/constants/url";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {useRef} from "react";

/**
 * 사용자 메뉴조회
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
export const getMenu = async (upperMenuSn, menuSeq, userSn) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            upperMenuSn : upperMenuSn,
            menuSeq : menuSeq,
            userSn : userSn
        })
    };

    return new Promise((resolve, reject) => {
        EgovNet.requestFetch(
            "/commonApi/getMenu.do",
            requestOptions,
            (resp) => {
                resolve(resp.result.menuList);
            },
            (error) => {
                console.log("err response : ", error);
                reject(error);
            }
        );
    });
};

/**
 * 사용자 left 메뉴 조회
 * @param menuSn = 현재 메뉴 일련번호
 * @returns {Promise<unknown>}
 * 조회 예시
 * const [leftMenuList, setLeftMenuList] = useState([]);
 *
 * useEffect(() => {
 *     getLeftMenu(1).then((data) => {
 *         setLeftMenuList(data);
 *     })
 * }, []);
 */
export const getLeftMenu = async (menuSn) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            menuSn : menuSn,
        })
    };

    return new Promise((resolve, reject) => {
        EgovNet.requestFetch(
            "/commonApi/getLeftMenu.do",
            requestOptions,
            (resp) => {
                resolve(resp.result.leftMenuList);
            },
            (error) => {
                console.log("err response : ", error);
                reject(error); // 에러 시 reject
            }
        );
    });
};

/**
 * 공통코드 조회
 * @param cdGroupSn = 코드그룹 일련번호
 * @returns {Promise<unknown>}
 * 조회 예시
 * const [comCdList, setComCdList] = useState([]);
 *
 * useEffect(() => {
 *     getComCdList(1, setComCdList).then((data) => {
 *         setComCdList(data);
 *     })
 * }, []);
 */
export const getComCdList = async (cdGroupSn) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ cdGroupSn: cdGroupSn })
    };

    return new Promise((resolve, reject) => {
        EgovNet.requestFetch(
            "/codeApi/getComCdList.do",
            requestOptions,
            (resp) => {
                resolve(resp.result.comCdList); // 성공 시 데이터를 resolve
            },
            (error) => {
                console.log("err response : ", error);
                reject(error); // 에러 시 reject
            }
        );
    });
};


/**
 * 파일 다운로드
 * @param atchFileSn
 * @param atchFileNm
 * @returns {Promise<void>}
 */
export const fileDownLoad = async (atchFileSn, atchFileNm, trgtTblNm, trgtSn) => {
    try {
        const response = await axios.post(`${window.location.protocol}//${window.location.hostname}:8080/commonApi/getFileDownLoad.do`, {
            atchFileSn : atchFileSn,
            trgtTblNm : trgtTblNm,
            trgtSn : trgtSn
        }, {
            responseType : 'blob'
        });

        const blob = await response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", atchFileNm);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }catch (e) {
        Swal.fire({
            title: "다운로드 오류",
            text: "관리자에게 문의해주세요.",
        });
    }
}

/**
 * 파일 압축 다운로드
 * @param psnTblSn = 소유테이블_기본키
 * @param zipFileName = 다운로드 받을 압축파일명
 * @returns {Promise<void>}
 */
export const fileZipDownLoad = async (psnTblSn, zipFileName, trgtTblNm, trgtSn) => {
    try {
        const response = await axios.post(`${window.location.protocol}//${window.location.hostname}:8080/commonApi/getFileZipDownLoad.do`, {
            psnTblSn : psnTblSn,
            zipFileName : zipFileName,
            trgtTblNm : trgtTblNm,
            trgtSn : trgtSn
        }, {
            responseType : 'blob'
        });

        const blob = await response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", zipFileName + ".zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }catch (e) {
        Swal.fire({
            title: "다운로드 오류",
            text: "관리자에게 문의해주세요.",
        });
    }
}

/**
 * 관리자 아이피 체크
 * @param navigate
 */
export const mngrAcsIpChk = (navigate) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: ""
    };
    EgovNet.requestFetch(
        "/commonApi/getMngrAcsIpChk",
        requestOptions,
        (resp) => {
            if(resp.resultCode == Number(CODE.RCV_ERROR_AUTH_IP)){
                navigate(
                    { pathname : URL.COMMON_ERROR},
                    { state : {
                            redirectPath : URL.MAIN,
                            errorCode: resp.resultCode,
                            errorMessage: resp.resultMessage,
                            errorSubMessage : "관리자에게 문의해주세요."
                        }
                    }
                );
            }
        },
        function (resp) {
            console.log("err response : ", resp);
        }
    )
}

/**
 * 엑셀 공통 다운로드 함수
 * @param exportFileName = "저장할 엑셀 파일 이름"
 * @param sheetDatas
 * 엑셀 데이터 예시
 * const sheetDatas = [
 *      {
 *          sheetName : "시트1",
 *          header : ['이름1', '나이1', '지역1'],
 *          row : [
 *              {name: '이름1', age: 28, city: '지역1'},
 *              {name: '이름2', age: 29, city: '지역2'},
 *              {name: '이름3', age: 30, city: '지역3'},
 *          ]
 *      },
 *      {
 *          sheetName : "시트2",
 *          header : ['이름2', '나이2', '지역2'],
 *          row : [
 *              {name: '이름4', age: 28, city: '지역4'},
 *              {name: '이름5', age: 29, city: '지역5'},
 *              {name: '이름6', age: 30, city: '지역6'},
 *          ]
 *      }
 * ]
 * excelExport("사람", sheetDatas).then(r => console.log("콜백함수 선택사항"));
 * @returns {Promise<void>}
 */
export const excelExport = async (exportFileName, sheetDatas) => {
    const workbook = new ExcelJS.Workbook();

    sheetDatas.forEach((sheetData, i) => {
        const worksheet = workbook.addWorksheet(sheetData.sheetName);
        worksheet.addRow(sheetData.header);
        const headerRow = worksheet.getRow(1);
        sheetData.header.forEach((header, index) => {
            if (header) {
                const cell = headerRow.getCell(index + 1);
                cell.font = { bold: true };
                cell.alignment = { horizontal: 'center' };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'b4c6e7' } };
            }
        });

        sheetData.row.forEach(item => {
            worksheet.addRow(Object.values(item));
        });

        worksheet.eachRow((row, rowIndex) => {
            row.eachCell((cell, colIndex) => {
                if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
                    cell.border = {
                        top: { style: 'thin', color: { argb: '000000' } },
                        left: { style: 'thin', color: { argb: '000000' } },
                        bottom: { style: 'thin', color: { argb: '000000' } },
                        right: { style: 'thin', color: { argb: '000000' } },
                    };

                    const currentColumn = worksheet.getColumn(colIndex);
                    const columnValue = String(cell.value);

                    if (!currentColumn.width || columnValue.length > currentColumn.width) {
                        currentColumn.width = columnValue.length + 5;
                    }
                }
            });
        });
    })


    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), exportFileName + '.xlsx');
}

/**
 * 엑셀 파일
 * @param file
 * @returns {Promise<unknown>}
 */
export const fileUpload = async (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            Swal.fire("파일을 선택해주세요.");
            return;
        }else if (!["xlsx", "xls"].includes(file.name.split(".").pop().toLowerCase())) {
            Swal.fire("엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.");
            return;
        }

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            try {
                let workbookDataList = []
                const bufferArray = e.target.result;
                const workbook = XLSX.read(bufferArray, { type: "buffer" });
                workbook.SheetNames.forEach((e, i) =>{
                    let sheetData = {}
                    const sheetName = workbook.SheetNames[i]; // 첫 번째 시트 가져오기
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }); // JSON 형태로 변환
                    sheetData["sheet" + i] = jsonData
                    workbookDataList.push(sheetData)
                })

                resolve(workbookDataList);
            } catch (error) {
                Swal.fire("파일을 읽는 중 오류가 발생했습니다.");
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };
    });
};


/**
 * 게시판 게시글 포함 조회
 * @param bbsNm 게시판명
 * @param bbsType 게시판 유형
 * @param actvtnYn 활성여부
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
export const getBbsInPst = async (bbsNm, bbsTypeNm, actvtnYn, userSn, day) => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            bbsNm : bbsNm,
            bbsTypeNm : bbsTypeNm,
            actvtnYn : actvtnYn,
            userSn : userSn,
            selectDt : day
        })
    };

    return new Promise((resolve, reject) => {
        EgovNet.requestFetch(
            "/bbsApi/getBbsInPstList.do",
            requestOptions,
            (resp) => {
                resolve(resp.result.bbsList);
            },
            (error) => {
                console.log("err response : ", error);
                reject(error);
            }
        );
    });
};