import { useEffect, useState, useRef, useCallback } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import URL from "@/constants/url";
import CODE from "@/constants/code";

//CUSTOM
import EgovHeaderUser from "@/components/EgovHeaderUser";
import ManagerTop from "@/components/manager/ManagerTop";
import EgovFooterUser from "@/components/EgovFooterUser";
import EgovMainUser from "@/pages/main/EgovMainUser";

//COMMON
import CommonError from "@/pages/common/error/commonError";
import CommonPopup from "@/pages/common/popup/commonPopup";
import CommonContentView from "@/pages/common/content/view";
import CommonPstList from "@/pages/common/pst/list";
import CommonPstDetail from "@/pages/common/pst/detail";
import CommonPstEdit from "@/pages/common/pst/edit";

import EgovMain from "@/pages/main/EgovMain";
import EgovLogin from "@/pages/login/EgovLogin";
import ManagerLogin from "@/pages/manager/login/ManagerLogin";

import EgovError from "@/components/EgovError";
import EgovFindIdPswd from "@/pages/login/EgovFindIdPswd";

//SNS
import SnsNaverCallback from "@/components/sns/SnsNaverCallback";
import SnsKakaoCallback from "@/components/sns/SnsKakaoCallback";

//ABOUT
import EgovAboutSite from "@/pages/about/EgovAboutSite";
import EgovAboutHistory from "@/pages/about/EgovAboutHistory";
import EgovAboutOrganization from "@/pages/about/EgovAboutOrganization";
import EgovAboutLocation from "@/pages/about/EgovAboutLocation";

//INTRO
import EgovIntroWork from "@/pages/intro/EgovIntroWork";
import EgovIntroService from "@/pages/intro/EgovIntroService";

//SUPPORT
import EgovSupportDownloadList from "@/pages/support/download/EgovDownloadList";
import EgovSupportDownloadDetail from "@/pages/support/download/EgovDownloadDetail";
import EgovSupportDownloadCreate from "@/pages/support/download/EgovDownloadCreate";
import EgovSupportQnaList from "@/pages/support/qna/EgovQnaList";
import EgovSupportQnaDetail from "@/pages/support/qna/EgovQnaDetail";
import EgovSupportApply from "@/pages/support/apply/EgovSupportApply";

//INFORM
import EgovDailyList from "@/pages/inform/daily/EgovDailyList";
import EgovDailyDetail from "@/pages/inform/daily/EgovDailyDetail";
import EgovWeeklyList from "@/pages/inform/weekly/EgovWeeklyList";

import EgovNoticeList from "@/pages/inform/notice/EgovNoticeList";
import EgovNoticeDetail from "@/pages/inform/notice/EgovNoticeDetail";
import EgovNoticeEdit from "@/pages/inform/notice/EgovNoticeEdit";

import EgovGalleryList from "@/pages/inform/gallery/EgovGalleryList";
import EgovGalleryDetail from "@/pages/inform/gallery/EgovGalleryDetail";
import EgovGalleryEdit from "@/pages/inform/gallery/EgovGalleryEdit";

import Templates from "@/pages/templates/Templates";
import EgovAdminMenuList from "@/pages/admin/menu/EgovAdminMenuList";


//MANAGER
import MamagerIndex from "@/pages/manager/Index";
import ManagerNormalMember from "@/pages/manager/member/all/ManagerNormalMember";
import ManagerApprovalMember from "@/pages/manager/member/approval/ManagerApprovalMember";
import ManagerRejectMember from "@/pages/manager/member/reject/ManagerRejectMember";
import ManagerCancelMember from "@/pages/manager/member/cancel/ManagerCancelMember";
import ManagerStopMember from "@/pages/manager/member/stop/ManagerStopMember";
import ManagerWaitMember from "@/pages/manager/member/wait/ManagerWaitMember";

import MemberResidentMember from "@/pages/manager/member/ManagerResidentMember";
import MemberRelatedMember from "@/pages/manager/member/ManagerRelatedMember";
import MemberNonResidentMember from "@/pages/manager/member/ManagerNonResidentMember";
import MemberConsultentMember from "@/pages/manager/member/ManagerConsultentMember";

import ManagerMenuManagement from "@/pages/manager/menu/ManagerMenuManagement";

