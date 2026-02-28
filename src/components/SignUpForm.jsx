import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignUpForm.css";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loginid: "",
    loginpw: "",
    loginpwConfirm: "",
    name: "",
    refLfId: "",
    refOtherId: "",
    phone: "",
  });

  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeFamily, setAgreeFamily] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.loginid.trim()) newErrors.loginid = "아이디를 입력해주세요.";
    if (!formData.loginpw.trim()) newErrors.loginpw = "비밀번호를 입력해주세요.";
    if (formData.loginpw !== formData.loginpwConfirm)
      newErrors.loginpwConfirm = "비밀번호가 일치하지 않습니다.";
    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!agreeAll) newErrors.agreeAll = "이용약관에 동의해주세요.";
    return newErrors;
  };

  const isFormValid =
    formData.loginid.trim() !== "" &&
    formData.loginpw.trim() !== "" &&
    formData.loginpwConfirm.trim() !== "" &&
    formData.loginpw === formData.loginpwConfirm &&
    formData.name.trim() !== "" &&
    agreeAll;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginid: formData.loginid,
          loginpw: formData.loginpw,
          name: formData.name,
          refLfId: formData.refLfId,
          refOtherId: formData.refOtherId,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("회원가입이 완료되었습니다.");
        navigate("/app/login");
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="section-title">기본정보</div>

      {/* 아이디 */}
      <div className="form-group">
        <label className="form-label">아이디</label>
        <input type="text" name="loginid" value={formData.loginid} onChange={handleChange} className="form-input" />
        {errors.loginid && <p className="error">{errors.loginid}</p>}
      </div>

      {/* 비밀번호 */}
      <div className="form-group">
        <label className="form-label">비밀번호</label>
        <input type="password" name="loginpw" value={formData.loginpw} onChange={handleChange} className="form-input" />
        {errors.loginpw && <p className="error">{errors.loginpw}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div className="form-group">
        <label className="form-label">비밀번호 확인</label>
        <input type="password" name="loginpwConfirm" value={formData.loginpwConfirm} onChange={handleChange} className="form-input" />
        {errors.loginpwConfirm && <p className="error">{errors.loginpwConfirm}</p>}
      </div>

      {/* 이름 */}
      <div className="form-group">
        <label className="form-label">이름</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      {/* 전화번호 */}
      <div className="form-group">
        <label className="form-label">전화번호</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="010-0000-0000" />
        {errors.phone && <p className="error">{errors.phone}</p>}
      </div>

      {/* 추천인 LFmall 아이디 */}
      <div className="form-group">
        <label className="form-label">추천인 LFmall 아이디 (선택)</label>
        <input type="text" name="refLfId" value={formData.refLfId} onChange={handleChange} className="form-input" />
      </div>

      {/* 추천인 기타 아이디 */}
      <div className="form-group">
        <label className="form-label">추천인 기타 아이디 (선택)</label>
        <input type="text" name="refOtherId" value={formData.refOtherId} onChange={handleChange} className="form-input" />
      </div>

      <div className="divider" />

      {/* 이용약관 동의 */}
      <div className="checkbox-group">
        <div className="checkbox-header">
          <div className="checkbox-left">
            <input
              type="checkbox"
              id="agreeAll"
              checked={agreeAll}
              onChange={(e) => {
                setAgreeAll(e.target.checked);
                setErrors((prev) => ({ ...prev, agreeAll: "" }));
              }}
              className="checkbox-input"
            />
            <label htmlFor="agreeAll" className="checkbox-label">이용약관 모두 동의 (필수)</label>
          </div>
          <span className="arrow">∨</span>
        </div>
        {errors.agreeAll && <p className="error" style={{ padding: "0 14px 12px" }}>{errors.agreeAll}</p>}
      </div>

      {/* LF Members 동의 */}
      <div className="checkbox-group">
        <div className="checkbox-header">
          <div className="checkbox-left">
            <input
              type="checkbox"
              id="agreeFamily"
              checked={agreeFamily}
              onChange={(e) => setAgreeFamily(e.target.checked)}
              className="checkbox-input"
            />
            <label htmlFor="agreeFamily" className="checkbox-label">LF Members 패밀리사이트 이용 동의 (선택)</label>
          </div>
          <span className="arrow">∨</span>
        </div>
      </div>

      {/* 가입하기 버튼 */}
      <button
        type="submit"
        disabled={!isFormValid}
        className={`submit-btn ${isFormValid ? "active" : "inactive"}`}
      >
        가입하기
      </button>
    </form>
  );
};

export default SignUpForm;