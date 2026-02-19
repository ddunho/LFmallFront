import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import '../css/Payment.css'

export default function Payment({ 
  pgBtnState, 
  setPgBtnState, 
  pgcBtnState,
  setPgcBtnState
}){

  const [payRadio, setPayRadio] = useState(1);
  const payRadioHandler = (e) => {
    setPayRadio(Number(e.target.value));
    console.log(payRadio);
  };

  const generalList = [
    { 
      "pid": 1,
      "method": "CARD",
      "easypay": null,
      "label": "결제헤택 확인",
      "content": "신용카드",
      "img": null 
    },
    { 
      "pid": 2,
      "method": "TRANSFER",
      "easypay": null,
      "label": null,
      "content": "퀵계좌이체",
      "img": null,
    },
    { 
      "pid": 3,
      "method": "TRANSFER",
      "easypay": "",
      "label": null,
      "content": "실시간\n계좌이체",
      "img": null, 
    },
    { 
      "pid": 4,
      "method": "CARD",
      "easypay": "KAKAOPAY",
      "label": null,
      "content": null,
      "img": "kakaopay_icon.png", 
    },
    { 
      "pid": 5,
      "method": "CARD",
      "easypay": "NAVERPAY",
      "label": "적립 혜택",
      "content": null,
      "img": "naverpay_icon.png",
    },
    { 
      "pid": 6,
      "method": "CARD",
      "easypay": "TOSSPAY",
      "label": "결제혜택 할인",
      "content": null,
      "img": "toss_icon.png", 
    },
    { 
      "pid": 7,
      "method": "CARD",
      "easypay": "PAYCO",
      "label": null,
      "content": null,
      "img": "payco_icon.png",
    },
  ];

  const generalCreditList = [
    { 
      "cardCompany": "KOOKMIN",
      "img": "kb_icon.png",
      "content": "KB국민카드",
    },
    { 
      "cardCompany": "SHINHAN",
      "img": "shinhan_icon.png",
      "content": "신한카드",
    },
    { 
      "cardCompany": "LOTTE",
      "img": "lotte_icon.png",
      "content": "롯데카드",
    },
    { 
      "cardCompany": "BC",
      "img": "kb_icon.png",
      "content": "BC카드",
    },
    { 
      "cardCompany": "HYUNDAI",
      "img": "hyundai_icon.png",
      "content": "현대카드",
    },
    { 
      "cardCompany": "SAMSUNG",
      "img": "samsungcard_icon.png",
      "content": "삼성카드",
    },
    { 
      "cardCompany": "NONGHYEOP",
      "img": "NH_icon.png",
      "content": "NH카드",
    },
    { 
      "cardCompany": "HANA",
      "img": "hana_icon.png",
      "content": "하나카드",
    },
    { 
      "cardCompany": "WOORI",
      "img": "woori_icon.png",
      "content": "우리BC카드",
    },
    { 
      "cardCompany": "WOORI",
      "img": "woori_icon.png",
      "content": "우리카드",
    },
    { 
      "cardCompany": "CITI",
      "img": "citi_icon.png",
      "content": "씨티카드",
    },
    { 
      "cardCompany": "GWANGJUBANK",
      "img": "KJ_JB_icon.png",
      "content": "광주카드",
    },
    { 
      "cardCompany": "JEONBUKBANK",
      "img": "KJ_JB_icon.png",
      "content": "전북카드",
    },
    { 
      "cardCompany": "SUHYEOP",
      "img": "sh_icon.png",
      "content": "수협카드",
    },
    { 
      "cardCompany": "JEJUBANK",
      "img": "shinhan_icon.png",
      "content": "제주카드",
    },
    { 
      "cardCompany": "KAKAOBANK",
      "img": "kakaobank_icon.png",
      "content": "카카오뱅크",
    },
    
  ];

  return (<>
    <div className="payment-titleArea">
      <div className="payment-title">결제수단</div>
      <button className="payment-btn">카드혜택/무이자 안내</button>
    </div>
    <div id="payment-widget" />
    <div className="payment-generalList">
      <div className="pg-inputRadio">
        <input 
          type="radio"
          value={1}
          onChange={payRadioHandler}
          checked={payRadio === 1}
        />
        <span>빠른결제</span>
      </div>

      {/* 빠른결제 */}
      {
        payRadio === 1 && (<>
          <br/>
          <div>빠른결제구역</div>
          <br/>
        </>)
      }

      <div className="pg-inputRadio ir-bottom">
        <input 
          type="radio"
          value={2}
          onChange={payRadioHandler}
          checked={payRadio === 2}
        />
        <span>일반결제</span>
      </div>

      {/* 일반결제 */}
      {
        payRadio === 2 && (<>
          <ul>
            {
              generalList.map((g) => {
                const data = { 
                  "pid": g.pid,
                  "method": g.method, 
                  "easypay": g.easypay,
                }

                return (<>
                  <li>
                    <button 
                      className={`pgBtn ${ pgBtnState?.pid === g.pid && "clicked" }`}
                      onClick={() => setPgBtnState( data )} 
                    >
                      {
                        g.label &&
                          <div className="pgLabel">{ g.label }</div>
                      }
                      
                      { 
                        g.content 
                          ? g.content 
                          : <img 
                              style={ g.label && { margin: "5px auto 0"} } 
                              src={`/icon/${g.img}`}
                            /> 
                      }
                    </button>
                  </li>
                </>);
              })
            } 
          </ul>

          {/* 일반결제 - 신용카드 */}
          {
            pgBtnState.pid === 1 && (<>
              <div className="payment-generalCredit">
                <ul>
                  {
                    generalCreditList.map((gc) => {
                      const data = {
                        "content": gc.content,
                        "cardCompany": gc.cardCompany,
                      }

                      return (<>
                        <li>
                          <button
                            className={`pgcBtn ${ pgcBtnState?.content === gc.content && "clicked" }`}
                            onClick={() => setPgcBtnState( data )}
                          >
                            <img src={`/icon/${gc.img}`}/>
                            <div className="pgcContent">{ gc.content }</div>
                          </button>
                        </li>
                      </>)
                    })
                  }
                </ul>
              </div>
            </>)
          }

        </>)
      }

      
    </div>


  </>);
}