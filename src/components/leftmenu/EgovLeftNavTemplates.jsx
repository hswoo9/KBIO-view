import { NavLink } from "react-router-dom";
import URL from "@/constants/url";

function EgovLeftNavInform() {
  return (
    <div className="nav">
      <div className="inner">
        <h2>공통양식</h2>
        <ul className="menu4">
          <li>
            <NavLink
              to={URL.TEMPLATES}
              className={({ isActive }) => (isActive ? "cur" : "")}
            >
              공통양식
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EgovLeftNavInform;
