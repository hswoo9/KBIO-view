import { NavLink } from "react-router-dom";
import URL from "@/constants/url";

function EgovLeftNav() {
  return (
    <div className="nav">
      <div className="inner">
        <h2>회원관리</h2>
        <ul className="menu4">
          <li>
            <NavLink
              to={URL.MANAGER_NORMAL_MEMBER}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              일반회원
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.MANAGER_RESIDENT_COMPANY}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              입주기업
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default EgovLeftNav;
