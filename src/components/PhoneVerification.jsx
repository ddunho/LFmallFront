import { useState, useEffect } from "react";
import "../css/phoneVerification.css";

const PhoneVerification = ({ onPhoneSubmit, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  // 모달이 열릴 때 body에 클래스 추가
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const changePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (phoneNumber.trim() && phoneNumber.length === 11) {
      onPhoneSubmit(phoneNumber);
      onClose();
    } else {
      window.alert("핸드폰 번호는 11글자로 입력하세요");
    }
  };

  // 배경 클릭 시 모달 닫기
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleBackgroundClick}>
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            ✕
          </button>

          <h2 className="modal-title">휴대폰 인증</h2>

          <div className="input-group">
            <label className="input-label">핸드폰 번호 입력</label>
            <input
              type="tel"
              className="phone-input"
              onChange={changePhoneNumber}
              onKeyDown={handleKeyDown}
              value={phoneNumber}
              placeholder="01012345678"
              autoFocus
            />
          </div>

          <div className="button-group">
            <button
              className="modal-button submit-button"
              onClick={handleSubmit}
            >
              인증하기
            </button>
            <button className="modal-button cancel-button" onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneVerification;