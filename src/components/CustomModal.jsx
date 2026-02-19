import '../css/CustomModal.css'

export default function CustomModal({ 
  isOpen, 
  onClose,
  minWidth = 370,
  children,
  title,
}) {
  // 만약 isOpen이 false이면 null을 반환하여 모달을 렌더링하지 않음
  if (!isOpen) return null;
  
  return (<>
    <div onClick={onClose} className="modal_overlay">
      <div 
        className="modal_wrap"
        style={{ minWidth : `${minWidth}px` }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className='modal_titlearea'>
          <div className='modal_title'>
            {title}
          </div>
          <button onClick={onClose} className="modal_close">
            <img src="/icon/close_icon_black.png" />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  </>);
}