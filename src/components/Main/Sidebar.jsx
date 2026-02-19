import { useState } from "react";
import "../../css/Sidebar.css";
import search_icon from "../../pic/icon/search_icon.png";
import dropdown_open_icon from "../../pic/icon/dropdown_open_icon.png";
import dropdown_close_icon from "../../pic/icon/dropdown_close_icon.png";

// 선택된 필터들을 박스 형태로 표시하는 컴포넌트 (SearchView로 이동)
// FilterTags 컴포넌트는 SearchView에서 사용

// 추가 검색어 입력 컴포넌트
const AdditionalSearch = ({ searchOption, setSearchOption }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();

    if (trimmedValue && !searchOption.addSearch.includes(trimmedValue)) {
      setSearchOption((prev) => ({
        ...prev,
        addSearch: [...prev.addSearch, trimmedValue],
      }));
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit(e);
    }
  };

  return (
    <div className="sb-searchbar">
      <input
        className="inputSearch"
        placeholder="결과 내 재검색"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className="buttonSearch"
        type="button"
        onClick={handleInputSubmit}
      >
        <img src={search_icon} />
      </button>
    </div>
  );
};

const DropdownMenu = ({
  name,
  menuList,
  isOpen,
  toggle,
  searchOption,
  setSearchOption,
}) => {
  const onClickColor = (color) => {
    setSearchOption((prev) => {
      const isSelected = prev.color.includes(color);
      return {
        ...prev,
        color: isSelected
          ? prev.color.filter((c) => c !== color)
          : [...prev.color, color],
      };
    });
  };

  const onClickSize = (size) => {
    setSearchOption((prev) => {
      const isSelected = prev.size.includes(size);
      return {
        ...prev,
        size: isSelected
          ? prev.size.filter((s) => s !== size)
          : [...prev.size, size],
      };
    });
  };

  const onClickBrand = (brand) => {
    setSearchOption((prev) => {
      const isSelected = prev.brand_name.includes(brand);
      return {
        ...prev,
        brand_name: isSelected
          ? prev.brand_name.filter((b) => b !== brand)
          : [...prev.brand_name, brand],
      };
    });
  };

  const handleCheckboxChange = (e, item) => {
    if (name === "브랜드") {
      onClickBrand(item);
    } else if (name === "사이즈") {
      onClickSize(item);
    } else if (name === "색상") {
      onClickColor(item);
    }
  };

  // 색상 박스 클릭 시에도 체크박스와 동일한 동작
  const handleColorBoxClick = (color) => {
    onClickColor(color);
  };

  return (
    <div className="sb-dropdown-common">
      <a className="sb-dropdown-menu" href="#" onClick={(e) => toggle(e, name)}>
        <div>{name}</div>
        <img src={isOpen ? dropdown_open_icon : dropdown_close_icon} />
      </a>
      {isOpen && (
        <div className={`dropdown-box ${name === "색상" ? "color-box" : ""}`}>
          {name === "색상"
            ? menuList.filter(color => color !== 'X').map((color, index) => (
                <div key={index} className="color-option-item">
                  <input
                    type="checkbox"
                    checked={searchOption.color.includes(color)}
                    onChange={(e) => handleCheckboxChange(e, color)}
                    id={`color-${index}`}
                  />
                  <div className="checkColorClick">
                    <div
                      onClick={() => handleColorBoxClick(color)}
                      className={`checkColor ${
                        searchOption.color.includes(color) ? "selected" : ""
                      }`}
                      style={{
                        backgroundColor: color,
                      }}
                      title={`색상: ${color}`}
                    />
                    <label htmlFor={`color-${index}`} className="color-label">
                      {color}
                    </label>
                  </div>
                </div>
              ))
            : menuList.map((item, index) => (
                <div key={index} className="inputCheck">
                  <input
                    type="checkbox"
                    checked={
                      name === "브랜드"
                        ? searchOption.brand_name.includes(item)
                        : name === "사이즈"
                          ? searchOption.size.includes(item)
                          : false
                    }
                    onChange={(e) => handleCheckboxChange(e, item)}
                    id={`${name}-${index}`}
                  />
                  <label htmlFor={`${name}-${index}`}>{item}</label>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({
  searchOption,
  setSearchOption,
  detailOptionForm,
  setDetailOptionForm,
}) {
  // 드롭다운 이름과 상태 키 매핑
  const dropdownKeyMap = {
    "혜택/배송": "delivery",
    브랜드: "brand_name",
    사이즈: "size",
    색상: "color",
  };

  // 각 드롭다운 메뉴의 열림/닫힘 상태를 객체로 관리
  const [openDropdowns, setOpenDropdowns] = useState({
    delivery: false,
    brand_name: false,
    size: false,
    color: false,
  });

  const toggleDropdown = (e, name) => {
    e.preventDefault();
    const key = dropdownKeyMap[name]; // 드롭다운 이름을 상태 키로 변환
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key], // 해당 드롭다운의 상태만 토글
    }));
  };

  const deliveryList = ["LF슝배송", "무료배송"];

  return (
    <div className="sidebar">
      {/* 추가 검색어 입력 */}
      <AdditionalSearch
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />

      <div className="searchFilter">
        <div className="inputCheck">
          <input type="checkbox" />
          <div>시즌 (345,367)</div>
        </div>
        <div className="inputCheck">
          <input type="checkbox" />
          <div>아울렛 (68,190)</div>
        </div>
      </div>

      <DropdownMenu
        name="혜택/배송"
        menuList={deliveryList}
        isOpen={openDropdowns.delivery}
        toggle={toggleDropdown}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />

      <DropdownMenu
        name="브랜드"
        menuList={detailOptionForm.brand_name}
        isOpen={openDropdowns.brand_name}
        toggle={toggleDropdown}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />

      <DropdownMenu
        name="사이즈"
        menuList={detailOptionForm.size}
        isOpen={openDropdowns.size}
        toggle={toggleDropdown}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />

      <DropdownMenu
        name="색상"
        menuList={detailOptionForm.color}
        isOpen={openDropdowns.color}
        toggle={toggleDropdown}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />
    </div>
  );
}
