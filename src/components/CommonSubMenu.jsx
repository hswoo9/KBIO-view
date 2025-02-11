import {getMenu } from "@/components/CommonComponents";
import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import { getSessionItem } from "@/utils/storage";

function EgovSubMenu() {
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const userSn = getSessionItem("userSn");

    const [menuList, setMenuList] = useState([]);
    const hoverRef = useRef(null);
    const handleMouseOver = (e, index) => {
        if(e.target === e.currentTarget){
            const element = e.currentTarget;
            const parentElement = element.parentElement;
            if(parentElement && hoverRef.current){
                const parentRect = parentElement.getBoundingClientRect();
                hoverRef.current.style.width = `${parentRect.width}px`;
                hoverRef.current.style.height = `${parentRect.height}px`;
                hoverRef.current.style.left = `${parentRect.left - 30}px`;
                hoverRef.current.style.top = `0px`;
                hoverRef.current.style.opacity = `1`;
            }
        }
    }
    useEffect(() => {
    const menuSn = location.state?.menuSn || null;
    getMenu(menuSn, 1, userSn).then((data) => {
      let dataList = [];
      if(data != null){
        data.forEach(function(item, index){
          if (index === 0) dataList = [];
          dataList.push(
              <li key={item.menuSn}>
                <NavLink
                    to={item.menuPathNm}
                    state={{
                      bbsSn: item.bbsSn,
                      menuNmPath: item.menuNmPath
                    }}
                    onMouseOver={(e) => handleMouseOver(e, index)}
                >
                  <span>{item.menuNm}</span>
                </NavLink>
              </li>
          )
        });
        setMenuList(dataList);
      }
    });
    }, []);

    return (
      <div className="tabBox type1" data-aos="fade-up" data-aos-duration="1500">
        <div className="bg hover" ref={hoverRef}></div>
        <ul className="list">
          {menuList}
        </ul>
      </div>
    );
}

export default EgovSubMenu;
