import { getComCdList } from "@/components/CommonComponents";
import { NavLink } from "react-router-dom";
import URL from "@/constants/url";
import logoWhite from "@/assets/images/logo_white.svg";
import React, {useEffect, useState} from "react";
import {getBnrPopupList} from "@/components/main/MainComponents";
import MainFooterInfo from "@/components/main/MainFooterInfo";
import MainFooterEmail from "@/components/main/MainFooterEmail";
import * as ComScript from "@/components/CommonScript";

function EgovFooterUser() {
  const [comCdList, setComCdList] = useState([]);
  const [familySiteList, setFamilySiteList] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [footerValue, setFooterValue] = useState("");
  useEffect(() => {
  }, [footerValue]);
  const handleClick = (value) => {
    setFooterValue(value);
    ComScript.openModal("privacyPolicyModal");
  }
  useEffect(() => {
    /*getBnrPopupList("bnr").then((data) => {
      setBannerList(data.filter(e => e.tblBnrPopup.bnrPopupFrm == "footSlides"));
    });*/
  }, []);

  useEffect(() => {
    getComCdList(6).then((data) => {
      setComCdList(data);
    })

    getComCdList(16).then((data) => {
      if(data != null){
        let dataList = [];
        data.forEach(function(item, index){
          dataList.push(
              <option value={item.etcMttr1} key={item.comCdSn}>{item.comCdNm}</option>
          )

        });
        setFamilySiteList(dataList);
      }

    })
  }, []);

  return (
      <footer className="userFooter">
        <div>
          {bannerList.length > 0 && (
              <div style={{
                display : "flex",
                justifyContent : "center"
              }}>
                {bannerList.map((banner, index) => (
                    <div key={index} style={{
                      display : "inline-block",
                      position : "relative",
                      width : "200px"
                    }}>
                      <img
                          src={`http://133.186.250.158${banner.tblComFile.atchFilePathNm}/${banner.tblComFile.strgFileNm}.${banner.tblComFile.atchFileExtnNm}`}
                          alt={banner.tblComFile.atchFileNm}
                          style={{
                            cursor:"pointer"
                          }}
                          onClick={() => {
                            window.open(`${banner.bnrPopupUrlAddr}`);
                          }}
                      />
                    </div>
                ))}
              </div>
          )}
        </div>
        <div className="innerDiv">
          <div className="inner">
            <figure className="logo"><img src={logoWhite} alt="K Bio LabHub"/></figure>
            <div className="center">
              <ul className="linkBox">
                <li><a onClick={() => handleClick("1")} className="cursorTag"><span>개인정보 처리방침</span></a></li>
                <li><a onClick={() => handleClick("2")} className="cursorTag"><span>이용약관</span></a></li>
                <li><a onClick={() => ComScript.openModal("emailModal")} className="cursorTag"><span>이메일무단수집거부</span></a></li>
                <li>
                  <NavLink to={URL.KBIO_LOCATION}
                           state={{
                             menuSn: 44,
                             thisMenuSn: 52,
                             menuNmPath: "K-BioLabHub > 오시는길"
                           }}
                  >
                    <span>오시는길</span>
                  </NavLink>
                </li>
              </ul>
              <address>
                <div><span className="left">주소</span><span
                    className="right">인천광역시 연수구 송도과학로 85, 연세대학교 국제캠퍼스 종합관 3, 4층</span></div>
                <div><span className="left">대표번호</span><a href="tel:032-123-1234"
                                                          className="right"><span>032-123-1234</span></a></div>
                <div><span className="left">E-MAIL</span><a href="mailto:service@k-biolabhub.com"
                                                            className="right"><span>service@k-biolabhub.com</span></a>
                </div>
              </address>
            </div>
            <div className="right">
              <div className="familySiteWrap">
                <div className="itemBox">
                  <select className="selectGroup footerSelect"
                    onChange={(e) => {
                        if (e.target.value != "") {
                          window.open(e.target.value);
                        }
                      }
                    }
                  >
                    <option value="">패밀리 사이트 바로가기</option>
                    {familySiteList}
                  </select>
                </div>
              </div>
              {
                comCdList.find(e => e.comCd == "FOOTER_SNS") ?
                    comCdList.find(e => e.comCd == "FOOTER_SNS").actvtnYn == "Y" ?
                        (<ul className="snsBox">
                          <li className="faceBook"><a href="#">
                            <div className="icon"></div>
                          </a></li>
                          <li className="instagram"><a href="#">
                            <div className="icon"></div>
                          </a></li>
                          <li className="youtube"><a href="#">
                            <div className="icon"></div>
                          </a></li>
                        </ul>) : ""
                    : ""
              }
            </div>
          </div>
          <MainFooterInfo value={footerValue}/>
          <MainFooterEmail />
        </div>
      </footer>
  );
}

export default EgovFooterUser;
