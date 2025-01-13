import { NavLink } from "react-router-dom";
import URL from "@/constants/url";

function EgovLeftNav() {
  return (
    <div className="nav">
      <div className="inner">
        <h2>메뉴관리</h2>
        <ul className="menu4">
          <li>
            <NavLink
              to={URL.MANAGER_MENU_MANAGEMENT}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              메뉴관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={URL.MANAGER}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              메뉴권한관리
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default EgovLeftNav;
