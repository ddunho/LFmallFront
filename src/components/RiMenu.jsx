import React, { useState } from "react";
import { TopMenuData } from "./TopMenuData";
import "../css/rimenu.css";

const RiMenu = ({ isOpen, onMenuStateChange }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleMouseEnter = () => {
    onMenuStateChange(true);
    setActiveMenu(null);
    setActiveSubMenu(null);
  };

  const handleMouseLeave = () => {
    onMenuStateChange(false);
    setActiveMenu(null);
    setActiveSubMenu(null);
  };

  return (
    <div className="rimenu-dropdown-container">
      <div
        className="rimenu-dropdown-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isOpen && (
          <div className="rimenu-dropdown">
            {/* 1뎁스 컬럼 */}
            <div className="rimenu-depth-column">
              {TopMenuData.map((category, index) => (
                <div
                  key={index}
                  className={`rimenu-menu-item ${activeMenu === category.label ? "active" : ""}`}
                  onMouseEnter={() => {
                    setActiveMenu(category.label);
                    setActiveSubMenu(null);
                  }}
                >
                  <a href={category.href} className="rimenu-menu-link">
                    {category.label}
                  </a>
                </div>
              ))}
            </div>

            {/* 2뎁스 컬럼 - activeMenu의 categories가 있을 때만 렌더링 */}
            {activeMenu &&
              TopMenuData.find((cat) => cat.label === activeMenu)
                ?.categories && (
                <div className="rimenu-depth-column">
                  {TopMenuData.find(
                    (cat) => cat.label === activeMenu
                  )?.categories?.map((subCategory, index) => (
                    <div
                      key={index}
                      className={`rimenu-menu-item ${activeSubMenu === subCategory.label ? "active" : ""}`}
                      onMouseEnter={() => setActiveSubMenu(subCategory.label)}
                    >
                      <a href={subCategory.href} className="rimenu-menu-link">
                        {subCategory.label}
                      </a>
                    </div>
                  ))}
                </div>
              )}

            {/* 3뎁스 컬럼 - activeSubMenu의 categories가 있을 때만 렌더링 */}
            {activeSubMenu &&
              TopMenuData.find(
                (cat) => cat.label === activeMenu
              )?.categories?.find((sub) => sub.label === activeSubMenu)
                ?.categories && (
                <div className="rimenu-depth-column">
                  {TopMenuData.find((cat) => cat.label === activeMenu)
                    ?.categories?.find((sub) => sub.label === activeSubMenu)
                    ?.categories?.map((subSubCategory, index) => (
                      <div key={index} className="rimenu-menu-item">
                        <a
                          href={subSubCategory.href}
                          className="rimenu-menu-link"
                        >
                          {subSubCategory.label}
                        </a>
                      </div>
                    ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiMenu;
