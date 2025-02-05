import React, {useEffect, useState} from 'react';
import {getSessionItem} from "../../../utils/storage.js";
import * as EgovNet from "@/api/egovFetch";
import Swal from "sweetalert2";
import moment from "moment/moment.js";
import CODE from "@/constants/code";

const CommonPstEval  = ({ pstSn }) => {
    const sessionUser = getSessionItem("loginUser");
    const [pstEvl, setPstEvl] = useState({
        evlYmd : moment(new Date()).format('YYYYMMDD'),
        evlUserSn : sessionUser.userSn,
        creatrSn : sessionUser.userSn
    })
    const handleSubmit = () => {
        if (!pstEvl.evlArtclNo) {
          alert('만족도를 선택해 주세요.');
          return;
        }

        const setPstEvlUrl = "/pstApi/setPstEvl";
        Swal.fire({
            title: "평가하시겠습니까?",
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        }).then((result) => {
            if(result.isConfirmed) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(pstEvl),
                };

                EgovNet.requestFetch(setPstEvlUrl, requestOptions, (resp) => {
                    if (Number(resp.resultCode) === Number(CODE.RCV_SUCCESS)) {
                        Swal.fire("평가가 제출되었습니다.");
                        document.getElementById("impvOpnnCn").value = ""
                        document.getElementsByName('rating').forEach((radio) => {
                            radio.checked = false;
                        });
                    } else {
                        alert("ERR : " + resp.resultMessage);
                    }
                });
            } else {
                //취소
            }
        });
    };

    useEffect(() => {
        setPstEvl((pstEvl) => ({
            ...pstEvl,
            pstSn: pstSn,
        }));
    }, [pstSn]);

  return (
      <div className="survey-container">
      <style>{`
          .survey-container {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 5px;
            margin: 20px auto;
            font-family: Arial, sans-serif;
          }
          
          h3 {
            font-size: 16px;
            margin-bottom: 15px;
          }
          
          .rating-options {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 15px;
          }
          
          label {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 14px;
          }
          
          textarea.comment-box {
            width: 90%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
            resize: none;
          }
          
          .submit-button {
            background-color: #e91e63;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
          }
          
          .submit-button:hover {
            background-color: #c2185b;
          }

        `}
      </style>
        <h3>※ 현재 페이지의 내용이나 사용 편의성에 대해 만족하시나요?</h3>
        <div className="rating-options">
              <label>
                <input
                    type="radio"
                    name="rating"
                    value="매우 그렇다"
                    onChange={(e) =>
                        setPstEvl({ ...pstEvl, evlArtclNo: e.target.value })
                    }
                />
                매우 그렇다
              </label>
              <label>
                <input
                    type="radio"
                    name="rating"
                    value="대체로 그렇다"
                    onChange={(e) =>
                        setPstEvl({ ...pstEvl, evlArtclNo: e.target.value })
                    }
                />
                대체로 그렇다
              </label>
              <label>
                <input
                    type="radio"
                    name="rating"
                    value="보통이다"
                    onChange={(e) =>
                        setPstEvl({ ...pstEvl, evlArtclNo: e.target.value })
                    }
                />
                보통이다
              </label>
              <label>
                <input
                    type="radio"
                    name="rating"
                    value="대체로 그렇지 않다"
                    onChange={(e) =>
                        setPstEvl({ ...pstEvl, evlArtclNo: e.target.value })
                    }
                />
                대체로 그렇지 않다
              </label>
              <label>
                <input
                    type="radio"
                    name="rating"
                    value="전혀 그렇지 않다"
                    onChange={(e) =>
                        setPstEvl({ ...pstEvl, evlArtclNo: e.target.value })
                    }
                />
                전혀 그렇지 않다
              </label>
            </div>
            <div style={{display:"flex"}}>
                <textarea
                    className="comment-box"
                    id="impvOpnnCn"
                    placeholder="정보에 대한 의견이 있으시면 작성해 주세요."
                    onChange={(e) =>
                        setPstEvl({ ...pstEvl, impvOpnnCn: e.target.value })
                    }
                />
                <button className="submit-button" onClick={handleSubmit}>
                  평가
                </button>
            </div>
          </div>
  );
};

export default CommonPstEval ;