import ManagerMenuContentManagement from "@/pages/manager/menu/ManagerMenuContentManagement";


import ManagerMenuAuthority from "@/pages/manager/menu/ManagerMenuAuthority";
import ManagerAuthorityGroupUsers from "@/pages/manager/menu/ManagerAuthorityGroupUsers";

import ManagerBbsList from "@/pages/manager/board/ManagerBbsList";
import ManagerBbsEdit from "@/pages/manager/board/ManagerBbsEdit";

import ManagerBbsList2 from "@/pages/manager/board/pst/ManagerBbsList";
import ManagerBbsPstList from "@/pages/manager/board/pst/ManagerPstList";
import ManagerPstDetail from "@/pages/manager/board/pst/ManagerPstDetail";
import ManagerBbsPstEdit from "@/pages/manager/board/pst/ManagerPstEdit";

import ManagerNormalMemberEdit from "@/pages/manager/member/all/ManagerNormalMemberEdit";
import ManagerApprovalMemberEdit from "@/pages/manager/member/approval/ManagerApprovalMemberEdit";
import ManagerRejectMemberEdit from "@/pages/manager/member/reject/ManagerRejectMemberEdit";
import ManagerStopMemberEdit from "@/pages/manager/member/stop/ManagerStopMemberEdit";
import ManagerWaitMemberEdit from "@/pages/manager/member/wait/ManagerWaitMemberEdit";

import ManagerCodeGroup from "@/pages/manager/common/ManagerCodeGroup";
import ManagerCodeGroupEdit from "@/pages/manager/common/ManagerCodeGroupEdit";

import ManagerCodeList from "@/pages/manager/code/ManagerCodeList";
import ManagerCodeEdit from "@/pages/manager/code/ManagerCodeEdit";


import ManagerBannerList from "@/pages/manager/banner/ManagerBannerList";
import ManagerBannerEdit from "@/pages/manager/banner/ManagerBannerEdit";
import ManagerPopupList from "@/pages/manager/popup/ManagerPopupList";
import ManagerPopupEdit from "@/pages/manager/popup/ManagerPopupEdit";
import ManagerImagesPopup from "@/pages/manager/popup/ManagerImagesPopup";


import ResidentCompanyCreate from "@/pages/manager/member/ResidentCompanyCreate";


//입주지원
import OperationalSupport from "@/pages/manager/operationalSupport/OperationalSupport";
import OperationalResidentMember from "@/pages/manager/operationalSupport/OperationalResidentMember";
import OperationalRelatedOrganization from "@/pages/manager/operationalSupport/OperationalRelatedOrganization";
import OpertionalDifficulties from "@/pages/manager/operationalSupport/OpertionalDifficulties";
import OperationalResidentManageMember from "@/pages/manager/operationalSupport/OperationalResidentManageMember";
import OperationResidentMemberEdit from "@/pages/manager/operationalSupport/OperationResidentMemberEdit";

//컨설팅지원
import ManagerExpert from "@/pages/manager/consulting/ManagerExpert";
import ManagerMatching from "@/pages/manager/consulting/ManagerMatching";
//회원관리
import ManagerAllMember from "@/pages/manager/member/all/ManagerNormalMember";

//홈페이지관리
import ManagerMainView from "@/pages/manager/homepage/ManagerMainView";
import ManagerOrganizationChartList from "@/pages/manager/homepage/ManagerOrganizationChartList";
import ManagerPrivacyPolicy from "@/pages/manager/homepage/ManagerPrivacyPolicy";
import ManagerPrivacyPolicyEdit from "@/pages/manager/homepage/ManagerPrivacyPolicyEdit";
import ManagerTermsAgreement from "@/pages/manager/homepage/ManagerTermsAgreement";
import ManagerTermsAgreementEdit from "@/pages/manager/homepage/ManagerTermsAgreementEdit";

import ManagerAccessList from "@/pages/manager/access/ManagerAccessList";
import ManagerAccessEdit from "@/pages/manager/access/ManagerAccessEdit";


//통계
import ManagerStatisticsUser from "@/pages/manager/statistics/ManagerStatisticsUser";





//ADMIN
import EgovAdminScheduleList from "@/pages/admin/schedule/EgovAdminScheduleList";
import EgovAdminScheduleDetail from "@/pages/admin/schedule/EgovAdminScheduleDetail";
import EgovAdminScheduleEdit from "@/pages/admin/schedule/EgovAdminScheduleEdit";

