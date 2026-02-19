import { useEffect, useState } from "react";
import { useCartPrice } from "../CartPriceContext";
import { useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";
import CustomModal from "./CustomModal";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useAuth } from "../AuthContext";


export const TotalBox = ({ pageinfo, orderinfo, cntBuy, pgBtnState, pgcBtnState }) => {
  const [is_pick, setIs_pick] = useState(false);
  const { selectedItems, priceInfo, formatPrice } = useCartPrice();
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    content: "",
  });
  const navigate = useNavigate();

  console.log( selectedItems );
  const handleSelectedmultiOrderBtn = () => {
    if (pageinfo === 1) {
      if (selectedItems.length === 0) {
        setAlertModal({
          isOpen: true,
          content: "주문할 상품을 선택해주세요.",
        });
        return;
      }
      sessionStorage.removeItem("nowBuy");
      sessionStorage.removeItem("cartBuy");
      sessionStorage.removeItem("cntcartBuy");
      localStorage.removeItem("product_info");
      sessionStorage.setItem("cartBuy", JSON.stringify(selectedItems));
      sessionStorage.setItem("cntcartBuy", selectedItems.length);

      navigate("/app/order");
    }
    if(pageinfo === 2){
      localStorage.setItem("orderinfo", JSON.stringify(orderinfo));
      localStorage.setItem("orderCompleteItems", JSON.stringify(selectedItems));
      handleTossPayClick();
    }
  };
  console.log(selectedItems.length);

  const closeAlertModal = () => {
    setAlertModal({
      isOpen: false,
      content: "",
    });
  };

  const getButtonText = () => {
    if (pageinfo === 1) {
      return selectedItems.length === 0
        ? "주문하기"
        : `${selectedItems.length}개 주문하기`;
    } else if (pageinfo === 2) {
      return `${cntBuy}개 결제하기`;
    }
    return "";
  };

  const getDiscountPercentage = () => {
    if (priceInfo.originalPrice === 0) return 0;
    return Math.round(
      (priceInfo.discountAmount / priceInfo.originalPrice) * 100
    );
  };


// 결제
  const clientKey = "test_ck_XZYkKL4MrjxMQ6OBzznR30zJwlEW";
  const { member } = useAuth();

  const handleTossPayClick = async () => {
    try {
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({
        customerKey: member?.uuid || 'ANONYMOUS'
      });
      
      const params = {
        method: pgBtnState?.method,
        amount: {
          currency: 'KRW',
          value: priceInfo.finalPrice,
        },
        orderId: "order_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15),
        orderName: selectedItems[0].product_name,
        customerName: member?.name,
        customerEmail: member?.email,
        successUrl: "http://localhost:3000/payment/success",
        failUrl: "http://localhost:3000/payment/fail",
        windowTarget: 'iframe',
      };

      if( pgBtnState?.pid === 1 && pgcBtnState ){ // 신용카드
        params.card = {
          cardCompany: pgcBtnState?.cardCompany,
          flowMode: 'DIRECT',
        }
      } else if (pgBtnState?.pid === 2) { // 퀵계좌이체
        params.transfer = {
          cashReceipt: { type: "소득공제" },
          useEscrow: false,
        }
      } else if (pgBtnState?.pid === 3) { // 실시간 계좌이체
        params.transfer = {
          cashReceipt: { type: "소득공제" },
          useEscrow: true,
        }
      } else if( pgBtnState?.method === 'CARD' ){
        params.card = {
          easyPay: pgBtnState?.easypay,
          flowMode: 'DIRECT'
        }
      };

      await payment.requestPayment( params );
      
    } catch (error) {
      console.error('결제 요청 실패:', error);
      
      if (error.code === 'USER_CANCEL') {
        console.log('결제가 취소되었습니다.');
      } else {
        // 수동으로 fail 페이지로 이동
        const errorCode = error.code || "UNKNOWN_ERROR";
        const errorMessage = error.message || "알 수 없는 오류가 발생했습니다.";
        navigate(
          `/payment/fail?code=${errorCode}&message=${encodeURIComponent(errorMessage)}`
        );
      }
    }
  };

  return (
    <>
      <div className="total-box">
        <div className="total-content">
          <ul className="price-list">
            <li className="price-item">
              <span>
                {pageinfo === 1
                  ? `상품금액 (${priceInfo.itemCount})`
                  : `상품합계 (${cntBuy})`}
              </span>
              <span>{formatPrice(priceInfo.originalPrice)}원</span>
            </li>
            <li className="price-item">
              <span>
                {pageinfo === 1
                  ? `상품 할인 금액`
                  : `할인합계 (${getDiscountPercentage()}%)`}
              </span>
              <span>
                {formatPrice(priceInfo.discountAmount) === 0
                  ? 0
                  : `-${formatPrice(priceInfo.discountAmount)}`}
                원
              </span>
            </li>
            <li className="price-item">
              <span>배송비</span>
              <span>
                {priceInfo.deliveryFee === 0
                  ? "무료"
                  : `${formatPrice(priceInfo.deliveryFee)}원`}
              </span>
            </li>
          </ul>

          <hr className="divider" />

          <div className="final-amount">
            <span>{pageinfo === 1 ? `결제예정금액` : `총 결제금액`}</span>
            <span className="final-price">
              {formatPrice(priceInfo.finalPrice)}원
            </span>
          </div>

          {pageinfo === 1 ? (
            <div className="message">
              {priceInfo.discountAmount > 0 ? (
                <span>
                  <strong>{formatPrice(priceInfo.discountAmount)}</strong>
                  <strong style={{ color: "red" }}>
                    ({getDiscountPercentage()}%){" "}
                  </strong>
                  할인 받았어요!
                </span>
              ) : (
                <span>상품을 선택하시면 최적 혜택이 계산됩니다.</span>
              )}
            </div>
          ) : (
            ""
          )}
        </div>

        <button className="order-btn" onClick={handleSelectedmultiOrderBtn}>
          {getButtonText()}
        </button>
      </div>
      <CustomModal
        isOpen={alertModal.isOpen}
        onClose={closeAlertModal}
        title={"쇼핑백"}
      >
        <div className="modal_msg">{alertModal.content}</div>
        <div className="modal_btnarea">
          <button className="exitBtn" onClick={closeAlertModal}>
            돌아가기
          </button>
        </div>
      </CustomModal>
    </>
  );
};
