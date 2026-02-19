import { useState } from 'react';
import MemberLogin from '../components/MemberLogin';
import NoMember from '../components/NoMember';
import '../css/loginview.css'; // CSS 파일 import

const LoginView = () => {
  const [isMember, setIsMember] = useState(true);
  
  const onClickNoMember = () => {
    setIsMember(false);
  }
  
  const onClickMember = () => {
    setIsMember(true);
  }

  return (
    <div className="login_container">
      {/* 탭 헤더 */}
      <div className="login_tab_header">
        <button 
          onClick={onClickMember}
          className={`login_tab_button ${isMember ? 'login_active' : ''}`}
        >
          회원 로그인
        </button>
        <button 
          onClick={onClickNoMember}
          className={`login_tab_button ${!isMember ? 'login_active' : ''}`}
        >
          비회원 주문조회
        </button>
      </div>
      
      {/* 탭 콘텐츠 */}
      <div className="login_tab_content">
        {isMember ? <MemberLogin /> : <NoMember />}
      </div>
    </div>
  );
}

export default LoginView;