const URL = {
  MAIN: "/", //메인페이지
  TOTAL_SEARCH : "/search",
  COMMUNITY: "/community",
  K_BIO_LABHUB: "/kBioLabHub",
  KBIO_BUSINESS_OVERVIEW: "/kbio/businessOverview",
  KBIO_LOCATION: "/kbio/location",
  KBIO_ORGANIZATION: "/kbio/organization",
  INTRODUCE: "/introduce",
  INTRODUCE_OPERATIONAL_LIST: "/insi/operationalList",
  INTRODUCE_OPERATIONAL_DETAIL: "/insi/operationaldetail",
  INTRODUCE_RELATED_LIST: "/insi/relatedList",
  INTRODUCE_RELATED_DETAIL: "/insi/relateddetail",
  //COMMON
  COMMON_POPUP : "/popup",
  COMMON_CONTENT_VIEW : "/content/view",
  COMMON_PST_NORMAL_LIST : "/pst/normal/list",
  COMMON_PST_NORMAL_DETAIL : "/pst/normal/detail",
  COMMON_PST_NORMAL_CREATE: "/pst/normal/create",
  COMMON_PST_NORMAL_MODIFY: "/pst/normal/modify",

  COMMON_PST_QNA_LIST : "/pst/qna/list",
  COMMON_PST_QNA_DETAIL : "/pst/qna/detail",
  COMMON_PST_QNA_CREATE: "/pst/qna/create",
  COMMON_PST_QNA_MODIFY: "/pst/qna/modify",

  COMMON_PST_FAQ_LIST : "/pst/faq/list",
  COMMON_PST_FAQ_DETAIL : "/pst/faq/detail",
  COMMON_PST_FAQ_CREATE: "/pst/faq/create",
  COMMON_PST_FAQ_MODIFY: "/pst/faq/modify",

  LOGIN: "/login", //로그인
  MANAGER_LOGIN: "/manager/login", //로그인
  SNS_NAVER_CB: "/login/naver/callback", //Sns Naver Callback
  SNS_KAKAO_CB: "/login/kakao/callback", //Sns Kakao Callback
  SMS_GOOGLE_CB: "/login/google/callback", //Sns Google Callback
  ERROR: "/error", //로그인

  COMMON_ERROR : "/commonError",

  FIND_ID_PSWD:"/findIdPswd", //아이디 비번찾기

  /** CONSULTING */
  CONSULTANT_LIST:"/consulting/consultantList",
  CONSULTANT_DETAIL:"/consulting/consultantDetail",
  CONSULTING_CREATE : "/consulting/create",

  DIFFICULTIES:"/diff/difficulties",
  DIFFICULTIES_CREATE:"/diff/create",

  //ABOUT
  ABOUT: "/about", //사이트소개
  ABOUT_SITE: "/about/site", // 사이트소개/소개
  ABOUT_HISTORY: "/about/history", // 사이트소개/연혁
  ABOUT_ORGANIZATION: "/about/organization", // 사이트소개/조직소개
  ABOUT_LOCATION: "/about/location", // 사이트소개/찾아오시는길

  //INTRO
  INTRO: "/intro", //정보마당
  INTRO_WORKS: "/intro/works", // 정보마당/주요사업소개
  INTRO_SERVICE: "/intro/service", // 정보마당/주요서비스소개

  //SUPPORT
  SUPPORT: "/support", // 고객지원
  SUPPORT_DOWNLOAD: "/support/download", // 고객지원/자료실
  SUPPORT_DOWNLOAD_DETAIL: "/support/download/detail", // 고객지원/자료실/상세
  SUPPORT_DOWNLOAD_CREATE: "/support/download/create", // 고객지원/자료실/등록
  SUPPORT_QNA: "/support/qna", // 고객지원/묻고답하기
  SUPPORT_QNA_DETAIL: "/support/qna/detail", // 고객지원/묻고답하기/상세
  SUPPORT_APPLY: "/support/apply", // 고객지원/서비스신청

  //INFORM
  INFORM: "/inform", // 알림마당
  INFORM_DAILY: "/inform/daily", // 알림마당/오늘의행사
  INFORM_DAILY_DETAIL: "/inform/daily/detail", // 알림마당/오늘의행사상세
  INFORM_WEEKLY: "/inform/weekly", // 알림마당/금주의행사
  INFORM_WEEKLY_DETAIL: "/inform/weekly/detail", // 알림마당/금주의행사상세
  INFORM_NOTICE: "/inform/notice", // 알림마당/공지사항
  INFORM_NOTICE_DETAIL: "/inform/notice/detail", // 알림마당/공지사항상세
  INFORM_NOTICE_CREATE: "/inform/notice/create", // 알림마당/공지사항등록
  INFORM_NOTICE_MODIFY: "/inform/notice/modify", // 알림마당/공지사항수정
  INFORM_NOTICE_REPLY: "/inform/notice/reply", // 알림마당/공지사항답글
  INFORM_GALLERY: "/inform/gallery", // 알림마당/사이트갤러리
  INFORM_GALLERY_DETAIL: "/inform/gallery/detail", // 알림마당/사이트갤러리상세
  INFORM_GALLERY_CREATE: "/inform/gallery/create", // 알림마당/사이트갤러리등록
  INFORM_GALLERY_MODIFY: "/inform/gallery/modify", // 알림마당/사이트갤러리수정
  INFORM_GALLERY_REPLY: "/inform/gallery/reply", // 알림마당/사이트갤러리답글

  //TEMPLATES
  TEMPLATES: "/templates", // 기본양식

  //ADMIN
  ADMIN: "/admin", // 사이트관리
  ADMIN_SCHEDULE: "/admin/schedule", // 사이트관리/일정관리
  ADMIN_SCHEDULE_DETAIL: "/admin/schedule/detail", // 사이트관리/일정관리상세
  ADMIN_SCHEDULE_CREATE: "/admin/schedule/create", // 사이트관리/일정관리생성
  ADMIN_SCHEDULE_MODIFY: "/admin/schedule/modify", // 사이트관리/일정관리수정

  ADMIN_BOARD: "/admin/board", // 사이트관리/게시판생성관리 목록
  ADMIN_BOARD_DETAIL: "/admin/board/detail", // 사이트관리/게시판생성관리 상세
  ADMIN_BOARD_CREATE: "/admin/board/create", // 사이트관리/게시판생성관리 등록
  ADMIN_BOARD_MODIFY: "/admin/board/modify", // 사이트관리/게시판생성관리 상세/수정

  ADMIN_USAGE: "/admin/usage", // 사이트관리/게시판사용관리 목록
  ADMIN_USAGE_DETAIL: "/admin/usage/detail", // 사이트관리/게시판사용관리 상세
  ADMIN_USAGE_CREATE: "/admin/usage/create", // 사이트관리/게시판사용관리 등록
  ADMIN_USAGE_MODIFY: "/admin/usage/modify", // 사이트관리/게시판사용관리 상세/수정

  ADMIN_NOTICE: "/admin/notice", // 사이트관리/공지사항관리 목록
  ADMIN_NOTICE_DETAIL: "/admin/notice/detail", // 사이트관리/공지사항관리 상세
  ADMIN_NOTICE_CREATE: "/admin/notice/create", // 사이트관리/공지사항관리 등록
  ADMIN_NOTICE_MODIFY: "/admin/notice/modify", // 사이트관리/공지사항관리 수정
  ADMIN_NOTICE_REPLY: "/admin/notice/reply", // 사이트관리/공지사항관리 답글 등록

  ADMIN_GALLERY: "/admin/gallery", // 사이트관리/사이트갤러리관리
  ADMIN_GALLERY_DETAIL: "/admin/gallery/detail", // 사이트관리/사이트갤러리관리 상세
  ADMIN_GALLERY_CREATE: "/admin/gallery/create", // 사이트관리/사이트갤러리관리 등록
  ADMIN_GALLERY_MODIFY: "/admin/gallery/modify", // 사이트관리/사이트갤러리관리 수정
  ADMIN_GALLERY_REPLY: "/admin/gallery/reply", // 사이트관리/사이트갤러리관리 답글 등록

  ADMIN_MANAGER: "/admin/manager", // 사이트관리/사이트관리자 암호변경 기능
  ADMIN_MEMBERS: "/admin/members", // 사이트관리/회원관리 목록기능
  ADMIN_MEMBERS_DETAIL: "/admin/members/detail", // 사이트관리/회원관리 상세
  ADMIN_MEMBERS_CREATE: "/admin/members/create", // 사이트관리/회원관리 등록
  ADMIN_MEMBERS_MODIFY: "/admin/members/modify", // 사이트관리/회원관리 상세/수정
  
  //메뉴 관련
  ADMIN_MENU: "/admin/menu",

  //관리자 페이지
  MANAGER: "/manager/main",
  MANAGER_NORMAL_MEMBER: "/manager/all/normalMember",
  MANAGER_APPROVAL_MEMBER: "/manager/approval/approvalMember",
  MANAGER_REJECT_MEMBER: "/manager/reject/rejetcMember",
  MANAGER_CANCEL_MEMBER: "/manager/cancel/cancelMember",
  MANAGER_STOP_MEMBER: "/manager/stop/stopMember",
  MANAGER_WAIT_MEMBER: "/manager/wait/waitMember",
  MANAGER_RESIDENT_COMPANY: "/manager/residentCompany",
  MANAGER_RELATED_COMPANY: "/manager/relatedMember",
  MANAGER_NONRESIDENT_COMPANY: "/manager/nonresidentMember",
  MANAGER_CONSULTENT: "/manager/consultent",

  /* 코드 관리 시작 */
  MANAGER_CODE_GROUP: "/manager/codeGroup",
  MANAGER_CODE_GROUP_CREATE: "/manager/codeGroup/create",
  MANAGER_CODE_GROUP_MODIFY: "/manager/codeGroup/modify",

  MANAGER_CODE: "/manager/code",
  MANAGER_CODE_CREATE: "/manager/code/create",
  MANAGER_CODE_MODIFY: "/manager/code/modify",
  /* 코드 관리 종료 */

  /* 배너팝업관리 시작 */
  MANAGER_BANNER_POPUP: "/manager/bannerPopup",
  MANAGER_BANNER_LIST: "/manager/banner/list",
  MANAGER_BANNER_CREATE: "/manager/banner/create",
  MANAGER_BANNER_MODIFY: "/manager/banner/modify",
  MANAGER_POPUP_LIST: "/manager/popup/list",
  MANAGER_POPUP_CREATE: "/manager/popup/create",
  MANAGER_POPUP_MODIFY: "/manager/popup/modify",
  MANAGER_IMAGES_POPUP: "/popupView/images",

  /* 배너팝업관리 종료 */

  MANAGER_MENU_MANAGEMENT: "/manager/menuManagement",

  MANAGER_MENU_CONTENT_MANAGEMENT: "/manager/menuContentManagement",

  MANAGER_MENU_AUTHORITY: "/manager/menuAuthority",
  MANAGER_AUTHORITY_GROUP_USERS: "/manager/groupUsers",

  /** 게시판 관리 시작 */
  MANAGER_BBS_LIST:"/manager/bbs/list",
  MANAGER_BBS_CREATE: "/manager/bbs/create",
  MANAGER_BBS_MODIFY: "/manager/bbs/modify",

  MANAGER_BBS_LIST2:"/manager/bbs/pst/bbsList",
  MANAGER_PST_NORMAL_LIST:"/manager/bbs/pst/normal/list",
  MANAGER_PST_NORMAL_DETAIL: "/manager/bbs/pst/normal/detail",
  MANAGER_PST_NORMAL_CREATE: "/manager/bbs/pst/normal/create",
  MANAGER_PST_NORMAL_MODIFY: "/manager/bbs/pst/normal/modify",

  MANAGER_PST_QNA_LIST:"/manager/bbs/pst/qna/list",
  MANAGER_PST_QNA_DETAIL: "/manager/bbs/pst/qna/detail",
  MANAGER_PST_QNA_CREATE: "/manager/bbs/pst/qna/create",
  MANAGER_PST_QNA_MODIFY: "/manager/bbs/pst/qna/modify",

  MANAGER_PST_FAQ_LIST:"/manager/bbs/pst/faq/list",
  MANAGER_PST_FAQ_DETAIL: "/manager/bbs/pst/faq/detail",
  MANAGER_PST_FAQ_CREATE: "/manager/bbs/pst/faq/create",
  MANAGER_PST_FAQ_MODIFY: "/manager/bbs/pst/faq/modify",
  /** 게시판 관리 종료 */

  MANAGER_NORMAL_MEMBER_MODIFY: "/manager/normal/member/modfiy",
  MANAGER_NORMAL_MEMBER_CREATE: "/manager/normal/member/create",

  MANAGER_APPROVAL_MEMBER_MODIFY: "/manager/approval/member/modfiy",
  MANAGER_REJECT_MEMBER_MODIFY: "/manager/reject/member/modfiy",
  MANAGER_STOP_MEMBER_MODIFY: "/manager/stop/member/modfiy",
  MANAGER_WAIT_MEMBER_MODIFY: "/manager/wait/member/modfiy",

  MANAGER_BBS_AUTHORITY_MANAGEMENT:"/manager/bbsAuthorityManagement",

  RESIDENT_COMPANY_CREATE:"/manager/residentCompanyCreate", //회원관리/입주기업 /입주기업 등록
  RESIDENT_COMPANY_MODIFY:"/manager/residentCompanyModify",

  RELATED_COMPANY_CREATE:"/manager/relatedCompanyCreate",
  RELATED_COMPANY_MODIFY:"/manager/relatedCompanyModify",

  //MYPAGE
  MYPAGE_MODIFY: "/mypage/modify", // 고객지원/마이페이지/회원 수정
  MYPAGE_CREATE: "/mypage/create", // 고객지원/마이페이지/회원 등록
  TERMS_AGREEMENT: "/mypage/agreement", //회원가입시 동의
  IDENTITY_VERIFICATION: "/mypage/identity", // 회원가입시 본인인증
  SIGNUP_CHOICE: "/mypage/signupchoice", // 회원가입시 회원방식 선택
  COMPLETE_MEMBER: "/mypage/completemember", //회원가입 신청 완료

  MEMBER_MYPAGE_MODIFY : "/member/mypage/modify",
  MEMBER_MYPAGE_CONSULTING : "/member/mypage/consulting",
  MEMBER_MYPAGE_CONSULTING_POPUP : "/popup/consulting",
  MEMBER_MYPAGE_CONSULTING_CREATE_POPUP : "/popup/consulting/create",
  MEMBER_MYPAGE_CONSULTING_STAIS_POPUP : "/popup/consulting/satis",
  MEMBER_MYPAGE_CONSULTING_DETAIL : "/member/mypage/consulting/detail",
  MEMBER_MYPAGE_SIMPLE : "/member/mypage/simple",
  MEMBER_MYPAGE_SIMPLE_DETAIL : "/member/mypage/simple/detail",
  MEMBER_MYPAGE_SIMPLE_POPUP : "/popup/simple",
  MEMBER_MYPAGE_SIMPLE_CREATE_POPUP: "/popup/simple/create",
  MEMBER_MYPAGE_SIMPLE_SATIS_POPUP: "/popup/simple/satis",
  MEMBER_MYPAGE_DIFFICULTIES : "/member/mypage/difficulties",
  MEMBER_MYPAGE_DIFFICULTIES_DETAIL : "/member/mypage/difficulties/detail",
  MEMBER_MYPAGE_DIFFICULTIES_MODIFY : "/member/mypage/difficulties/modify",
  MEMBER_MYPAGE_CANCEL : "/member/mypage/cancel",
  MEMBER_MYPAGE_IDENTITY : "/member/mypage/identity",

  MANAGER_CMS: "/manager/cms",

  //운영지원
  MANAGER_OPERATIONAL_SUPPORT: "/manager/operationalSupport", //운영지원/입주기업관리
  MANAGER_RELATED_MANAGER: "/manager/relatedMemberManage",
  MANAGER_RESIDENT_MANAGER: "/manager/residentMemberManage", //운영지원/입주기업관리/관리자설정
  MANAGER_RELATED_MEMBER : "/manager/related/member",
  MANAGER_RESIDENT_MEMBER : "/manager/residentMember", //운영지원/입주기업관리/직원목록
  MANAGER_RESIDENT_MEMBER_EDIT : "/manager/residentMemberEdit",  //운영지원/입주기업관리/직원목록/직원상세
  MANAGER_RELATED_MEMBER_EDIT : "/manager/relatedMemberEdit",
  MANAGER_RELATED_ORGANIZATION : "/manager/relatedOrganization", //운영지원/유관기관관리
  MANAGER_DIFFICULTIES : "/manager/difficulties", //운영지원/애로사항관리
  MANAGER_DIFFICULTIES_MODIFY : "/manager/difficulties/modifiy", //운영지원/애로사항관리 답변

  //컨설팅지원
  MANAGER_CONSULTING_EXPERT: "/manager/expert",
  MANAGER_CONSULTING_MATCHING: "/manager/matching",
  MANAGER_SIMPLE_CONSULTING: "/manager/simpleconsulting",
  MANAGER_CONSULTING_DETAIL: "/manager/consultingDetail",
  MANAGER_SIMPLE_CONSULTING_DETAIL: "/manager/simpleconsultingDetail",
  MANAGER_MEMBER: "/manager/member",
  MANAGER_MEMBER_ALL_MEMBER: "/manager/allMember",

  MANAGER_HOMEPAGE: "/manager/homepage",
  MANAGER_HOMEPAGE_MAIN_VIEW: "/manager/mainView",
  MANAGER_HOMEPAGE_ORGANIZATION_CHART_LIST: "/manager/organizationChart/list",
  MANAGER_HOMEPAGE_ORGANIZATION_CHART_CREATE: "/manager/organizationChart/create",
  MANAGER_HOMEPAGE_ORGANIZATION_CHART_MODIFY: "/manager/organizationChart/modify",
  MANAGER_HOMEPAGE_PRIVACY_POLICY: "/manager/privacyPolicy",
  MANAGER_HOMEPAGE_PRIVACY_CREATE: "/manager/privacyPolicy/create",
  MANAGER_HOMEPAGE_PRIVACY_MODIFY: "/manager/privacyPolicy/modify",
  MANAGER_HOMEPAGE_TERMS_AGREEMENT: "/manager/termsAgreement",
  MANAGER_HOMEPAGE_TERMS_CREATE: "/manager/termAgreement/create",
  MANAGER_HOMEPAGE_TERMS_MODIFY: "/manager/termAgreement/modify",
  
  MANAGER_ACCESS_LIST: "/manager/access/list",
  MANAGER_ACCESS_CREATE: "/manager/access/create",
  MANAGER_ACCESS_MODIFY: "/manager/access/modify",

  MANAGER_STATISTICS: "/manager/statistics",
  MANAGER_STATISTICS_USER: "/manager/statistics/user",
  MANAGER_STATISTICS_ACCESS: "/manager/statistics/access",
  MANAGER_STATISTICS_BOARD: "/manager/statistics/board",
  MANAGER_STATISTICS_FILE: "/manager/statistics/file",
  MANAGER_STATISTICS_USER_ANALYZE: "/manager/statistics/userAnalyze",
  MANAGER_STATISTICS_INFLOW_ROUTE: "/manager/statistics/inflowRoute",
  MANAGER_STATISTICS_USER_EQUI: "/manager/statistics/userEqui",

  MessageTest: "/messageTest"
};

// eslint-disable-next-line react-refresh/only-export-components
export default URL;
