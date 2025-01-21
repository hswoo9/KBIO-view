import RootRoutes from './routes';
import React from 'react';


/* 퍼블 기준 */
/*import './css/manager/aos.css';
import './css/manager/page.css';
import './css/manager/pretendard.css';
import './css/manager/reset.css';
import './css/manager/Rubik.css';
import './css/manager/swiper-bundle.min.css';
import './css/manager/user.css';
import './css/manager/admin.css';*/
function App() {
    return (
        <RootRoutes />
    )
}




console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.REACT_APP_EGOV_CONTEXT_URL", process.env.REACT_APP_EGOV_CONTEXT_URL);

export default App;
