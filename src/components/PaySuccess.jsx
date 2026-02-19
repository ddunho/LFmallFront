import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { ColorNames } from "./ColorNamesData";

const PaySuccess = () => {
  const [searchParams] = useSearchParams();
  const { member } = useAuth();

  // 쿼리 파라미터 값들 가져오기
  const paymentType = searchParams.get("paymentType");
  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");

  const orderinfo = JSON.parse(localStorage.getItem("orderinfo"));
  const orderCompleteItems = JSON.parse(
    localStorage.getItem("orderCompleteItems")
  );

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "0";
    return new Intl.NumberFormat("ko-KR").format(price);
  };

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

  return (
    <div>
      <div className="OrderComplete_orderInfo__QPGuh">
        <div className="OrderComplete_orderMessage__IagZl">
          {member?.name} 님의 주문이 완료되었습니다.
        </div>
        <div className="OrderComplete_resultDetail__6alkQ">
          <dl>
            <dt>주문번호</dt>
            <dd>
              <a
                className="OrderComplete_link__xvgq2"
                href="/app/order/complete"
              >
                {`${orderId.split("_")[1]}_${orderId.split("_")[2]}`}
              </a>
            </dd>
          </dl>
          <dl>
            <dt>배송정보</dt>
            <dd>
              <div>{orderinfo.recipientName}</div>
              <div>
                {orderinfo.recipientFixAddress},{" "}
                {orderinfo.recipientDetailAddress}
              </div>
            </dd>
          </dl>
          <dl>
            <dt>결제수단</dt>
            <dd>
              <div>실시간계좌이체 / 토스페이</div>
            </dd>
          </dl>
          <dl>
            <dt>결제금액</dt>
            <dd>
              <strong>{formatPrice(amount)}원</strong>
            </dd>
          </dl>
          <dl>
            <dt>적립예정</dt>
            <dd>
              <div>140M</div>
              <div>(주문 14일 후 적립 예정입니다)</div>
            </dd>
          </dl>
        </div>
      </div>

      <div className="OrderComplete_orderList__WWFGB">
        <div className="OrderComplete_arrivalDate__9dM60">
          <em>{getDeliveryDate()}</em>도착예정
        </div>

        <div className="OrderComplete_orderProdList__kc4PZ">
          {orderCompleteItems &&
            orderCompleteItems.map((item, index) => (
              <div key={index} className="orderProdItem">
                <div className="OrderComplete_tdInfo__VNIB9">
                  <a
                    className="OrderComplete_prodImg__YYPUJ"
                    href={`/app/product/${item.product_id || "E0WJXX01616"}`}
                  >
                    <img
                      src={
                        item.image_name ||
                        "https://nimg.lfmall.co.kr/file/product/prd/E0WJ/XXXX/375/E0WJXX01616_00.jpg/dims/format/avif;fallback=webp/optimize"
                      }
                      alt={item.productName || ""}
                    />
                  </a>
                  <div className="OrderComplete_prodInfo__hwzZZ">
                    <a
                      href={`/app/product/${item.product_id || "E0WJXX01616"}`}
                    >
                      <div className="OrderComplete_brand__Q4eXL">
                        {item.brand_name || "Kinloch"}
                      </div>
                      <div className="OrderComplete_name__G5tP7">
                        {item.product_name ||
                          "[갤러리아] 킨록 F/W 데일리용 스트레치울 사방스판 캐주얼 셋업팬츠 2종 GGI3512"}
                      </div>
                    </a>
                    <div className="OrderComplete_option__U0Hym">
                      <span>
                        {`${getColorKoName(item.color_name)} / ${item.size_name} / ${item.quantity}개 ` ||
                          "1.차콜그레이 / 86(34~35) / 1개"}
                      </span>
                    </div>
                    <div className="OrderComplete_price__mel7r">
                      {formatPrice(item.total_price || 30030)}원
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PaySuccess;
