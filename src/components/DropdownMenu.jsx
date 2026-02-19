import React, { useState } from "react";
import { TopMenuData } from './TopMenuData';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import '../css/topmenu.css';

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    return (
        <div className="menu-dropdown-container">
            <div
                className="menu-dropdown-trigger"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => {
                    setIsOpen(false);
                    setActiveMenu(null);
                    setActiveSubMenu(null);
                }}
            >
                <a href="/app/outlet" className="outlet-link">
                    아울렛 {'\u00A0'} {isOpen ? <RiArrowUpSLine size={12} /> : <RiArrowDownSLine size={12} />}
                </a>

                {isOpen && (
                    <div className="menu-dropdown">
                        {/* 1뎁스 컬럼 */}
                        <div className="depth-column">
                            {TopMenuData.map((category, index) => (
                                <div 
                                    key={index} 
                                    className={`menu-item ${activeMenu === category.label ? 'active' : ''}`}
                                    onMouseEnter={() => {
                                        setActiveMenu(category.label);
                                        setActiveSubMenu(null);
                                    }}
                                >
                                    <a href={category.href} className="menu-link">
                                        {category.label}
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* 2뎁스 컬럼 - activeMenu의 categories가 있을 때만 렌더링 */}
                        {activeMenu && TopMenuData.find(cat => cat.label === activeMenu)?.categories && (
                            <div className="depth-column">
                                {TopMenuData.find(cat => cat.label === activeMenu)?.categories?.map((subCategory, index) => (
                                    <div 
                                        key={index} 
                                        className={`menu-item ${activeSubMenu === subCategory.label ? 'active' : ''}`}
                                        onMouseEnter={() => setActiveSubMenu(subCategory.label)}
                                    >
                                        <a href={subCategory.href} className="menu-link">
                                            {subCategory.label}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 3뎁스 컬럼 - activeSubMenu의 categories가 있을 때만 렌더링 */}
                        {activeSubMenu && 
                         TopMenuData.find(cat => cat.label === activeMenu)?.categories
                                   ?.find(sub => sub.label === activeSubMenu)?.categories && (
                            <div className="depth-column">
                                {TopMenuData.find(cat => cat.label === activeMenu)?.categories
                                    ?.find(sub => sub.label === activeSubMenu)?.categories?.map((subSubCategory, index) => (
                                    <div key={index} className="menu-item">
                                        <a href={subSubCategory.href} className="menu-link">
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

export default DropdownMenu;