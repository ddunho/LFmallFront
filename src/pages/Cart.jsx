import { useEffect, useRef, useState } from 'react';
import CartItem from '../components/CartItems';
import OrderItems from '../components/OrderItems';
import { TotalBox } from '../components/TotalBox';
import '../css/Cart.css';
import { SlArrowRight } from "react-icons/sl";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useAuth } from "../AuthContext";
import { useCartPrice } from '../CartPriceContext';
import PaySuccess from '../components/PaySuccess';


export default function Cart({pageinfo}){

  const [cntBuy, setCntBuy] = useState(0);
  const [orderinfo, setOrderinfo] = useState({
    orderMemberName: '',
    recipientName: '',
    recipientMobilePhone: '',  // 이 필드 추가!
    recipientZipCode: '',
    recipientFixAddress: '',
    recipientDetailAddress: '',
    orderMsgOption: '',
    isDefault: false
  });
  // const paymentWidgetRef = useRef(null); // 타입 제거
  const [pgBtnState, setPgBtnState] = useState({});
  const [pgcBtnState, setPgcBtnState] = useState();

const paymentWidgetRef = useRef(null); 
  return (
    <div className='cart-container'> 
      <div className='cart-content'>
        <div className='cart-header'>
          <h1 className='cart-title'>{pageinfo === 1 ? '쇼핑백' : pageinfo === 2 ? '주문서' : pageinfo === 3 ? '주문서' : ''}</h1>
          <div className='breadcrumb'>
            <span className={pageinfo === 1 ? 'active' : ''}>쇼핑백</span>
            <SlArrowRight />
            <span className={pageinfo === 2 ? 'active' : ''}>주문서</span>
            <SlArrowRight />
            <span className={pageinfo === 3 ? 'active' : ''}>주문완료</span>
          </div>
        </div>
        
        <div className='cart-main'>
          <div className='cart-items'>
            {pageinfo === 1 
              ? <CartItem /> 
              : pageinfo === 2 
                ? <OrderItems 
                    pageinfo={pageinfo}
                    cntBuy={cntBuy} 
                    setCntBuy={setCntBuy} 
                    orderinfo={orderinfo} 
                    setOrderinfo={setOrderinfo} 
                    pgBtnState={pgBtnState}
                    setPgBtnState={setPgBtnState}
                    pgcBtnState={pgcBtnState}
                    setPgcBtnState={setPgcBtnState}
                  /> 
                : pageinfo === 3 
                  ? <PaySuccess orderinfo={orderinfo}/> 
                  : null}
          </div>
            {pageinfo === 3 ? "": <TotalBox pageinfo={pageinfo} cntBuy={cntBuy} orderinfo={orderinfo} pgBtnState={pgBtnState} 
            pgcBtnState={pgcBtnState}/>}
        </div>
      </div>
    </div>
  );
}
