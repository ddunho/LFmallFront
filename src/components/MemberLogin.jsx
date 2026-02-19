import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FetchCall } from '../FetchCall';
import { useAuth } from '../AuthContext';

const MemberLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState({
    loginid: "",
    loginpw: ""
  });
  const [saveId, setSaveId] = useState(false);
  const loginidRef = useRef(null);
  const loginpwRef = useRef(null);

  useEffect(() => {
    const savedId = localStorage.getItem("email");
    
    if (savedId && savedId.length > 0) {
      setSaveId(true);
      setLoginForm(prev => ({
        ...prev,
        loginid: savedId
      }));
    }
  }, []);

  const onChangeForm = (e) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const onChangeSaveId = (e) => {
    setSaveId(e.target.checked);
  }

  const onClickSignUpPage = () => {
    navigate("/app/signup");
  }



  const onClickLogin = () => {
    const loginemail = loginForm.loginid.trim();
    const loginpw = loginForm.loginpw.trim();
    
    if (loginemail.length < 1) {
      window.alert("아이디를 입력해주세요.");
      loginidRef.current.focus();
      return;
    }
    if (loginpw.length < 1) {
      window.alert("비밀번호를 입력해주세요.");
      loginpwRef.current.focus();
      return;
    }
    
    FetchCall(`/api/member/login`, 'POST', loginForm, (res) => {
      if (res.success) {
        window.alert(res.message);
        login(res.member);
        if (saveId) {
          localStorage.setItem("email", loginForm.loginid);
        } else {
          localStorage.removeItem("email");
        }
        navigate('/app/menu/0');
      } else {
        window.alert(res.message);
        loginpwRef.current.focus();
      }
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClickLogin();
    }
  };

  return (
    <div className="login_member_form">
      {/* 아이디 입력 */}
      <div>
        <input 
          ref={loginidRef} 
          id="loginid" 
          type="text" 
          placeholder="아이디" 
          value={loginForm.loginid} 
          onChange={onChangeForm}
          className="login_input_field"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <input 
          ref={loginpwRef} 
          id="loginpw" 
          type="password" 
          placeholder="비밀번호" 
          value={loginForm.loginpw} 
          onChange={onChangeForm}
          className="login_input_field"
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* 아이디 저장 체크박스 및 링크들 */}
      <div className="login_checkbox_row">
        <label className="login_checkbox_label">
          <input 
            type="checkbox" 
            checked={saveId}
            onChange={onChangeSaveId}
          />
          <span>아이디 저장</span>
        </label>
        
        <div className="login_link_group">
          <a href="/app/find/id">아이디 찾기</a>
          <span>|</span>
          <a href="/app/find/pw">비밀번호 찾기</a>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <div>
        <button 
          onClick={onClickLogin}
          className="login_btn_primary"
        >
          로그인
        </button>
      </div>

      {/* 회원가입 버튼 */}
      <div>
        <button 
          onClick={onClickSignUpPage}
          className="login_btn_secondary"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default MemberLogin;