import EgovAdminBoardList from "@/pages/admin/board/EgovAdminBoardList";
import EgovAdminBoardEdit from "@/pages/admin/board/EgovAdminBoardEdit";

import EgovAdminUsageList from "@/pages/admin/usage/EgovAdminUsageList";
import EgovAdminUsageEdit from "@/pages/admin/usage/EgovAdminUsageEdit";

import EgovAdminNoticeList from "@/pages/admin/notice/EgovAdminNoticeList";
import EgovAdminNoticeDetail from "@/pages/admin/notice/EgovAdminNoticeDetail";
import EgovAdminNoticeEdit from "@/pages/admin/notice/EgovAdminNoticeEdit";

import EgovAdminGalleryList from "@/pages/admin/gallery/EgovAdminGalleryList";
import EgovAdminGalleryDetail from "@/pages/admin/gallery/EgovAdminGalleryDetail";
import EgovAdminGalleryEdit from "@/pages/admin/gallery/EgovAdminGalleryEdit";
//사이트관리자 암호 바꾸기 기능 추가 2023.04.15(토) 김일국 추가
import EgovAdminPasswordUpdate from "@/pages/admin/manager/EgovAdminPasswordUpdate";
//회원관리 기능 추가
import EgovAdminMemberList from "@/pages/admin/members/EgovAdminMemberList";
import EgovAdminMemberEdit from "@/pages/admin/members/EgovAdminMemberEdit";
//마이페이지 기능 추가
import MemberSignUp from "@/pages/mypage/MemberSignUp";
import EgovTermsAgreement from '@/pages/mypage/EgovTermsAgreement';
import EgovIdentityVerification from '@/pages/mypage/EgovIdentityVerification';
import MemberSignupChoice from '@/pages/mypage/MemberSignupChoice';
import EgovCompleteMember from '@/pages/mypage/EgovCompleteMember';
import * as EgovNet from "@/api/egovFetch"; // jwt토큰 위조 검사 때문에 추가
import initPage from "@/js/ui";
import SnsGoogleCallback from "../components/sns/SnsGoogleCallback.jsx";


import MessageTest from "@/pages/templates/messageTest.jsx";
import {WebSocketProvider} from "../utils/WebSocketProvider.jsx";
const RootRoutes = () => {
  //useLocation객체를 이용하여 정규표현식을 사용한 /admin/~ 으로 시작하는 경로와 비교에 사용(아래 1줄) */}
  const location = useLocation();

  //리액트에서 사이트관리자에 접근하는 토큰값 위변조 방지용으로 서버에서 비교하는 함수 추가
  const jwtAuthentication = useCallback(() => {
    console.group("jwtAuthentication");
    console.log("[Start] jwtAuthentication ------------------------------");

    const jwtAuthURL = "/jwtAuthAPI";
    let requestOptions = {
      method: "POST",
    };

    EgovNet.requestFetch(jwtAuthURL, requestOptions, (resp) => {
      if (resp === false) {
        setMounted(false);
      } else {
        setMounted(true); // 이 값으로 true 일 때만 페이지를 렌더링이 되는 변수 사용.
      }
    });

    console.log("------------------------------jwtAuthentication [End]");
    console.groupEnd("jwtAuthentication");
  }, []);

  //시스템관리 메뉴인 /admin/으로 시작하는 URL은 모두 로그인이 필요하도록 코드추가(아래)
  const isMounted = useRef(false); // 아래 로그인 이동 부분이 2번 실행되지 않도록 즉, 마운트 될 때만 실행되도록 변수 생성
  const [mounted, setMounted] = useState(false); // 컴포넌트 최초 마운트 후 리렌더링 전 로그인 페이지로 이동하는 조건으로 사용

  useEffect(() => {
    if (!isMounted.current) {
      // 컴포넌트 최초 마운트 시 페이지 진입 전(렌더링 전) 실행
      isMounted.current = true; // 이 값으로 true 일 때만 페이지를 렌더링이 되는 변수 사용.
      setMounted(true); // 이 값으로 true 일 때만 페이지를 렌더링이 되는 변수 사용.
      const regex = /^(\/admin\/)+(.)*$/; //정규표현식 사용: /admin/~ 으로 시작하는 경로 모두 포함
      if (regex.test(location.pathname)) {
        setMounted(false); // 이 값으로 true 일 때만 페이지를 렌더링이 되는 변수 사용. 기본은 숨기기
        jwtAuthentication(); // 이 함수에서 관리자단 인증여부 확인 후 렌더링 처리
      }
    }
  }, [jwtAuthentication, location, mounted]); // location 경로와 페이지 마운트상태가 변경 될 때 업데이트 후 리렌더링

  if (mounted) {
    // 인증 없이 시스템관리 URL로 접근할 때 렌더링 되는 것을 방지하는 조건추가.
    return (
      <Routes>
        <Route path={URL.ERROR} element={<EgovError />} />
        <Route path="*" element={<SecondRoutes />} />
      </Routes>
    );
  }
};

