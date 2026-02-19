import { loadTossPayments } from "@tosspayments/tosspayments-sdk"
import { useAuth } from "../AuthContext";
import { useEffect, useRef } from "react";

export default function PaymentPopup({ payRef }){


  return (<>
    <div>
      <h1>토스페이</h1>
      <div id="payment-widget" style={{height: '500px'}} />
    </div>
  </>)
}