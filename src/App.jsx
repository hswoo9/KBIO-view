import RootRoutes from "@/routes";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

/* 퍼블 기준 */
/*
import '@/css/manager/aos.css';
import '@/css/manager/page.css';
import '@/css/manager/pretendard.css';
import '@/css/manager/reset.css';
import '@/css/manager/Rubik.css';
import '@/css/manager/swiper-bundle.min.css';
import '@/css/manager/user.css';
import '@/css/manager/admin.css';*/

function App() {
    return (
        <Router>
            <RootRoutes />
        </Router>
    )
}

export default App;