const SecondRoutes = () => {
  // eslint-disable-next-line no-unused-vars
  const [loginVO, setLoginVO] = useState({});

  //useRef객체를 사용하여 페이지 마운트 된 후 ui.js를 로딩 하도록 변경 코드 추가(아래)
  const isMounted = useRef(false); // 아래 로그인 이동 부분이 2번 실행되지 않도록 즉, 마운트 될 때만 실행되도록 변수 생성

  useEffect(() => {
    if (!isMounted.current) {
      // 컴포넌트 최초 마운트 시 페이지 진입 전(렌더링 전) 실행
      isMounted.current = true; // 이 값으로 true 일 때만 페이지를 렌더링이 되는 변수 사용.
    } else {
      initPage();
    }
  }, []);

  const requestUrl = window.location.pathname.split("/")[1];
  return (
        <div id="wrap" className={requestUrl === "manager" ? "admin" : "user"}>
          {
            requestUrl === "manager" ? (<ManagerTop/>) :
            requestUrl === "popup" ? "" :
            requestUrl === "commonError" ? "" : (<EgovHeaderUser/>)
          }

          <WebSocketProvider>
            <Routes>
              {/* MAIN */}
              <Route path={URL.MAIN} element={<EgovMainUser/>}/>

              {/* COMMON */}
              <Route path={URL.COMMON_CONTENT_VIEW} element={<CommonContentView/>}/>
              <Route path={URL.COMMON_POPUP} element={<CommonPopup/>}/>
              <Route path={URL.COMMON_PST_LIST} element={<CommonPstList/>}/>
              <Route path={URL.COMMON_PST_DETAIL} element={<CommonPstDetail mode={CODE.MODE_READ}/>}/>
              <Route path={URL.COMMON_PST_CREATE} element={<CommonPstEdit mode={CODE.MODE_CREATE}/>}/>
              <Route path={URL.COMMON_PST_MODIFY} element={<CommonPstEdit mode={CODE.MODE_MODIFY}/>}/>

              {/* LOGIN */}
              <Route
                  path={URL.LOGIN}
                  element={<EgovLogin onChangeLogin={(user) => setLoginVO(user)}/>}
              />
              <Route
                  path={URL.MANAGER_LOGIN}
                  element={<ManagerLogin onChangeLogin={(user) => setLoginVO(user)}/>}
              />

              {/* Sns Naver Callback */}
              <Route
                  path={URL.SNS_NAVER_CB}
                  element={
                    <SnsNaverCallback onChangeLogin={(user) => setLoginVO(user)}/>
                  }
              />
              {/* Sns Kakao Callback */}
              <Route
                  path={URL.SNS_KAKAO_CB}
                  element={
                    <SnsKakaoCallback onChangeLogin={(user) => setLoginVO(user)}/>
                  }
              />

              {/* Sns GOOGLE Callback */}
              <Route
                  path={URL.SMS_GOOGLE_CB}
                  element={
                    <SnsGoogleCallback onChangeLogin={(user) => setLoginVO(user)}/>
                  }
              />


              {/* ERROR */}
              <Route path={URL.ERROR} element={<EgovError/>}/>

              {/* ABOUT */}
              <Route path={URL.ABOUT} element={<Navigate to={URL.ABOUT_SITE}/>}/>
              <Route path={URL.ABOUT_SITE} element={<EgovAboutSite/>}/>
              <Route path={URL.ABOUT_HISTORY} element={<EgovAboutHistory/>}/>
              <Route
                  path={URL.ABOUT_ORGANIZATION}
                  element={<EgovAboutOrganization/>}
              />
              <Route path={URL.ABOUT_LOCATION} element={<EgovAboutLocation/>}/>

              {/* INTRO */}
              <Route path={URL.INTRO} element={<Navigate to={URL.INTRO_WORKS}/>}/>
              <Route path={URL.INTRO_WORKS} element={<EgovIntroWork/>}/>
              <Route path={URL.INTRO_SERVICE} element={<EgovIntroService/>}/>


              {/* SUPPORT */}
              <Route
                  path={URL.SUPPORT}
                  element={<Navigate to={URL.SUPPORT_DOWNLOAD}/>}
              />

              <Route
                  path={URL.SUPPORT_DOWNLOAD}
                  element={<EgovSupportDownloadList/>}
              />
              <Route
                  path={URL.SUPPORT_DOWNLOAD_DETAIL}
                  element={<EgovSupportDownloadDetail/>}
              />
              <Route
                  path={URL.SUPPORT_DOWNLOAD_CREATE}
                  element={<EgovSupportDownloadCreate/>}
              />

              <Route path={URL.SUPPORT_QNA} element={<EgovSupportQnaList/>}/>
              <Route
                  path={URL.SUPPORT_QNA_DETAIL}
                  element={<EgovSupportQnaDetail/>}
              />

              <Route path={URL.SUPPORT_APPLY} element={<EgovSupportApply/>}/>

              {/* INFORM */}
              <Route path={URL.INFORM} element={<Navigate to={URL.INFORM_DAILY}/>}/>

              <Route path={URL.INFORM_DAILY} element={<EgovDailyList/>}/>
              <Route path={URL.INFORM_DAILY_DETAIL} element={<EgovDailyDetail/>}/>
              <Route path={URL.INFORM_WEEKLY} element={<EgovWeeklyList/>}/>
              <Route path={URL.INFORM_WEEKLY_DETAIL} element={<EgovDailyDetail/>}/>

              <Route path={URL.INFORM_NOTICE} element={<EgovNoticeList/>}/>
              <Route path={URL.INFORM_NOTICE_DETAIL} element={<EgovNoticeDetail/>}/>
              <Route
                  path={URL.INFORM_NOTICE_CREATE}
                  element={<EgovNoticeEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.INFORM_NOTICE_MODIFY}
                  element={<EgovNoticeEdit mode={CODE.MODE_MODIFY}/>}
              />
              <Route
                  path={URL.INFORM_NOTICE_REPLY}
                  element={<EgovNoticeEdit mode={CODE.MODE_REPLY}/>}
              />

              <Route path={URL.INFORM_GALLERY} element={<EgovGalleryList/>}/>
              <Route
                  path={URL.INFORM_GALLERY_DETAIL}
                  element={<EgovGalleryDetail/>}
              />
              <Route
                  path={URL.INFORM_GALLERY_CREATE}
                  element={<EgovGalleryEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.INFORM_GALLERY_MODIFY}
                  element={<EgovGalleryEdit mode={CODE.MODE_MODIFY}/>}
              />
              <Route
                  path={URL.INFORM_GALLERY_REPLY}
                  element={<EgovGalleryEdit mode={CODE.MODE_REPLY}/>}
              />

              {/* TEMPLATES */}
              <Route path={URL.TEMPLATES} element={<Templates/>}/>


              {/* ADMIN */}
              <Route
                  path={URL.ADMIN}
                  element={<Navigate to={URL.ADMIN_SCHEDULE}/>}
              />
              <Route path={URL.ADMIN_SCHEDULE} element={<EgovAdminScheduleList/>}/>
              <Route
                  path={URL.ADMIN_SCHEDULE_DETAIL}
                  element={<EgovAdminScheduleDetail/>}
              />
              <Route
                  path={URL.ADMIN_SCHEDULE_CREATE}
                  element={<EgovAdminScheduleEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.ADMIN_SCHEDULE_MODIFY}
                  element={<EgovAdminScheduleEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route path={URL.ADMIN_BOARD} element={<EgovAdminBoardList/>}/>
              <Route
                  path={URL.ADMIN_BOARD_CREATE}
                  element={<EgovAdminBoardEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.ADMIN_BOARD_MODIFY}
                  element={<EgovAdminBoardEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route path={URL.ADMIN_USAGE} element={<EgovAdminUsageList/>}/>
              <Route
                  path={URL.ADMIN_USAGE_CREATE}
                  element={<EgovAdminUsageEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.ADMIN_USAGE_MODIFY}
                  element={<EgovAdminUsageEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route path={URL.ADMIN_NOTICE} element={<EgovAdminNoticeList/>}/>
              <Route
                  path={URL.ADMIN_NOTICE_DETAIL}
                  element={<EgovAdminNoticeDetail/>}
              />
              <Route
                  path={URL.ADMIN_NOTICE_CREATE}
                  element={<EgovAdminNoticeEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.ADMIN_NOTICE_MODIFY}
                  element={<EgovAdminNoticeEdit mode={CODE.MODE_MODIFY}/>}
              />
              <Route
                  path={URL.ADMIN_NOTICE_REPLY}
                  element={<EgovAdminNoticeEdit mode={CODE.MODE_REPLY}/>}
              />

              <Route path={URL.ADMIN_GALLERY} element={<EgovAdminGalleryList/>}/>
              <Route
                  path={URL.ADMIN_GALLERY_DETAIL}
                  element={<EgovAdminGalleryDetail/>}
              />
              <Route
                  path={URL.ADMIN_GALLERY_CREATE}
                  element={<EgovAdminGalleryEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.ADMIN_GALLERY_MODIFY}
                  element={<EgovAdminGalleryEdit mode={CODE.MODE_MODIFY}/>}
              />
              <Route
                  path={URL.ADMIN_GALLERY_REPLY}
                  element={<EgovAdminGalleryEdit mode={CODE.MODE_REPLY}/>}
              />
              {/* 사이트관리자 암호 바꾸기 기능 */}
              <Route path={URL.ADMIN_MANAGER} element={<EgovAdminPasswordUpdate/>}/>
              <Route path={URL.ADMIN_MEMBERS} element={<EgovAdminMemberList/>}/>
              <Route
                  path={URL.ADMIN_MEMBERS_CREATE}
                  element={<EgovAdminMemberEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.ADMIN_MEMBERS_MODIFY}
                  element={<EgovAdminMemberEdit mode={CODE.MODE_MODIFY}/>}
              />
              {/* MYPAGE */}
              {/*<Route
              path={URL.MYPAGE_CREATE}
              element={<EgovMypageEdit mode={CODE.MODE_CREATE} />}
            />*/}
              <Route path={URL.COMPLETE_MEMBER} element={<EgovCompleteMember/>}/>
              <Route path={URL.SIGNUP_CHOICE} element={<MemberSignupChoice/>}/>
              <Route path={URL.TERMS_AGREEMENT} element={<EgovTermsAgreement/>}/>
              <Route path={URL.IDENTITY_VERIFICATION} element={<EgovIdentityVerification/>}/>
              <Route
                  path={URL.MYPAGE_CREATE}
                  element={<MemberSignUp mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.MYPAGE_MODIFY}
                  element={<MemberSignUp mode={CODE.MODE_MODIFY}/>}
              />
              <Route
                  path={URL.ADMIN_MENU}
                  element={<EgovAdminMenuList mode={CODE.ADMIN_MENU}/>}
              />

              <Route
                  path={URL.MANAGER}
                  element={<MamagerIndex mode={CODE.MANAGER}/>}
              />

              <Route
                  path={URL.MANAGER_CMS}
                  element={<MamagerIndex/>}
              />
              <Route
                  path={URL.MANAGER_NORMAL_MEMBER}
                  element={<ManagerNormalMember/>}
              />
              <Route
                  path={URL.MANAGER_APPROVAL_MEMBER}
                  element={<ManagerApprovalMember/>}
              />
              <Route
                  path={URL.MANAGER_REJECT_MEMBER}
                  element={<ManagerRejectMember/>}
              />
              <Route
                  path={URL.MANAGER_STOP_MEMBER}
                  element={<ManagerStopMember/>}
              />
              <Route
                  path={URL.MANAGER_WAIT_MEMBER}
                  element={<ManagerWaitMember/>}
              />
              <Route
                  path={URL.MANAGER_CANCEL_MEMBER}
                  element={<ManagerCancelMember/>}
              />
              <Route
                  path={URL.MANAGER_RELATED_COMPANY}
                  element={<MemberRelatedMember/>}
              />
              <Route
                  path={URL.MANAGER_NONRESIDENT_COMPANY}
                  element={<MemberNonResidentMember/>}
              />
              <Route
                  path={URL.MANAGER_CONSULTENT}
                  element={<MemberConsultentMember/>}
              />
              <Route
                  path={URL.MANAGER_RESIDENT_COMPANY}
                  element={<MemberResidentMember/>}
              />

              <Route
                  path={URL.MANAGER_MENU_MANAGEMENT}
                  element={<ManagerMenuManagement/>}
              />

              <Route
                  path={URL.MANAGER_MENU_CONTENT_MANAGEMENT}
                  element={<ManagerMenuContentManagement/>}
              />

              <Route
                  path={URL.MANAGER_MENU_AUTHORITY}
                  element={<ManagerMenuAuthority/>}
              />
              <Route
                  path={URL.MANAGER_AUTHORITY_GROUP_USERS}
                  element={<ManagerAuthorityGroupUsers/>}
              />

              <Route
                  path={URL.MANAGER_BBS_LIST}
                  element={<ManagerBbsList/>}
              />

              <Route
                  path={URL.MANAGER_BBS_CREATE}
                  element={<ManagerBbsEdit mode={CODE.MODE_CREATE}/>}
              />

              <Route
                  path={URL.MANAGER_BBS_MODIFY}
                  element={<ManagerBbsEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route
                  path={URL.MANAGER_BBS_LIST2}
                  element={<ManagerBbsList2/>}
              />

              <Route
                  path={URL.MANAGER_PST_LIST}
                  element={<ManagerBbsPstList/>}
              />

              <Route
                  path={URL.MANAGER_PST_DETAIL}
                  element={<ManagerPstDetail mode={CODE.MODE_READ}/>}
              />

              <Route
                  path={URL.MANAGER_PST_CREATE}
                  element={<ManagerBbsPstEdit mode={CODE.MODE_CREATE}/>}
              />

              <Route
                  path={URL.MANAGER_PST_MODIFY}
                  element={<ManagerBbsPstEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route
                  path={URL.FIND_ID_PSWD}
                  element={<EgovFindIdPswd/>}
              />
              <Route
                  path={URL.MANAGER_CODE_GROUP}
                  element={<ManagerCodeGroup/>}
              />
              <Route
                  path={URL.MANAGER_CODE_GROUP_CREATE}
                  element={<ManagerCodeGroupEdit mode={CODE.MODE_CREATE}/>}
              />

              <Route
                  path={URL.MANAGER_CODE_GROUP_MODIFY}
                  element={<ManagerCodeGroupEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route
                  path={URL.RESIDENT_COMPANY_CREATE}
                  element={<ResidentCompanyCreate mode={CODE.MODE_CREATE}/>}
              />

              <Route
                  path={URL.RESIDENT_COMPANY_MODIFY}
                  element={<ResidentCompanyCreate mode={CODE.MODE_MODIFY}/>}
              />

              <Route path={URL.MANAGER_CODE} element={<ManagerCodeList/>}/>
              <Route
                  path={URL.MANAGER_CODE_CREATE}
                  element={<ManagerCodeEdit mode={CODE.MODE_CREATE}/>}
              />
              <Route
                  path={URL.MANAGER_CODE_MODIFY}
                  element={<ManagerCodeEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route
                  path={URL.MANAGER_NORMAL_MEMBER_MODIFY}
                  element={<ManagerNormalMemberEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route
                  path={URL.MANAGER_APPROVAL_MEMBER_MODIFY}
                  element={<ManagerApprovalMemberEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route
                  path={URL.MANAGER_REJECT_MEMBER_MODIFY}
                  element={<ManagerRejectMemberEdit mode={CODE.MODE_MODIFY}/>}
              />
              <Route
                  path={URL.MANAGER_STOP_MEMBER_MODIFY}
                  element={<ManagerStopMemberEdit mode={CODE.MODE_MODIFY}/>}
              />
              <Route
                  path={URL.MANAGER_WAIT_MEMBER_MODIFY}
                  element={<ManagerWaitMemberEdit mode={CODE.MODE_MODIFY}/>}
              />

              <Route
                  path={URL.MANAGER_NORMAL_MEMBER_CREATE}
                  element={<ManagerNormalMemberEdit mode={CODE.MODE_CREATE}/>}
              />

              <Route path={URL.MANAGER_BANNER_LIST} element={<ManagerBannerList/>}/>
              <Route path={URL.MANAGER_BANNER_CREATE} element={<ManagerBannerEdit mode={CODE.MODE_CREATE}/>}/>
              <Route path={URL.MANAGER_BANNER_MODIFY} element={<ManagerBannerEdit mode={CODE.MODE_MODIFY}/>}/>
              <Route path={URL.MANAGER_POPUP_LIST} element={<ManagerPopupList/>}/>
              <Route path={URL.MANAGER_POPUP_CREATE} element={<ManagerPopupEdit mode={CODE.MODE_CREATE}/>}/>
              <Route path={URL.MANAGER_POPUP_MODIFY} element={<ManagerPopupEdit mode={CODE.MODE_MODIFY}/>}/>
              
              <Route path={URL.MANAGER_IMAGES_POPUP} element={<ManagerImagesPopup/>}/>
              <Route path={URL.MANAGER_OPERATIONAL_SUPPORT} element={<OperationalSupport/>}/>
              <Route path={URL.MANAGER_CONSULTING_EXPERT} element={<ManagerExpert/>}/>
              <Route path={URL.MANAGER_CONSULTING_MATCHING} element={<ManagerMatching/>}/>
              <Route path={URL.MANAGER_MEMBER} element={<ManagerAllMember/>}/>
              <Route path={URL.MANAGER_MEMBER_ALL_MEMBER} element={<ManagerAllMember/>}/>

              <Route path={URL.MANAGER_RESIDENT_MEMBER} element={<OperationalResidentMember />} />
              <Route path={URL.MANAGER_RESIDENT_MANAGER} element={<OperationalResidentManageMember />}/>
              <Route path={URL.MANAGER_RESIDENT_MEMBER_EDIT} element={<OperationResidentMemberEdit mode={CODE.MODE_MODIFY}/>}/>
              <Route path={URL.MANAGER_RELATED_ORGANIZATION} element={<OperationalRelatedOrganization />} />
              <Route path={URL.MANAGER_DIFFICULTIES} element={<OpertionalDifficulties />} />


                <Route path={URL.MANAGER_HOMEPAGE} element={<ManagerMainView/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_MAIN_VIEW} element={<ManagerMainView/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST} element={<ManagerOrganizationChartList/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_PRIVACY_POLICY} element={<ManagerPrivacyPolicy/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_TERMS_AGREEMENT} element={<ManagerTermsAgreement/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_TERMS_CREATE} element={<ManagerTermsAgreementEdit mode={CODE.MODE_CREATE}/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_TERMS_MODIFY} element={<ManagerTermsAgreementEdit mode={CODE.MODE_MODIFY}/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_PRIVACY_CREATE} element={<ManagerPrivacyPolicyEdit mode={CODE.MODE_CREATE}/>}/>
              <Route path={URL.MANAGER_HOMEPAGE_PRIVACY_MODIFY} element={<ManagerPrivacyPolicyEdit mode={CODE.MODE_MODIFY}/>}/>

              <Route path={URL.MANAGER_ACCESS_LIST} element={<ManagerAccessList/>}/>
              <Route path={URL.MANAGER_ACCESS_CREATE} element={<ManagerAccessEdit mode={CODE.MODE_CREATE}/>}/>
              <Route path={URL.MANAGER_ACCESS_MODIFY} element={<ManagerAccessEdit mode={CODE.MODE_MODIFY}/>}/>

              <Route path={URL.MANAGER_STATISTICS} element={<ManagerStatisticsUser/>}/>
              <Route path={URL.MANAGER_STATISTICS_USER} element={<ManagerStatisticsUser/>}/>

              <Route path={URL.MessageTest} element={<MessageTest/>}/>

              <Route path={URL.COMMON_ERROR} element={<CommonError/>}/>
            </Routes>
          </WebSocketProvider>

          {
            requestUrl === "manager" ? "" :
            requestUrl === "popup" ? "" :
            requestUrl === "commonError" ? "" :  (<EgovFooterUser/>)
          }
        </div>
  );
};

export default RootRoutes;
