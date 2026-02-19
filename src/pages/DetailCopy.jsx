import "../css/detailCopy.css"
import ToggleContent from "../components/ToggleContent";
import { useParams } from "react-router-dom";
import { useState , useEffect } from "react";

function DetailCopy() {

  const {productId} = useParams();
  console.log('productId : ', productId);
  const [isOpen , setIsOpen] = useState(false);
  const [productDetail , setProductDetail] = useState();
  const [option , setOption] = useState('');

  const [optionCount , setOptionCount] = useState(1);

  useEffect(() => {
      console.log('상세 페이지 useEffect 동작')
      fetch(`/api/outlet/category?productId=${productId}`)
      .then(response => response.json())
      .then(data => {
          console.log('상세페이지 서버 잘 다녀 왔냐 data : ' , data);
          setProductDetail(data.productDetail);
      })
      .catch(error => console.log('error : ' , error))
  }, []);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    }

    const handleIncrease = () => {
        setOptionCount(prev => prev + 1)
    }

    const handleDecrease = () => {
        setOptionCount(prev => (prev > 1 ? prev - 1 : 1))
    }    

    const handleSizeSelect = (size, idx) => {
      setOption(size?.size_name);
      setOptionCount(1);
    }

    const handleAddToCart = async () => {
        if (!option){
            alert('옵션을 선택해 주세요.');
            return;
        }

        try {
            const response = await fetch ("/api/outlet", {
                method: "POST",
                headers : {
                    "Content-type" : "application/json"
                },
                body : JSON.stringify({
                    productId : productId,
                    option : option,
                    quantity : optionCount,
                })
            })
            if (response){
                alert('쇼핑백 담긴')
            }
        } catch (error) {console.error('넷웍 에러 : ' ,error)}
    }    

    const discountPrice = productDetail?.price * (1-productDetail?.discount / 100);

  return (
    <>
    <main className="contentArea" role="main">
      <div className="Product_productWrap__rYpAN">
        {/* Hidden Inputs */}
        <input id="user_logged_in_gtm" type="hidden" readOnly value="false" />
        <input id="customer_id_gtm" type="hidden" readOnly value="5e543256c480ac577d30f76f9120eb74" />
        <input id="user_email_plain_text_gtm" type="hidden" readOnly value="" />
        <input id="user_email_md5_gtm" type="hidden" readOnly value="" />
        <input id="user_email_sha256_gtm" type="hidden" readOnly value="" />
        <input id="item_id_gtm" type="hidden" readOnly value="HSDR5C701E3" />
        <input id="item_name_gtm" type="hidden" readOnly value="쉬폰 체크 원피스 다크그린" />
        <input id="img_url_gtm" type="hidden" readOnly value="https://nimg.lfmall.co.kr/file/product/prd/HS/2025/750/HSDR5C701E3_00.jpg" />
        <input id="item_brand_gtm" type="hidden" readOnly value="헤지스 여성" />
        <input id="fixed_price_gtm" type="hidden" readOnly value="499000" />
        <input id="price_gtm" type="hidden" readOnly value="404190" />
        <input id="soldout_gtm" type="hidden" readOnly value="N" />
        <input id="category_gtm" type="hidden" readOnly value="여성의류|원피스|반팔원피스" />
        <input id="item_category_name_1_gtm" type="hidden" readOnly value="여성의류" />
        <input id="item_category_name_2_gtm" type="hidden" readOnly value="원피스" />
        <input id="item_category_name_3_gtm" type="hidden" readOnly value="반팔원피스" />

        {/* 카테고리 경로 */}
        <div className="CommonLocationPath_commonPath__35Vus">
          <ul>
            <li><a href="/app/">홈</a></li>
            <li><a href="/app/exhibition/category/110050">여성의류</a></li>
            <li><a href="/app/exhibition/category/110122">원피스</a></li>
            <li><a href="/app/exhibition/category/110133">롱/맥시</a></li>
          </ul>
        </div>

        {/* 상품 이미지 및 정보 */}
        <div className="Product_divideWrap__Gvda">
          <div className="Product_leftWrap__y4E8F">
            <div className="ProductImage_productImage__MxryJ">
              <img src={`/img/${encodeURIComponent(productDetail?.images[0].name)}`} alt="쉬폰 체크 원피스 다크그린" style={{ width: "100%" }} />
            </div>
            {/* <div className="ProductImage_productImage__MxryJ">
              <img src={`/img/${encodeURIComponent(productDetail?.images[1].name)}`} alt="쉬폰 체크 원피스 다크그린" style={{ width: "100%" }} />
            </div>             */}
          </div>
          {/* 우측 상품 정보 */}
          <div className="Product_rightWrap__vLWpx">
            <div className="ProductBasic_brand__HcGas">
              <a href="#!">{productDetail?.brand_name}</a>
              <a href="#!">원피스</a>
            </div>
            <div className="ProductBasic_prdTitBox__FO7wL">
              <div className="ProductBasic_prdTit__40ZvN">{productDetail?.name}</div>
            </div>
            <div className="ProductBasic_priceGroup__t3wWL">
              <div className="ProductBasic_priceList__I275m">
                <span className="ProductBasic_oriPrice__UEMjP">{productDetail?.price}</span>
                <div className="ProductBasic_inner__WxL0K">
                  <span className="ProductBasic_dcPercent__HeI1C">{productDetail?.discount}%</span>
                  <span className="ProductBasic_discountPrice__SUMoW">{discountPrice.toLocaleString()}</span>
                  <span className="ProductBasic_unit__BuAz5">원</span>
                  <span>
                    <button type="button" className="iconQuestion">정보 보기</button>
                  </span>
                </div>
              </div>
              <div className="ProductBasic_btnCoupon__TSP+U">
                <button type="button" className="LfButton_lfButton__djCj2 LfButton_sizePC3__Le7hc LfButton_strokeBlack__N3z8I">혜택받기</button>
              </div>
            </div>
            {/* 혜택가, 할인, 쿠폰 안내 등 */}
            <div className="ProductBenefit_priceMaximum__gMKyv false">
              <div className="ProductBenefit_priceTit__XMhMG">
                <div className="ProductBenefit_flexBox__XeNGP">
                  <div className="ProductBenefit_flexInner__aXUxY">
                    <div className="ProductBenefit_flexItem__npXH4 ProductBenefit_flexPrice__uRBJz">
                      <span className="ProductBenefit_txt__adHTJ">혜택가</span>
                      <span className="ProductBenefit_price__Q5gV3">{discountPrice.toLocaleString()}</span>
                      <span className="ProductBenefit_unit__ontuN">원</span>
                    </div>
                    <div className="ProductBenefit_flexItem__npXH4">
                      <span className="TagGrade_grade__h7huv  TagGrade_productDetail__NLSGl">일반</span>
                      <span className="ProductBenefit_mileage__0I2qX">{productDetail?.price * 0.01}M 적립예정</span>
                      <button type="button" className="iconQuestion" />
                    </div>
                  </div>
                  <button type="button" className="ProductBenefit_btnMore__rQjY6">자세히보기</button>
                </div>
                <a className="ProductBenefit_btnJoin__CmVZd" href="/app/login">회원가입하고 혜택받기</a>
              </div>
              <div className="ProductBenefit_priceCont__mnZPJ ProductBenefit_firstPurchase__esPj1 undefined">
                <div className="ProductBenefit_item__x71Z- ProductBenefit_first__OiSyx">
                  <div className="ProductBenefit_major__v1rOo">
                    <div className="ProductBenefit_inner__oPpCZ">
                      <span>혜택가</span>
                      <strong>{discountPrice.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
                <div className="ProductBenefit_item__x71Z- ProductBenefit_important__2uuOQ">
                  <div className="ProductBenefit_major__v1rOo">
                    <div className="ProductBenefit_inner__oPpCZ">
                      <span>최초 판매가</span>
                      <strong>{productDetail?.price.toLocaleString()}원</strong>
                    </div>
                  </div>
                  <div className="ProductBenefit_major__v1rOo">
                    <div className="ProductBenefit_inner__oPpCZ">
                      <span>LF 즉시할인 10%</span>
                      <strong>-49,900원</strong>
                    </div>
                  </div>
                </div>
                <div className="ProductBenefit_item__x71Z-">
                  <div className="ProductBenefit_major__v1rOo">
                    <div className="ProductBenefit_inner__oPpCZ">
                      <span>상품 쿠폰 할인</span>
                      <strong>- 44,910원</strong>
                    </div>
                  </div>
                  <div className="ProductBenefit_detail__5ibou">
                    <div className="ProductBenefit_inner__oPpCZ">
                      <span>일반쿠폰 10%</span>
                      <span>- 44,910원</span>
                    </div>
                  </div>
                </div>
                <ul className="ProductBenefit_noticeList__nGzix">
                  <li>고객님의 첫 구매 최대 예상 혜택가입니다.</li>
                  <li>첫 구매 이벤트 참여 시 혜택 적용 가능합니다.</li>
                  <li>혜택 다운로드 여부에 따라 최종 결제금액이 달라질 수 있습니다.</li>
                  <li>상품 한 개 기준으로 계산된 금액입니다.</li>
                  <li>최대 할인혜택은 주문서에서 확인 가능합니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 해시태그 */}
        <div className="ProductHashTag_hashTagBox__dBvkp">
          <div className="ProductHashTag_sectionTitle__CWduQ">관련 검색어</div>
          <div className="ProductHashTag_hashTagList__4KZbi">
            <a href="/app/search/result/25FW?saleType=1">25FW</a>
            <a href="/app/search/result/%EC%84%A0%EB%AC%BC%ED%8F%AC%EC%9E%A5">선물포장</a>
            <a href="/app/search/result/%EC%89%AC%ED%8F%B0%EB%A1%B1%EC%9B%90%ED%94%BC%EC%8A%A4">쉬폰롱원피스</a>
            <a href="/app/search/result/%EC%97%AC%EC%84%B1%20%EC%9B%90%ED%94%BC%EC%8A%A4">여성 원피스</a>
            <a href="/app/search/result/%EA%B0%80%EC%9D%84%EC%9B%90%ED%94%BC%EC%8A%A4">가을원피스</a>
            <a href="/app/search/result/%EC%B2%B4%ED%81%AC%20%EC%9B%90%ED%94%BC%EC%8A%A4">체크 원피스</a>
          </div>
        </div>

        {/* 상품 상세/설명, 리뷰, 정보 안내 등 매우 방대한 섹션은 아래와 같이 섹션별 컴포넌트 분리 권장 */}
        {/* <ProductDetail /> */}
        {/* <ProductReview /> */}
        {/* <ProductInfoNotice /> */}
        {/* ...생략 */}

        {/* 옵션 선택, 구매 버튼부 예시 */}
        <div className="ProductInfo_stickyArea__s6L+n">
          <div className="ProductOrder_sectionTitle__DWFwr">옵션 선택</div>
          <div>
            <div className="ProductColorChips_productColorChips__bxSre">
              <h3 className="ProductColorChips_optionName__pAwnm">
                <strong>컬러</strong>진한 초록(404,190원)
              </h3>
              <ul>
                <li className="ProductColorChips_on__T9rbi ProductColorChips_almostOut__gTRSE">
                  <button type="button">
                    <img src="https://nimg.lfmall.co.kr/file/product/prd/HS/2025/130/HSDR5C701E3_04.jpg/dims/format/avif;fallback=webp/optimize" alt="진한 초록" />
                  </button>
                  <span className="ProductColorChips_almostOut__gTRSE">품절임박</span>
                </li>
              </ul>
            </div>
            <div className="ProductSizeChips_productSizeChips__u1Cnq">
              <div className="ProductSizeChips_titleGroup__XVioL">
                <h3>
                  <strong>사이즈</strong>
                </h3>
                <button type="button" className="ProductSizeChips_buttonSizeInfo__THyyF">사이즈안내</button>
              </div>
              <div>
                <div className="ProductSizeChips_sizeChipWrap__FgPgd">
                  <ul>
                      {productDetail?.size?.map((sz, idx) => (
                        <li key={sz.size_name} className="ProductSizeChips_almostOut__S4UcS">
                          <input
                            type="radio"
                            id={`withProductInfo_${sz.size_id}`}
                            name="withProductInfo_radioSize"
                            value={sz.size_name}
                            checked={option === sz.size_name}
                            onChange={() => handleSizeSelect(sz, idx)}
                          />
                          <label htmlFor={`withProductInfo_${sz.size_id}`}>{`0${sz.size_name}`}</label>
                          <span className="ProductSizeChips_almostOut__S4UcS">100개 남음</span>
                        </li>
                      ))}                    
                  </ul>
                </div>
                 {/* 여기? */}
                 {option && (< OrderData
                            productDetail={productDetail}
                            selectedSize={productDetail?.size.find(sz => sz.size_name === option)}
                            optionCount={optionCount}
                            handleIncrease={handleIncrease}
                            handleDecrease={handleDecrease}                                
                 />)}

              </div>
            </div>
            <div className="ProductButtonArea_productButtonArea__sQlq1">
              <button type="button" className="LfButton_lfButton__djCj2 LfButton_sizePC5__7Gjip LfButton_strokeBlack__N3z8I ProductButtonArea_buttonLike__6g-9T connectedWish">143</button>
              <button type="button" className="LfButton_lfButton__djCj2 LfButton_sizePC5__7Gjip LfButton_strokeBlack__N3z8I ProductButtonArea_primary__E8fYU" id="shoppingbag_button_1_gtm">쇼핑백</button>
              <button type="button" className="LfButton_lfButton__djCj2 LfButton_sizePC5__7Gjip LfButton_fillBlack__Cy1XN ProductButtonArea_primary__E8fYU">바로구매</button>
            </div>
          </div>
        </div>
        {/* 기타 리뷰, 공지, 배송/반품/교환 안내 등은 동일 패턴으로 conversion */}
      </div>
    </main>
    </>
  );
}

