import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  // 컴포넌트 마운트 시 쿠키에서 member 정보 확인
  useEffect(() => {
    const memberData = Cookies.get("member");
    if (memberData) {
      const parsedMember = JSON.parse(memberData);
      setMember(parsedMember);
      setIsLogin(true);
    }
  }, []);

  const login = (memberData) => {
    Cookies.set("member", JSON.stringify(memberData), { expires: 7 }); // 7일간 유효
    setMember(memberData);
    setIsLogin(true);
  };

  // 로그아웃 함수
  const logout = () => {
    Cookies.remove("member");
    setMember(null);
    setIsLogin(false);
  };

  const value = {
    member,
    isLogin,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};