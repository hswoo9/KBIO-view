import CODE from "@/constants/code";
import * as EgovNet from "@/api/egovFetch";
import {useNavigate} from "react-router-dom";
import URL from "@/constants/url";

const mngrAcsIpChk = () => {
    const navigate = useNavigate();

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

export default mngrAcsIpChk;
