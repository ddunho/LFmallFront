import { useState } from "react";
import "../css/searchbar.css";
import { useNavigate } from 'react-router-dom';


const SearchBar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  console.log( ">>>>", search);

  const onChangeSearchInput = (e) => {
    setSearch(e.target.value);
  };

  const onClickSearchBtn = (e) =>{
    if (search.trim()) { 
      e.preventDefault();
      document.activeElement.blur();
      navigate(`/app/search/result/${search}`);
    }
  }

  return (
    <div className="tm-searchbar">
      <form>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={onChangeSearchInput}
          value={search}
        />
        <button onClick={onClickSearchBtn}>검색</button>

      </form>

      {isFocus && (
        <div className="tm-search-layer">
          <div className="tm-search-section">
            <p className="title">최근 검색어</p>
            <p className="desc">로그인 후 확인하실 수 있습니다.</p>
          </div>

          <div className="tm-search-section">
            <p className="title">
              인기 검색어 <span>2025.08.22 기준</span>
            </p>
            <ul>
              <li>
                <a href="/">#브랜드 페스타</a>
              </li>
              <li>
                <a href="/">#여름 원피스</a>
              </li>
              <li>
                <a href="/">#골프웨어</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
