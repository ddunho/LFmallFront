import { memo } from 'react';
import qrNaver from '../pic/qr_naver.png';
import '../css/Qrcode.css';

const QrCode = () => {
  return (
    <div className="HeaderNew_qrCode__nx8Te">
      <p>LFmall 앱에서 맞춤 혜택을 누리세요</p>
      <span>카메라로 QR코드 스캔하여 앱 다운로드</span>
      <div className='qrCode_img'>
        <img src={qrNaver} alt="QR코드" />
      </div>
    </div>
  );
};

export default memo(QrCode);