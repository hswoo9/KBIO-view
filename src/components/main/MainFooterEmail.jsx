import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as ComScript from "@/components/CommonScript";
import userEmailImg from "@/assets/images/user_email_collection_img.png";

const MainFooterEmail = ({ value }) => {
    return (
        <div className="emailModal modalCon">
            <div className="bg" onClick={() => ComScript.closeModal("emailModal")}></div>
            <div className="m-inner">
                <div className="boxWrap">
                    <div className="close" onClick={() => ComScript.closeModal("emailModal")}>
                        <div className="icon"></div>
                    </div>
                    <div className="titleWrap type2">
                        <p className="tt1 fontColorCustom">이메일무단수집거부</p>
                    </div>
                    <form className="diffiBox">
                        <figure className="imgBox">
                            <img src={userEmailImg} alt="image"/>
                        </figure>
                        <div className="textBox fontColorCustom">
                            <strong className="title">본 웹사이트는 <span className="blue">이메일 주소</span>의 무단수집을 <span
                                className="blue">거부</span>합니다.</strong>
                            <p className="text">본 웹사이트에 게시된 이메일의 무단수집을 거부하며, <br/>전자우편 수집 프로그램이나 그밖의 기술적 장치를 이용하여 무단으로
                                수집할 경우 <br/>정보통신망이용촉진 및 정보보호등에 관한 법률에 의해 형사처벌됨을 유념하시기 바랍니다.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MainFooterEmail;
