import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect } from "react";
import { FetchCall } from "../FetchCall";

export default function PaymentSuccess() {
  // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
  // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
  // const location = useLocation();
  const { member } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const paymentKey = urlParams.get("paymentKey");
  const orderId = urlParams.get("orderId");
  const amount = urlParams.get("amount");
  const navigate = useNavigate();

  console.log("paymentKey >>> ", paymentKey);
  console.log("memberId >>> ", member?.member_id);

  const orderinfo = JSON.parse(localStorage.getItem("orderinfo"));
  const orderCompleteItems = JSON.parse(
    localStorage.getItem("orderCompleteItems")
  );

  console.log("배송정보조회", orderinfo, "주문한 items들", orderCompleteItems);

  async function confirm() {
    const requestData = {
      order_id: orderId,
      member_id: Number(member?.member_id),
      payment_key: paymentKey,
      total_amount: Number(amount),
    };

    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const json = await response.json();

    if (!response.ok) {
      // 결제 실패 비즈니스 로직
      console.log(json);
      window.location.href = `/payment/fail?message=${json.message}&code=${json.code}`;
    }

    // 결제 성공 비즈니스 로직
    console.log(json);
  }

  const onClicksOrderDataIntoDB = () => {
    const requestData = {
      order_id: orderId,
      member_id: member?.member_id,
      orderinfo,
      orderCompleteItems,
    };
    FetchCall(
      "/api/order/complete",
      "POST",
      requestData,
      (res) =>{
        if(res.success){
          navigate(`/app/order/complete?orderId=${orderId}&amount=${amount}`);
        }else{
          console.error("에러발생");
        }
      }
    )
  };

  useEffect(() => {
    if (!member?.member_id) return;
    confirm();
  }, [member?.member_id]);

  return (
    <>
      <h2>결제 성공</h2>
      <p id="paymentKey">{paymentKey}</p>
      <p id="orderId">{orderId}</p>
      <p id="amount">{amount}</p>
      <button onClick={onClicksOrderDataIntoDB}>결제 완료하기</button>
    </>
  );
}
