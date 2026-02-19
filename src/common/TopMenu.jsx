import { useEffect, useState, useRef } from "react";
import QrCode from "../components/QrCode";
import SearchBar from "../components/SearchBar";
import "../css/topmenu.css";
import { RiMenuLine } from "react-icons/ri";
import DropdownMenu from "../components/DropdownMenu";
import RiMenu from "../components/RiMenu";
import { useAuth } from "../AuthContext";
import { useNavigate } from 'react-router-dom';
import WatchedList from '../components/WatchedList';

const TopMenu = () => {
  const [showQr, setShowQr] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const { member, logout, isLogin } = useAuth();
  const [showWatched, setShowWatched] = useState(false);
  const navigate = useNavigate();
  
  // ref를 사용하여 전체 드롭다운 영역을 참조
  const watchedDropdownRef = useRef(null);

  const onClickLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const handleOnClickRecentProduct = (e) => {
    e.preventDefault();
    // 클릭시 토글 동작으로 변경
    setShowWatched(!showWatched);
  };

  // 드롭다운 영역 밖 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (watchedDropdownRef.current && !watchedDropdownRef.current.contains(event.target)) {
        setShowWatched(false);
      }
    };

    if (showWatched) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWatched]);

  // 마우스 이벤트 핸들러들
  const handleMouseEnter = () => {
    setShowWatched(true);
  };

  const handleMouseLeave = (e) => {
    // 마우스가 드롭다운 영역 전체를 벗어날 때만 닫기
    const rect = watchedDropdownRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      const isInsideDropdown = 
        clientX >= rect.left && 
        clientX <= rect.right && 
        clientY >= rect.top && 
        clientY <= rect.bottom;
      
      if (!isInsideDropdown) {
        setShowWatched(false);
      }
    }
  };

  return (
    <header className="tm-header">
      <div className="tm-header-inner">
        <h1 className="tm-logo">
          <a href="/app/menu/0">
            <img
              src="https://nimg.lfmall.co.kr/speed/src/https://img.lfmall.co.kr/file/WAS/apps/2024/pfront/logo/lf_logo_pc.svg/dims/format/avif;fallback=webp/optimize"
              alt="LFmall Logo"
            />
          </a>
        </h1>

        {/* 가운데: 검색 */}
        <div className="tm-search">
          <SearchBar />
        </div>

        {/* 우측: 유틸/마이영역 */}
        <nav className="tm-utilities">
          <div className="tm-util-group">
            {isLogin ? (
              <>
                <a className="tm-util">
                  <span>{member?.nickname}님</span>
                </a>
                <a className="tm-util" onClick={onClickLogout}>
                  <span>로그아웃</span>
                </a>
              </>
            ) : (
              <>
                <a className="tm-util" href="/app/login">
                  <span>로그인</span>
                </a>
                <a className="tm-util" href="/app/signup">
                  <span>회원가입</span>
                </a>
              </>
            )}

            <div className="tm-mypage">
              <a className="tm-util" href="/app/claim/orderList">
                <span>마이페이지</span>
              </a>
              <div className="tm-mypage-menu">
                <a href="/app/claim/orderList">주문/배송 내역</a>
                <a href="/app/claim/orderClaim">취소/반품/교환 내역</a>
                <a href="/app/">실시간 채팅문의</a>
                <a href="/app/mypage/coupon/usable/list">쿠폰 조회</a>
              </div>
            </div>

            <a className="tm-util" href="/app/cart">
              <span>쇼핑백</span>
            </a>
          </div>

          <div className="tm-util-group app-download"></div>

          <div
            className="tm-app"
            onMouseEnter={() => setShowQr(true)}
            onMouseLeave={() => setShowQr(false)}
          >
            <button className="tm-app-btn" type="button">
              앱 다운로드
            </button>
            {showQr && (
              <div className="tm-app-popover">
                <QrCode />
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* 1뎁스 카테고리 바 */}
      <div className="tm-gnb">
        <nav className="tm-gnb-inner">
          <div className="tm-gnb-all-wrapper">
            <button
              className="tm-gnb-all"
              type="button"
              onMouseEnter={() => {
                setShowAllMenu(true);
              }}
              onMouseLeave={() => {
                setShowAllMenu(false);
              }}
            >
              <RiMenuLine />
            </button>
            <RiMenu isOpen={showAllMenu} onMenuStateChange={setShowAllMenu} />
          </div>
          <a href="/app/menu/brand">브랜드</a>
          <a href="/app/menu/1">여성</a>
          <a href="/app/menu/2">남성</a>
          <a href="/app/menu/3">잡화/슈즈</a>
          <a href="/app/menu/best">베스트</a>
          <a href="/app/menu/promo">기획전/혜택</a>
          <a href="/app/menu/5">골프/스포츠</a>
          <DropdownMenu />
          <a href="/app/menu/gift">선물관</a>
          
          {/* 최근 본 상품 드롭다운 - 수정된 부분 */}
          <div 
            ref={watchedDropdownRef}
            className="tm-watched-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              href="#" 
              onClick={handleOnClickRecentProduct}
              className="tm-watched-link"
            >
              최근 본 상품
            </button>
            {showWatched && (
              <div className="tm-watched-dropdown">
                <WatchedList />
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default TopMenu;