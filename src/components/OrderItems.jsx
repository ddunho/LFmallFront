import { useLocation } from "react-router-dom";
import "../css/orderItems.css";
import { useEffect, useRef, useState } from "react";
import { FetchCall } from "../FetchCall";
import { ColorNames } from "./ColorNamesData";
import { useCartPrice } from "../CartPriceContext";
import OrderDetail from './OrderDetail';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useAuth } from "../AuthContext";
import Payment from "./Payment";

export default function OrderItems({ 
  pageinfo, 
  cntBuy, 
  setCntBuy, 
  setOrderinfo, 
  orderinfo, 
  pgBtnState,
  setPgBtnState,
  pgcBtnState,
  setPgcBtnState
}) {
  const [orderList, setOrderList] = useState([]);
  const [cntorderItem, setCntorderItem] = useState(0);
  const nowcartProductList = sessionStorage.getItem("cartBuy");
  const { setSelectedItems, formatPrice } = useCartPrice();
  const location = useLocation();
  const prevPathRef = useRef(location.pathname); 
  useEffect(() => {
    console.log("useEffect started!");
    // 먼저 모든 데이터를 확인
    const cartBuyData = sessionStorage.getItem("cartBuy");
    const productInfoData = localStorage.getItem("product_info");
    const nowBuyData = sessionStorage.getItem("nowBuy");

    console.log("storage 상태:", {
      cartBuy: !!cartBuyData,
      product_info: !!productInfoData,
      nowBuy: !!nowBuyData,
    });

    let unifiedOrderList = [];

    try {
      // 우선순위 1: 장바구니 구매 (cartBuy가 있으면 최우선)
      if (cartBuyData) {
        console.log("장바구니 데이터 처리");

        const cartData = JSON.parse(cartBuyData);
        unifiedOrderList = cartData.map((item) => ({
          img_name: item.img_name,
          product_name: item.product_name,
          brand_name: item.brand_name,
          price: item.price,
          discount: item.discount || 0,
          free_delivery: item.free_delivery,
          product_id: item.product_id,
          quantity: item.quantity,
          option_id: item.option_id,
          stock: item.stock,
          size_name: item.size_name,
          color_name: item.color_name,
          total_price:
            ((item.price * (100 - (item.discount || 0))) / 100) * item.quantity,
          purchase_type: "cart",
          cart_id: item.cart_id,
        }));
        setCntBuy(cartData.length);

        // 장바구니 구매시에는 이전 바로구매 관련 데이터 정리
        if (productInfoData) {
          console.log("이전 바로구매 데이터 정리");
          localStorage.removeItem("product_info");
        }
        if (nowBuyData) {
          sessionStorage.removeItem("nowBuy");
        }
      }
      // 우선순위 2: 바로구매 (cartBuy가 없고, product_info + nowBuy가 있을 때)
      else if (productInfoData && nowBuyData) {
        console.log("바로구매 데이터 처리");

        const productInfo = JSON.parse(productInfoData);
        const nowBuy = [JSON.parse(nowBuyData)];

        console.log("상품 기본정보", productInfo, "상품 옵션정보", nowBuy);
        
        unifiedOrderList = nowBuy.map((buyItem) => ({
          img_name: productInfo.img_names
            ? productInfo.img_names[0]
            : productInfo.img_name,
          product_name: productInfo.name,
          brand_name: productInfo.brand_name,
          price: productInfo.price,
          discount: productInfo.discount || 0,
          free_delivery: productInfo.free_delivery,
          product_id: productInfo.product_id,
          delivery_state: productInfo.delivery_state,
          quantity: buyItem.quantity,
          option_id: buyItem.option_id,
          stock: buyItem.stock,
          size_name: buyItem.size_name,
          color_name: buyItem.color_name,
          total_price:
            ((productInfo.price * (100 - (productInfo.discount || 0))) / 100) *
            buyItem.quantity,
          purchase_type: "direct",
        }));

        setCntBuy(nowBuy.length);

        console.log("바로구매정보", unifiedOrderList);
      }
      // 우선순위 3: product_info만 있는 경우 (불완전한 바로구매 데이터)
      else if (productInfoData && !nowBuyData) {
        console.log("불완전한 바로구매 데이터 - product_info만 존재");
        localStorage.removeItem("product_info");
        unifiedOrderList = [];
      } else {
        console.log("주문 데이터가 없습니다");
        unifiedOrderList = [];
      }

      setOrderList(unifiedOrderList);
      console.log("최종 주문 리스트:", unifiedOrderList);
      setSelectedItems(unifiedOrderList);
    } catch (error) {
      console.error("데이터 파싱 오류:", error);
      // 파싱 오류 시 모든 관련 데이터 정리
      sessionStorage.removeItem("cartBuy");
      localStorage.removeItem("product_info");
      sessionStorage.removeItem("nowBuy");
      sessionStorage.removeItem("cntcartBuy");
      setOrderList([]);
    }/*
    sessionStorage.removeItem("cartBuy");
    localStorage.removeItem("product_info");
    sessionStorage.removeItem("nowBuy");
    sessionStorage.removeItem("cntcartBuy");*/ 
    /* **********NOTICE***********
    이 order창을 벗어나면 그때 sessionStorage, localStorage에 저장된 주문정보를 지울것.
    StrictMode에선 2번 실행되는 문제가 발생하므로 여기에 쓰지말것.
    

    *************************************************
    [location.pathname]을 의존성으로 가지는 useEffect()에서 sessionStorage, localStorage에 저장된 주문정보를 지우도록 수정.

    */ 
    
    console.log("useEffect completed!");
    
    
  }, []);

  /*************페이지를 벗어날때 sessionStorage, localStorage에 있는 정보를 지움************** */
  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currPath = location.pathname;

    // ✅ "주문 페이지"에서 "다른 페이지"로 이동할 때만 정리
    if (prevPath === "/app/order" && currPath !== "/app/order") {
      sessionStorage.removeItem("nowBuy");
      sessionStorage.removeItem("cartBuy");
      localStorage.removeItem("product_info");
    }

    prevPathRef.current = currPath;
  }, [location.pathname]);


  const getDeliveryDate = () => {
    const now = new Date();
    const currentHour = now.getHours(); // 현재 시간 (0-23)

    let deliveryDate = new Date();

    // 16시 이전이면 내일 배송, 16시 이후면 모레 배송
    if (currentHour < 16) {
      deliveryDate.setDate(now.getDate() + 1); // 내일
    } else {
      deliveryDate.setDate(now.getDate() + 2); // 모레
    }

    const month = String(deliveryDate.getMonth() + 1).padStart(2, "0");
    const day = String(deliveryDate.getDate()).padStart(2, "0");

    // 요일 배열 (한국어)
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[deliveryDate.getDay()];

    return `${month}/${day}(${weekday})`;
  };

  const getColorKoName = (colorName) => {
    const color = ColorNames.find((c) => c.color_name === colorName);
    return color ? color.color_ko : colorName; // 못 찾으면 원래 값 반환
  };

    // Toss Payments 관련 상태 추가

  // const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  
  // const { member } = useAuth();
  // console.log( 'member', member );
  

  // // console.log("???????????????? -> ", amount);

  // console.log( 'selectedItems', selectedItems );
  // console.log( 'priceInfo', priceInfo );
  

  // 결제 로직

    // // Toss Payments 초기화
    // useEffect(() => {
    //   console.log("가격 ----> ", priceInfo.finalPrice);
    //   if( priceInfo.finalPrice <= 0 && pageinfo === 2 ) return;

    //   const initializePayment = async () => {
    //     try {
    //       // customerKey는 실제 고객 식별자를 사용하거나 익명 사용자용으로 설정
    //       const customerKey = member?.uuid ?? 'ANONYMOUS';

    //       const tossPayments = await loadTossPayments(clientKey);
    //       const widgets = tossPayments.widgets({ customerKey });
    //       console.log( 'amount 22>>>',priceInfo.finalPrice); 
    //       // 주문 결제 금액 설정
    //       await widgets.setAmount({
    //         currency: 'KRW',
    //         value: priceInfo.finalPrice,
    //       })

    //       await Promise.all([
    //         // ------  결제 UI 렌더링 ------
    //         widgets.renderPaymentMethods({
    //           selector: "#payment-widget",
    //           variantKey: "DEFAULT",
    //         }),

    //         widgets.renderPaymentMethods({
    //           selector: "#credit-card",
    //           variantKey: "DEFAULT",
    //           paymentMethods: ["카드"]
    //         }),
    //       ]);

    //       payRef.current = widgets;
    //     } catch (error) {
    //       console.error('Payment widget 초기화 실패:', error);
    //     }
    //   };

    //   initializePayment();
      
    // }, [priceInfo]);


  return (
    <>
      <div className="order-main">
        <div className="order-main-second">
          <h3 className="order-info-h3">주문상품({cntBuy})</h3>
          <span className="order-info-span">
            추가 혜택 확인 후 직접 적용해 주세요.
          </span>
        </div>
        <div>
          <table className="order-table">
            <colgroup>
              <col style={{ width: "58%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="th-info">상품정보</th>
                <th className="th-price">상품금액</th>
                <th className="th-coupon">쿠폰할인</th>
                <th className="th-delivery">배송비</th>
              </tr>
            </thead>
            <tbody>
              {orderList?.map((item, index) => (
                <tr className="order-row" key={item.option_id}>
                  <td className="td-info">
                    <div className="order-item">
                      <img
                        className="item-image"
                        src={`/img/${item?.img_name}`}
                        alt={item?.name}
                      />
                      <div className="item-detail">
                        <div className="brand-name">{item?.brand_name}</div>
                        <div className="item-name">{item?.product_name}</div>
                        <div className="order-color-size">
                          <span>
                            {item.color_name === "X"
                              ? ""
                              : `${getColorKoName(item.color_name)} / `}
                          </span>
                          <span>{item.size_name}</span>
                          &nbsp;/&nbsp;<span>{item.quantity}개</span>
                        </div>
                        <div className="delivery-date">
                          {getDeliveryDate()} 도착예정
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="td-price">
                    <div>
                      <span className="origin-price">
                        {formatPrice(item?.price * item.quantity)}
                      </span>
                    </div>
                    <div>
                      <em>{formatPrice(item.total_price)}</em>원
                      <button
                        className="price-info-btn"
                        type="button"
                        data-is-open="false"
                      >
                        <span>가격 안내</span>
                      </button>
                    </div>
                  </td>
                  <td className="td-coupon">
                    <div>
                      <span className="discount">
                        {formatPrice((item.price * item.discount) / 100)}원
                      </span>
                      <br />
                      <button className="coupon-change-btn" type="button">
                        변경
                      </button>
                    </div>
                  </td>
                  <td className="td-delivery" rowSpan="1">
                    무료
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="order-benefit">
          <h2 className="benefit-title">적립혜택</h2>
          <span className="benefit-info">
            추가 혜택 확인 후 직접 적용해 주세요.
          </span>
        </div>
      </div>
      {cntBuy > 0 
        ? 
        <>
          <OrderDetail orderinfo={orderinfo} setOrderinfo={setOrderinfo} />
          <Payment 
            pgBtnState={pgBtnState} 
            setPgBtnState={setPgBtnState} 
            pgcBtnState={pgcBtnState}
            setPgcBtnState={setPgcBtnState}
          />
        </>
        : <div>없음...</div>}
    </>
  );
}
