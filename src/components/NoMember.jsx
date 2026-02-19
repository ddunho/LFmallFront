import { useState } from 'react';
import PhoneVerification from './PhoneVerification';

const NoMember = () => {
  const [noMemberName, setNoMemberName] = useState("");
  const [noMemberPhone, setNoMemberPhone] = useState("");
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  const onChangeName = (e) => {
    setNoMemberName(e.target.value);
  }

  const openPhoneVerification = () => {
    setShowPhonePopup(true);
  }

  const handlePhoneSubmit = (phoneNumber) => {
    setNoMemberPhone(phoneNumber);
    window.alert(`인증완료 : ${phoneNumber}`);
  }

  const closePhonePopup = () => {
    setShowPhonePopup(false);
  }

  return (
    <div className="login_member_form">
      {/* 주문자명 입력 */}
      <div>
        <input 
          type="text" 
          placeholder="주문자명" 
          onChange={onChangeName} 
          value={noMemberName}
          className="login_input_field"
        />
      </div>

      {/* 휴대폰 인증 */}
      <div>
        <div className="login_phone_input_group">
          <div className="login_phone_label">
            주문자 전화번호
          </div>
          <button 
            onClick={openPhoneVerification}
            className="login_phone_verify_btn"
          >
            휴대폰 인증하기 →
          </button>
        </div>
        {noMemberPhone && (
          <div className="login_verify_success">
            인증완료: {noMemberPhone}
          </div>
        )}
      </div>

      {/* 주문조회 버튼 */}
      <div>
        <button className="login_btn_primary">
          주문조회
        </button>
      </div>

      {/* 안내 섹션 */}
      <div className="login_info_section">
        <p className="login_info_text">
          비밀번호로 주문하신 경우에만 비회원 주문조회가 가능합니다.
        </p>
        
        <div className="login_benefit_box">
          <div className="login_benefit_text">
            회원가입시 바로 누릴 수 있는 <strong>LFmall 회원 혜택</strong>
          </div>
          <button className="login_benefit_btn">
            확인하기 →
          </button>
        </div>

        {/* 혜택 아이콘들 */}
        <div className="login_benefit_icons">
          <div className="login_benefit_item">
            <div className="login_benefit_icon login_pink">🎁</div>
            <div className="login_benefit_label">생일 기념 혜택</div>
          </div>
          <div className="login_benefit_item">
            <div className="login_benefit_icon login_purple">💎</div>
            <div className="login_benefit_label">회원 등급별 혜택</div>
          </div>
          <div className="login_benefit_item">
            <div className="login_benefit_icon login_blue">🕐</div>
            <div className="login_benefit_label">마감시간 혜택</div>
          </div>
          <div className="login_benefit_item">
            <div className="login_benefit_icon login_green">🚚</div>
            <div className="login_benefit_label">무료배송/반품 혜택</div>
          </div>
        </div>
      </div>

      {/* 휴대폰 인증 팝업 */}
      {showPhonePopup && (
        <PhoneVerification
          onPhoneSubmit={handlePhoneSubmit}
          onClose={closePhonePopup}
        />
      )}
    </div>
  );
};

export default NoMember;