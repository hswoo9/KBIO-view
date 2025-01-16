import { NavLink } from "react-router-dom";
import URL from "@/constants/url";

function EgovLeftNav() {
  return (
    <div className="nav">
      <div className="inner">
        <h2>코드관리</h2>
        <ul className="menu4">
          <li>
            <NavLink
                to={URL.MANAGER_CODE_GROUP}
                className={({isActive}) => (isActive ? "cur" : "")}
            >
              코드관리
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EgovLeftNav;