export default DetailCopy;

function OrderData({productDetail, selectedSize, optionCount, handleIncrease, handleDecrease}) {
  if (!selectedSize) return null;

  return (
    <>
    <div className="ProductSelectBox_item__A1HP2 ProductSelectBox_minH__wXFJV">
      <button type="button" className="ProductSelectBox_buttonRemove__Bey3F"></button>
      <span className="ProductSelectBox_thumb__BJ9Lm" style={{width : '30px' , height : '30px'}}>
        <img
          src={`/img/${encodeURIComponent(productDetail?.images[0].name)}`}
          alt={productDetail?.name}
        />
      </span>
      <div className="ProductSelectBox_infoWrap__pr3ix">
        <span className="ProductSelectBox_prodTitle__TW-ss">{productDetail?.name}</span>
        <div className="ProductSelectBox_option__EZro3">
          <span className="ProductSelectBox_etcSize__Ww10s">{selectedSize?.display || `0${selectedSize?.size_name}`}</span>
        </div>
        <div className="ProductSelectBox_editBox__A+ZdZ">
          <div className="ProductSelectBox_countController__q5PoH">
            <button type="button" className="ProductSelectBox_buttonMinus__p9zQd" onClick={handleDecrease}></button>
            <input type="text" title="구매수량" readOnly value={optionCount} />
            <button type="button" className="ProductSelectBox_buttonPlus__BpBOi" onClick={handleIncrease}></button>
          </div>
          <div className="ProductSelectBox_priceBox__6pweB">
            <span className="ProductSelectBox_price__KACfJ">
              {(productDetail?.price * optionCount).toLocaleString()}
              <em>원</em>
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}