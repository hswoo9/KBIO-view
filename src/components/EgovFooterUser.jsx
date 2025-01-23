import { Link } from "react-router-dom";

import logoWhite from "@/assets/images/logo_white.svg";

function EgovFooterUser() {
  return (
      <footer>
        <div className="inner">
          <figure className="logo"><img src={logoWhite} alt="K Bio LabHub"/></figure>
          <div className="center">
            <ul className="linkBox">
              <li><a href="#"><span>개인정보 처리방침</span></a></li>
              <li><a href="#"><span>이용약관</span></a></li>
              <li><a href="#"><span>이메일무단수집거부</span></a></li>
              <li><a href="#"><span>오시는길</span></a></li>
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
                <select>
                  <option value="0">패밀리 사이트 바로가기</option>
                  <option value="1">예시1</option>
                  <option value="2">예시2</option>
                  <option value="3">예시3</option>
                  <option value="4">예시4</option>
                  <option value="5">예시5</option>
                </select>
              </div>
            </div>
            <ul className="snsBox">
              <li className="faceBook"><a href="#">
                <div className="icon"></div>
              </a></li>
              <li className="instagram"><a href="#">
                <div className="icon"></div>
              </a></li>
              <li className="youtube"><a href="#">
                <div className="icon"></div>
              </a></li>
            </ul>
          </div>
        </div>
      </footer>
  );
}

export default EgovFooterUser;
