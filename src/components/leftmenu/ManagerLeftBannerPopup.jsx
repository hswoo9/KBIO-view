import { NavLink } from "react-router-dom";
import URL from "@/constants/url";

function EgovLeftNav() {
  return (
    <div className="nav">
      <div className="inner">
        <h2>배너팝업관리</h2>
        <ul className="menu4">
          <li>
            <NavLink
                to={URL.MANAGER_BANNER_LIST}
                className={({isActive}) => (isActive ? "cur" : "")}
            >
              배너관리
            </NavLink>
            <NavLink
                to={URL.MANAGER_POPUP_LIST}
                className={({isActive}) => (isActive ? "cur" : "")}
            >
              팝업관리
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EgovLeftNav;
