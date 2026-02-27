import { createContext, useContext, useState, useEffect } from 'react';

const CartPriceContext = createContext();

export const useCartPrice = () => {
  const context = useContext(CartPriceContext);
  if (!context) {
    throw new Error('useCartPrice must be used within CartPriceProvider');
  }
  return context;
};

export const CartPriceProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [priceInfo, setPriceInfo] = useState({
    originalPrice: 0,
    discountAmount: 0,
    deliveryFee: 0,
    finalPrice: 0,
    itemCount: 0
  });

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(price));
  };

  // 선택된 아이템이 변경될 때마다 가격 계산
  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      setPriceInfo({
        originalPrice: 0,
        discountAmount: 0,
        deliveryFee: 0,
        finalPrice: 0,
        itemCount: 0
      });
      return;
    }

    let totalOriginalPrice = 0;
    let totalDiscountAmount = 0;
    let totalDeliveryFee = 0;
    let totalItemCount = 0;

    selectedItems.forEach(item => {
      // 원래 가격 계산
      const itemOriginalPrice = (item.productPrice || item.price) * (item.cartQuantity || item.quantity);
      totalOriginalPrice += itemOriginalPrice;

      // 할인 금액 계산
      const discountRate = item.productDiscount || 0;
      const itemDiscountAmount = (itemOriginalPrice * discountRate) / 100;
      totalDiscountAmount += itemDiscountAmount;

      // 배송비 계산
      if (item.free_delivery === "Y") {
        // 무료배송
      } else {
        const deliveryFee = parseInt(item.free_delivery) || 3000;
        totalDeliveryFee += deliveryFee;
      }

      // 아이템 개수
      totalItemCount += item.cartQuantity;
    });

    const finalPrice = totalOriginalPrice - totalDiscountAmount + totalDeliveryFee;

    setPriceInfo({
      originalPrice: totalOriginalPrice,
      discountAmount: totalDiscountAmount,
      deliveryFee: totalDeliveryFee,
      finalPrice: finalPrice,
      itemCount: totalItemCount
    });

  }, [selectedItems]);

  const value = {
    selectedItems,
    setSelectedItems,
    priceInfo,
    formatPrice
  };

  return (
    <CartPriceContext.Provider value={value}>
      {children}
    </CartPriceContext.Provider>
  );
};