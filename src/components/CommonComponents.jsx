import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import {useNavigate} from "react-router-dom";
import URL from "@/constants/url";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";

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