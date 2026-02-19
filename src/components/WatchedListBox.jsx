import { RiCloseLine } from 'react-icons/ri';
import { updateWatchedProducts } from '../utils/watchedProduct';

export const WatchedListBox = ({ product, onRemove }) => {
  // product가 없으면 아무것도 렌더링하지 않음
  if (!product) {
    return null;
  }

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '0';
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const stripLeadingBrackets = (name = "") => {
    if (!name || typeof name !== 'string') return '';
    return name.replace(/^(?:\s*\[[^\]]*]\s*)+/g, "").trim();
  };

  // 할인율 계산 함수
  const calculateDiscountRate = () => {
    if (product.original_price && product.price && product.original_price > product.price) {
      const rate = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      return rate;
    }
    return product.discount_rate || 0;
  };

  // 상품 제거 함수
  const handleRemoveProduct = (e) => {
    e.stopPropagation();
    
    try {
      // localStorage에서 해당 상품 제거
      const stored = localStorage.getItem("watchedProduct");
      if (stored) {
        const watchedProducts = JSON.parse(stored);
        if (Array.isArray(watchedProducts)) {
          const updatedProducts = watchedProducts.filter(id => id !== product.product_id);
          
          if (updatedProducts.length === 0) {
            localStorage.removeItem("watchedProduct");
          } else {
            localStorage.setItem("watchedProduct", JSON.stringify(updatedProducts));
          }
        }
      }
    } catch (error) {
      console.error("localStorage 업데이트 중 오류:", error);
    }
    
    if (onRemove && typeof onRemove === 'function') {
      onRemove();
    }
  };

  // 상품 클릭 핸들러
  const handleProductClick = () => {
    if (product.product_id) {
      updateWatchedProducts(product.product_id);
      window.location.href = `/app/product/${product.product_id}`;
    }
  };

  const discountRate = calculateDiscountRate();

  return (
    <div className="watched-product-item" onClick={handleProductClick}>
      {/* 상품 이미지 */}
      <div className="product-image-wrapper">
        <img 
          src={product.img_name ? `/img/${product.img_name}` : '/placeholder-image.jpg'} 
          alt={stripLeadingBrackets(product.name) || 'Product Image'}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        {/* 삭제 버튼 */}
        <button 
          className="remove-btn"
          onClick={handleRemoveProduct}
          aria-label="상품 제거"
        >
          <RiCloseLine />
        </button>
      </div>

      {/* 상품 정보 */}
      <div className="product-info">
        <div className="brand-name">
          {product.brand_name || 'BRAND'}
        </div>
        
        <div className="product-title">
          {stripLeadingBrackets(product.name) || 'Product Name'}
        </div>
        
        <div className="price-row">
          {discountRate > 0 && (
            <span className="discount-rate">{discountRate}%</span>
          )}
          <span className="current-price">
            {formatPrice(product.price || product.current_price || 0)}원
          </span>
          {product.original_price && product.original_price > (product.price || product.current_price) && (
            <span className="original-price">
              {formatPrice(product.original_price)}원
            </span>
          )}
        </div>
      </div>
    </div>
  );
};