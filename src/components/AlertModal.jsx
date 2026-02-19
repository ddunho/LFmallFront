import { useEffect, useState } from 'react';
import '../css/AlertModal.css'

export default function AlertModal({ 
  isOpen, 
  onClose,
  minWidth = 400,
  content,
}) {
  // 만약 isOpen이 false이면 null을 반환하여 모달을 렌더링하지 않음
  const [visible, setVisible] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 120); // modalPopOut 시간과 동일
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  if (!visible) return null;
  
  return (<>
    <div onClick={onClose} className="alert_modal_overlay">
      <div 
        className={ `alert_modal_wrap ${ closing ? "closing" : "opening"}` }
        style={{ minWidth : `${minWidth}px` }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="alert_modal_content">
          {content}
        </div>
        
        <div className="alert_modal_btnarea">
          <button onClick={onClose} className="alert_modal_close">
            확인
          </button>
        </div>
      </div>
    </div>
  </>);
}