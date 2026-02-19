import { useCartPrice } from '../CartPriceContext';

const CartPricediv = () => {
  const { priceInfo, formatPrice } = useCartPrice();

  return (
    <div className="price-summary">
      <div className="price-summary__item">
        <span className="price-summary__label">상품금액</span>
        <span className="price-summary__value">{formatPrice(priceInfo.originalPrice)}원</span>
      </div>
      
      <span className="price-summary__operator">−</span>
      
      <div className="price-summary__item">
        <span className="price-summary__label">할인금액</span>
        <span className="price-summary__discount">{formatPrice(priceInfo.discountAmount)}원</span>
      </div>
      
      <span className="price-summary__operator">+</span>
      
      <div className="price-summary__item">
        <span className="price-summary__label">배송비</span>
        <span className="price-summary__value">
          {priceInfo.deliveryFee === 0 ? "무료" : `${formatPrice(priceInfo.deliveryFee)}원`}
        </span>
      </div>
      
      <span className="price-summary__operator">=</span>
      
      <div className="price-summary__final">
        <span className="price-summary__final-label">결제금액</span>
        <span className="price-summary__final-value">{formatPrice(priceInfo.finalPrice)}원</span>
      </div>
    </div>
  );
};

export default CartPricediv;