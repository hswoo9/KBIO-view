import {getMenu } from "@/components/CommonComponents";
import React, {useState, useEffect, useCallback, useRef} from "react";
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import { getSessionItem } from "@/utils/storage";
import AOS from "aos";
function EgovSubMenu() {
    const location = useLocation();
    const sessionUser = getSessionItem("loginUser");
    const userSn = getSessionItem("userSn");
    const [menuList, setMenuList] = useState([]);
    const hoverRef = useRef(null);
    const handleMouseOver = (e, index) => {
        const closestParentDiv = document.querySelector(".subMenuDiv");
        const closestParentDivRect = closestParentDiv.getBoundingClientRect();
        if(e.target === e.currentTarget) {
            const element = e.currentTarget;
            if (element) {
                const elementRect = element.getBoundingClientRect();
                hoverRef.current.style.width = `${elementRect.width}px`;
                hoverRef.current.style.height = `${elementRect.height}px`;
                hoverRef.current.style.left = `${elementRect.left - closestParentDivRect.left}px`;
                hoverRef.current.style.top = `0px`;
                hoverRef.current.style.opacity = `1`;
            }
        }else{
            const closestElement = e.target.closest("li");
            if (closestElement) {
                const closestElementRect = closestElement.getBoundingClientRect();
                hoverRef.current.style.width = `${closestElementRect.width}px`;
                hoverRef.current.style.height = `${closestElementRect.height}px`;
                hoverRef.current.style.left = `${closestElementRect.left - closestParentDivRect.left}px`;
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
                console.log("=======================================");
                console.log(location.state?.menuSn);
                console.log(item.menuSn);
                console.log("=======================================");
              if (index === 0) dataList = [];
              dataList.push(
                  <li key={item.menuSn} onMouseOver={(e) => handleMouseOver(e, index)}
                      className={location.state?.thisMenuSn == item.menuSn ? "active" : ""}
                  >
                    <NavLink
                        to={item.menuPathNm}
                        state={{
                            menuSn: item.upperMenuSn,
                            thisMenuSn: item.menuSn,
                            bbsSn: item.bbsSn,
                            menuNmPath: item.menuNmPath
                        }}
                    >
                      <span>{item.menuNm}</span>
                    </NavLink>
                  </li>
              )
            });
            setMenuList(dataList);
          }
        });
        AOS.init();

    }, []);

    return (
      <div className="tabBox type1 subMenuDiv" data-aos="fade-up" data-aos-duration="1500">
        <div className="bg hover" ref={hoverRef}></div>
        <ul className="list">
          {menuList}
        </ul>
      </div>
    );
}

export default EgovSubMenu;
