import React, { useState } from 'react';
import { ColorNames } from './ColorNamesData';
import { SizeData } from './SizeData';

export const ChangeOptionModal = ({ item, onClose, onOptionUpdate }) => {
  const availableOptions = item.other_options || [];
  const [selectedColorId, setSelectedColorId] = useState(item.color_id);
  const [selectedSizeId, setSelectedSizeId] = useState(item.size_id);
  const [selectedQuantity, setSelectedQuantity] = useState(item.quantity);

  // 현재 선택된 옵션에 따른 재고 확인
  const getCurrentStock = () => {
    const currentOption = availableOptions.find(opt => 
      opt.color_id === selectedColorId && opt.size_id === selectedSizeId
    );
    return currentOption ? currentOption.stock : 0;
  };

  // 색상별로 사용 가능한 사이즈 필터링
  const getAvailableSizes = () => {
    return availableOptions
      .filter(opt => opt.color_id === selectedColorId)
      .map(opt => opt.size_id);
  };

  // 사이즈별로 사용 가능한 색상 필터링
  const getAvailableColors = () => {
    return [...new Set(availableOptions.map(opt => opt.color_id))];
  };

  const handleColorChange = (colorId) => {
    setSelectedColorId(colorId);
    
    // 선택한 색상에서 사용 가능한 첫 번째 사이즈로 자동 변경
    const availableSizes = availableOptions
      .filter(opt => opt.color_id === colorId)
      .map(opt => opt.size_id);
    
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSizeId)) {
      setSelectedSizeId(availableSizes[0]);
    }
    
    setSelectedQuantity(1);
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSizeId(sizeId);
    setSelectedQuantity(1);
  };

  const handleConfirm = () => {
    const selectedOption = availableOptions.find(opt => 
      opt.color_id === selectedColorId && opt.size_id === selectedSizeId
    );

    if (!selectedOption) {
      alert('선택한 옵션을 찾을 수 없습니다.');
      return;
    }
    
    // 부모 컴포넌트에게 업데이트 요청
    onOptionUpdate(item.cart_id, selectedOption.option_id, selectedQuantity);
  };

  const currentStock = getCurrentStock();
  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();

  return (
    <div className="changeopt_modal-overlay" onClick={onClose}>
      <div className="changeopt_modal-content" onClick={e => e.stopPropagation()}>
        <div className="changeopt_modal-header">
          <h3>옵션변경</h3>
          <button className="changeopt_modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="changeopt_modal-body">
          <div className="changeopt_product-info">
            <h4>{item.product_name}</h4>
            <p>{item.brand_name}</p>
          </div>

          {/* 색상 선택 */}
          <div className="changeopt_option-section">
            <label>색상</label>
            <div className="changeopt_color-options">
              {ColorNames
                .filter(color => availableColors.includes(color.color_id))
                .map(color => (
                  <div
                    key={color.color_id}
                    className={`changeopt_color-circle ${selectedColorId === color.color_id ? 'changeopt_selected' : ''}`}
                    style={{ backgroundColor: color.color_name }}
                    onClick={() => handleColorChange(color.color_id)}
                  ></div>
              ))}
            </div>
          </div>

          {/* 사이즈 선택 */}
          <div className="changeopt_option-section">
            <label>사이즈</label>
            <div className="changeopt_size-options">
              {SizeData
                .filter(size => availableSizes.includes(size.size_id))
                .map(size => (
                <button
                  key={size.size_id}
                  className={`changeopt_size-option ${selectedSizeId === size.size_id ? 'changeopt_selected' : ''}`}
                  onClick={() => handleSizeChange(size.size_id)}
                >
                  {size.size_name}
                </button>
              ))}
            </div>
          </div>

          {/* 수량 선택 */}
          <div className="changeopt_option-section">
            <label>수량</label>
            <div className="changeopt_quantity-section">
              <select 
                value={selectedQuantity} 
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                disabled={currentStock === 0}
                className="changeopt_quantity-select"
              >
                {currentStock > 0 ? (
                  [...Array(Math.min(currentStock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))
                ) : (
                  <option value={0}>재고없음</option>
                )}
              </select>
              <span className="changeopt_stock-info">재고: {currentStock}개</span>
            </div>
          </div>
        </div>

        <div className="changeopt_modal-footer">
          <button 
            className="changeopt_btn-confirm" 
            onClick={handleConfirm}
            disabled={currentStock === 0}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};