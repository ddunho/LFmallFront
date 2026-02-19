function ToggleContent({productDetail}){
    return(
        <>
            <div className="toggle_main">
                <div className="toggle_benefit_price">
                    <div className="price_row">
                        <span>혜택가</span>
                        <strong>{productDetail?.price}원</strong>
                    </div>
                </div>
                <hr />
                <div className="toggle_first_price">
                    <div className="price_row">
                        <span>최초 판매가</span>
                        <strong>{productDetail?.price}원</strong>
                    </div>
                    <div className="price_row">
                        <span>LF 즉시할인 44%</span>
                        <strong>{productDetail?.price}원</strong>
                    </div>
                </div>
                <hr />
                <div className="toggle_cupon">
                    <div className="price_row">
                        <span>상품 쿠폰 할인</span>
                        <strong>{productDetail?.price}원</strong>
                    </div>
                    <div className="price_row">
                        <span>일반쿠폰 13%</span>
                        <strong>{productDetail?.price}원</strong>
                    </div>               
                </div>
                <hr />
                <div>
                    <ul>
                        <li>
                            고객님의 첫 구매 최대 예상 혜택가입니다.
                        </li>
                        <li>
                            첫 구매 이벤트 참여 시 혜택 적용 가능합니다.
                        </li>
                        <li>
                            혜택 다운로드 여부에 따라 최종 결제금액이 달라질 수 있습니다.
                        </li>
                        <li>
                            상품 한 개 기준으로 계산된 금액입니다.
                        </li>
                        <li>
                            최대 할인혜택은 주문서에서 확인 가능합니다.
                        </li>
                    </ul>    
                </div>                                          
            </div>
        </>
    );
}

export default ToggleContent;