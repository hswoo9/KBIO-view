import { NavLink } from "react-router-dom";
import URL from "@/constants/url";

function EgovLeftNav() {
    return (
        <div className="nav">
            <div className="inner">
                <h2>게시판관리</h2>
                <ul className="menu4">
                    <li>
                        <NavLink
                            to={URL.MANAGER_BBS_LIST}
                            className={({ isActive }) => (isActive ? "cur" : "")}
                        >
                            게시판관리
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={URL.MANAGER_BBS_AUTHORITY_MANAGEMENT}
                            className={({ isActive }) => (isActive ? "cur" : "")}
                        >
                            게시판권한관리
                        </NavLink>
                    </li>

                </ul>
            </div>
        </div>
    );
}

export default EgovLeftNav;
