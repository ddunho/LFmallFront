import { Link, useNavigate, useParams } from "react-router-dom"
import { TopMenuData } from '../components/TopMenuData'
import '../css/ProductDetail.css';
import { useEffect, useRef, useState } from "react";
import { FetchCall } from "../FetchCall";
import SelectedProductCard from "../components/SelectedProductCard";
import { ColorNames } from "../components/ColorNamesData";
import { useAuth } from "../AuthContext";
import CustomModal from "../components/CustomModal";
import AlertModal from "../components/AlertModal";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../css/ContentSlide.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import ListBox from "../components/Main/ListBox";
import { useModalState } from "../hooks/useModalState"; // 새로 추가된 훅
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

export default function ProductDetail(){
  const productId = useParams().productId;
  const navigate = useNavigate();
  const { member } = useAuth();
  const member_id = Number(member?.member_id);
  
  // 기존 모달 상태들을 통합
  const { modals, openModal, closeModal } = useModalState();

  // 나머지 상태들은 그대로 유지
  const [product, setProduct] = useState();
  const [detailImgList, setDetailImgList] = useState([]);
  const [relatedSearch, setRelatedSearch] = useState([]);
  const [menuPath, setMenuPath] = useState();
  const [categories, setCategories] = useState();
  const [selectedImg, setSelectedImg] = useState();
  const [zoomState, setZoomState] = useState({
    active: false,
    x: 50,
    y: 50,
  });
  const [deliveryBtn, setDeliveryBtn] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [sizeOfColor, setSizeOfColor] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  
  const discountPrice = product?.price * (100-product?.discount) / 100
  const totalPrice = selectedOption.reduce(
    (acc, opt) => acc + opt.quantity * discountPrice, 0 );
  console.log('옵션>>>>>', options);

  // 바로구매 세션 스토리지 초기화
  localStorage.removeItem("product_info");
  sessionStorage.removeItem("nowBuy");

  // unique color 객체
  const uniqueColorObjects = Array.from(
    new Map(options.map(item => [
      item.color_id, { color_id: item.color_id, color_name: item.color_name }
    ])).values() 
  );

  useEffect(() => {
    if (!selectedColor) return;

    const findSize = Array.from(
      new Map(
        options
          .filter(item => 
            item.color_id === selectedColor || item.color_name === 'X')
          .map(item => [item.size_id, { 
            option_id: item.option_id,
            size_id: item.size_id, 
            size_name: item.size_name 
          }])
      ).values()
    );

    console.log( '찾은 사이즈', findSize );
    setSizeOfColor( findSize );
  }, [selectedColor, options]);

  // 배송 날짜 계산
  const today = new Date();
  const base = new Date(today);
  if (today.getDay() === 0) {
    base.setDate(base.getDate() + 1);
  }

  const d1 = new Date(base);
  d1.setDate(base.getDate() + 0);

  const d2 = new Date(base);
  d2.setDate(base.getDate() + 1);

  const d3 = new Date(base);
  d3.setDate(base.getDate() + 2);
  const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

  // 클릭 이벤트들
  const imgClick = ( name ) => { setSelectedImg(name); }
  const deliveryClick = () => { setDeliveryBtn(!deliveryBtn); }
  const colorClick = ( id ) => { setSelectedColor(id); }

  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomState({
      active: true,
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const handleZoomLeave = () => {
    setZoomState((prev) => ({ ...prev, active: false }));
  };
  
  const sizeClick = ( option_id ) => {
    const alreadySelected = selectedOption.some(item => item.option_id === option_id);
    if( alreadySelected ) {
      // 기존: setAlertModalOpen(true); setAlertModalmsg('이미 선택한 상품입니다.\n수량을 조절해주세요.');
      openModal('alert', '이미 선택한 상품입니다.\n수량을 조절해주세요.');
      return false;
    }

    setSelectedOption((prev) => {
      const newArr = [
        ...prev,
        { member_id, option_id, quantity: 1, product }
      ];
      newArr.sort((a,b) => a.option_id - b.option_id);
      return newArr;
    });
  }

  // 상품 수량(+,-) 버튼
  const quantityBtn = ( option_id, type ) => {
    setSelectedOption((prev) => 
      prev.map((item) => {
        if ( item.option_id !== option_id ) return item;

        if ( type === "plus" ) {
          return { ...item, quantity: item.quantity + 1 };
        } else if (type === "minus" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }

        return item;
      })
    )
  }

  // 상품 삭제 버튼
  const deleteClick = ( option_id ) => {
    setSelectedOption(prev =>
      prev.filter(item => item.option_id !== option_id)
    );
  }

  const btnClick = (e) => {
    e.stopPropagation(); 
    alert('버튼 이벤트'); 
  }

  useEffect(() => {
    console.log("현재 옵션 리스트:", selectedOption);
  }, [selectedOption]);

  // 상품/옵션 정보
  useEffect(() => {
    FetchCall("/api/product/detail", "POST", productId, productCallBack);
    FetchCall("/api/product/option", "POST", productId, optionCallBack);
  }, []);
  
  // 콜백 함수
  const productCallBack = ( res ) => {
    setProduct(res.product);
    setDetailImgList(res.imgList);
    setSelectedImg(res.product.img_names[0]);

    const matches = res.product.name.match(/\[([^\]]+)\]/g)?.map(s => s.slice(1, -1)) || [];
    setRelatedSearch([...matches, res.product.brand_name ]);
  }

  const optionCallBack = ( res ) => { 
    setOptions(res);
    setSelectedColor(res[0].color_id);
  }

  // 카테고리명 찾기
  function findLabel( path ) {
    let result = [];

    function idToName( data, i ) {
      for ( const item of data ) {
        if ( item.href === path[i] ) {
          result.push( item.label );

          if (i + 1 < path.length && item.categories) {
            idToName( item.categories, i + 1 );
          }
          return;
        }
      }
    }

    idToName( TopMenuData, 0 );
    return result.length > 0 ? result : null;
  }

  useEffect(() => {
    if ( !product ) return;

    const menuPath = product.path.split("/");
    const categories = findLabel( menuPath );
    setMenuPath( menuPath );
    setCategories( categories );
  }, [product]);

  useEffect(() => {
    setZoomState((prev) => ({ ...prev, active: false }));
  }, [selectedImg]);

  // 쇼핑백 담기 - 모달 메시지 처리 개선
  const addCartCallBack = ( res ) => {
    console.log('res', res);

    // 옵션 선택 x
    if( selectedOption.length === 0 ){ 
      // 기존: setAlertModalOpen(true); setAlertModalmsg("사이즈를 선택하세요.");
      openModal('alert', "사이즈를 선택하세요.");
      return false; 
    }

    if( !member ){ navigate("/app/login"); return false; }

    // 쇼핑백 성공 메시지 처리
    let message = '';
    if( res ){ message = '상품을 쇼핑백에 담았습니다.'; }
    if( res.updateCount == 1 && res.updateQty ){
      message = message + `\n담긴 수량이 ${res.updateQty}개가 되었습니다.`;
    } else if( res.updateCount > 0 ){
      message = message + "\n다른 옵션 상품이 쇼핑백에 있습니다.";
    }
    
    // 기존: setCartMsg(message); setCartModalOpen(true);
    openModal('cart', message);
  }

  const addCartItems = () => {
    FetchCall("/api/cart/addcart", "POST", selectedOption, addCartCallBack);
  }

  // 바로구매
  const nowBuyClick = () => {
    localStorage.setItem("product_info", JSON.stringify(product));
    
    const nowBuySelectedOption = selectedOption.map(selectedItem => {
      const fullOptionInfo = options.find(option => 
        option.option_id === selectedItem.option_id
      );
      
      return {
        quantity: selectedItem.quantity,
        option_id: selectedItem.option_id,
        stock: fullOptionInfo?.stock || 0,
        size_name: fullOptionInfo?.size_name || '',
        color_name: fullOptionInfo?.color_name || '',
      };
    });
    
    sessionStorage.setItem("nowBuy", JSON.stringify(nowBuySelectedOption));
  
    navigate('/app/order');
  }

  return (<>
    <div className="detail_wrap">

      {/* 상단 카테고리 구역 */}
      <div className="detail_titlearea">
        <ul>
          <li><Link to={"/app/menu/0"} style={{ color: '#757575', }}>홈</Link></li>
          {
            categories && 
              categories.map((item, index) => (
                <>
                  <li>
                    <img src="/icon/arrow_right.png" />
                  </li>
                  <li key={ item }>
                    <Link
                      to={`/app/brand/${ menuPath[index] }`}
                      style={{ 
                        color: categories.length !== index+1 && '#757575' 
                      }}
                    >
                      { item }
                    </Link>
                  </li>
                </>
              ))
          }
        </ul>
      </div>

      <div className="detail_dividearea">
        {/* 콘텐츠 왼쪽 구역 */}
        <div className="detail_leftarea">
          <div className="dl_divedearea1">

            {/* 상품 썸네일 이미지 구역 */}
            <div className="selected_img">
              {
                selectedImg && (
                  <div
                    className="selected_img_inner"
                    onMouseMove={handleZoomMove}
                    onMouseEnter={handleZoomMove}
                    onMouseLeave={handleZoomLeave}
                  >
                    <img src={ `/img/${selectedImg}` } />
                    <div
                      className={`selected_img_zoom ${zoomState.active ? "active" : ""}`}
                      style={{
                        backgroundImage: `url(/img/${selectedImg})`,
                        backgroundSize: "240%",
                        backgroundPosition: `${zoomState.x}% ${zoomState.y}%`,
                      }}
                    />
                  </div>
                )
              }
            </div>
            <div className="imgList">
              {
                product && product.img_names && product.img_names.map((img) => (
                  <div className="imgBox">
                    <div 
                      key={img} 
                      className={`imgWrapper ${ img === selectedImg ? 'selected' : '' }`}
                    >
                      <img src={`/img/${img}`} onClick={() => imgClick(img)} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* 관련 검색어 */}
          <div className="product_relatedSearch">
            <div className="pr_title">관련 검색어</div>
            <div className="pr_searchcontent">
              {
                relatedSearch.map((search) => (
                  <Link to={`/app/search/result/${search}`}>
                     {search}
                  </Link>
                ))
              }
            </div>
          </div>

          {/* 상품 추천 */}
          <div className="product_recommend">
            <div className="prc_title">
              이런 상품 어때요?
            </div>
            <div className="prc_slide">
              <Swiper>
                <SwiperSlide>

                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          {/* 상품 배너 */}
          <Link className="product_banner">
            <img src="/banner/banner.avif"/>
          </Link>

          {/* 상품 정보탭 */}
          <div className="product_tabsContainer">
            <a><span className="pt_information">상품정보</span></a>
            <a><span className="pt_size">사이즈</span></a>
            <a><span className="pt_review">상품리뷰</span></a>
            <a><span className="pr_recommned">상품추천</span></a>
          </div>

          {/* 상품 상세 이미지 */}
          <div className="detail_img_detail">
            <p style={{ whiteSpace: 'pre-line' }}>
              { product?.comment != null && product?.comment.replace(/\\n/g, '\n') }
            </p>
            <br/>
            {
              detailImgList && detailImgList.length > 0
                ? detailImgList?.map((img) => (
                    <img
                      className="di_img"
                      src={`/img/detail/${img.name}`}
                    />
                  ))
                : (<>
                  <img 
                    className="di_img"
                    src='/img/detail/img_default1.jpg'
                  />
                  <img 
                    className="di_img"
                    src='/img/detail/img_default2.jpg'
                  />
                </>)
            }
          </div>
        </div>

        {/* 콘텐츠 오른쪽 구역 */}
        <div className="detail_rightarea">
          <div className="product_information">

            {/* 브랜드명 */}
            <div className="product_brandName">
              <div>
                <Link 
                  style={{ 
                    fontSize: '15px',
                    fontWeight: 'bold',
                  }}
                  to={`/app/brand/${product?.brand_name}`}
                >
                  { product?.brand_name }
                </Link>
                <img src="/icon/arrow_right.png" />
                <Link 
                  style={{
                    fontSize: '15px',
                    textDecoration: 'underline',
                  }}
                  to={`app/brand/${product?.brand_name}/${categories?.[categories.length-2]}`}
                >
                  { categories?.[categories.length-2] }
                </Link>
              </div>
              
              <button>
                <img className="product_shardIcon" src="/icon/share_icon.png"/>
              </button>
            </div>

            {/* 상품명 */}
            <div className="product_name">{ product?.name }</div>
            {
              product?.is_note != null && 
                <div className="product_isNote">{ product?.is_note }</div>
            }

            {/* 가격 */}
            <div className="product_priceBox">
              <div className="product_priceBox_left">
                {
                  product?.discount > 0 &&
                    <div className="product_price">{ product?.price.toLocaleString() }원</div>
                }
                <div className="product_discountBox">
                  {
                    product?.discount > 0 &&
                      <div className="product_discount">{ product?.discount }%</div>
                  }
                  <div className="product_discount_price">
                    { discountPrice.toLocaleString() }</div>
                  <div className="product_won">원</div>
                  <button>
                    <img src="/icon/btn_question.png" />
                  </button>
                </div>
              </div>

              <div className="product_priceBox_right">
                <button>
                  <div>혜택받기</div>
                  <img src="/icon/download_icon.png" />
                </button>
              </div>
              
            </div>
          </div>
          
          {/* 배송상태 */}
          <div className="product_card">
            <div className="product_card_left">
              <div>배송정보</div>
            </div>
            <div className="product_card_right">
              <div className="product_delivery_right_top">
                <div className="pd_delivery_type">
                  {
                    product?.delivery_state === 'Y' 
                      ? <img src="/icon/lfdelivey_icon.png" />
                      : <div className="pd_dilivery_state">{ product?.delivery_state }</div>
                  }
                  <div className="pd_verticalBar">|</div>
                  <div>CJ대한통운</div>
                </div>
                <div className="pd_free_delivery">
                  {
                    product?.free_delivery === 'Y'
                      ? <div>무료배송</div>
                      : <div>배송비 { Number(product?.free_delivery).toLocaleString() }원</div>
                  }
                </div>
              </div>
              <div className="product_delivery_right_bottom">
                <button onClick={() => deliveryClick()}>
                  <div className="pd_deliveryDate_left">
                    <div className="pd_deliveryDate_left_top">
                      {
                        d2.getDay === 0
                          ? (
                            <div>
                              {d3.getMonth() + 1}/{d3.getDate()} ({WEEKDAY[d3.getDay()]}) 이내 도착확률 98%
                            </div>
                          )
                          : (
                            <div>
                              {d2.getMonth() + 1}/{d2.getDate()} ({WEEKDAY[d2.getDay()]}) 이내 도착확률 98%
                            </div>
                          )
                      }
                      <button onClick={(e) => btnClick(e)}>
                        <img src="/icon/btn_question.png" />
                      </button>
                    </div>
                    <div className="pd_deliveryDate_left_bottom">
                      <div>전국 평균 기준</div>
                    </div>
                  </div>
                  <div className="pd_deliveryDate_right">
                    <img
                      style={{
                        transition: 'transform 0.5s ease',
                        transform: deliveryBtn ? 'rotate(-180deg)' : '',
                      }} 
                      src="/icon/arrow_down.png" 
                    />
                  </div>
                </button>
              </div>
              
              {/* 배송 도착 확률 표시 */}
              <div className={`pd_deliveryDateBtn ${deliveryBtn ? 'show' : ''}`}>
                <div className="pd_date1">
                  {
                    d1.getDay() !== 0 && (<>
                      <div>
                        {d1.getMonth() + 1}/{d1.getDate()} ({WEEKDAY[d1.getDay()]}) 이내 도착확률
                      </div>
                      <div>51%</div>  
                    </>)
                  }
                </div >
                <div className="pd_date2">
                  {
                    d2.getDay() !== 0 && (<>
                      <div>
                        {d2.getMonth() + 1}/{d2.getDate()} ({WEEKDAY[d2.getDay()]}) 이내 도착확률
                      </div>
                      <div>93%</div>  
                    </>)
                  }
                </div>
                <div className="pd_date3">
                  {
                    d3.getDay() !== 0 && (<>
                      <div>
                        {d3.getMonth() + 1}/{d3.getDate()} ({WEEKDAY[d3.getDay()]}) 이내 도착확률
                      </div>
                      <div>98%</div> 
                    </>)
                  }
                </div>
              </div>

            </div>
          </div>

          {/* 카드혜택 */}
          <div className="product_card">
            <div className="product_card_left">
              <div>카드혜택</div>
            </div>
            <div className="product_card_right pc_cardBenefit">
              <button>
                <span>LFmall 신용카드 결제시 </span>
                <span style={{ fontWeight: 'bold' }}>5% 추가할인</span>
                <img className="arrowRightIcon" src="/icon/arrow_right_black.png"/>
              </button>
              
              <button>
                <span>LFpay KB국민카드 최대 30,000원 즉시 할인 외 2건</span>
                <img className="arrowRightIcon" src="/icon/arrow_right_black.png"/>
              </button>

              <button>
                <span>카드사별 할부 혜택</span>
                <img className="arrowRightIcon" src="/icon/arrow_right_black.png"/>
              </button>
              
            </div>
          </div>

          {/* 매장정보 */}
          <div className="product_card">
            <div className="product_card_left">
              <div>매장정보</div>
            </div>
            <div className="product_card_right">
              
              <button>
                <span>구매 가능한 매장</span>
                <img className="arrowRightIcon" src="/icon/arrow_right_black.png"/>
              </button>

            </div>
          </div>

          {/* 옵션(sticky) */}
          <div className="product_stickyarea">
            <div className="ps_optionTitle">옵션 선택</div>
            
            <div className="ps_optionContent">
              {/* 색상 */}
              {
                uniqueColorObjects.some(color => color.color_name !== 'X') &&
                  <div className="ps_colorTitle">컬러</div>
              }
              <div className="ps_colorContent">
                {
                  uniqueColorObjects.map((color) => {
                    if( color.color_name === 'X' ){ return null };
                    
                    const filterColorEn = ColorNames.find((c) => 
                      c.color_id === color.color_id )?.color_en;
                    
                    return(<>
                      <button
                        key={color.color_id}
                        className="ps_selectContent"
                        onClick={() => colorClick(color.color_id)}
                      >
                        <div className={ `ps_selectBox ${ selectedColor === color.color_id ? 'selected' : '' }` }>
                          <div 
                            style={{
                              display: 'inline-block',
                              width: '12px',
                              height: '12px',
                              backgroundColor: color.color_name || 'transparent',
                              border: '1px solid #eeeeee',
                              marginRight: '5px',
                            }}
                          />
                          <span>{ filterColorEn }</span>
                        </div>
                      </button> 
                    </>)
                  })
                }
              </div>

              {/* 사이즈 */}
              <div className="ps_sizeTitle">
                <div className="ps_sizeTitle_left">사이즈</div>
                <div className="ps_sizeTitle_right">
                  <button>
                    <div>사이즈안내</div>
                    <img className="arrowRightIcon" src="/icon/arrow_right_black.png"/>
                  </button>
                </div>
              </div>
              <div className="ps_sizeContent">
                {
                  sizeOfColor.map((size) => (
                    <button 
                      key={size.size_name}
                      className="ps_selectContent"
                      onClick={() => sizeClick(size.option_id)}
                    >
                      <div className="ps_selectBox">{size.size_name}</div>
                    </button>
                  ))
                }
              </div>

              {/* 선택한 상품 카드 구역 */}
              {
                selectedOption.map((item, index) => {
                  const filterOption = options.find(( option ) => 
                    item.option_id === option.option_id )
                  console.log('필터옵션>>>', filterOption);

                  return (
                    <SelectedProductCard
                      key={`sp${index}`}
                      product={product}
                      option={filterOption}
                      quantity={item.quantity}
                      deleteClick={() => deleteClick(item.option_id)}
                      quantityBtn={quantityBtn}
                    />
                  )
                })
              }

            </div>

            {/* 총 상품금액 */}
            {
              selectedOption.length > 0 && (
                <div className="product_totalAmount">
                  총 상품금액
                  <span className="pt_price">{totalPrice.toLocaleString()}원</span>
                </div>
              )
            }
            

            {/* 버튼 구역 */}
            <div className="product_buttonarea">
              <button className="pb_likeBtn">
                <img src="/icon/heart_icon_blank.png"/>
                <div>58</div>
              </button>
              <button className="pb_cartBtn" onClick={addCartItems}>쇼핑백</button>
              <button className="pb_buyBtn" onClick={nowBuyClick}>바로구매</button>
            </div>
          </div>

          {/* 모달 구역 - 통합된 상태 사용 */}
            {/* 알림창 모달 */}
            <AlertModal
              isOpen={modals.alert.isOpen}
              onClose={() => closeModal('alert')}
              content={modals.alert.message}
            />

            {/* 쇼핑백 모달 */}
            <CustomModal
              isOpen={modals.cart.isOpen}
              onClose={() => closeModal('cart')}
              title="쇼핑백"
            >
              <div className="modal_msg">
                {modals.cart.message}
              </div>

              <div className="modal_btnarea">
                <button 
                  className="goCartBtn"
                  onClick={() => navigate('/app/cart')}
                >
                  쇼핑백 가기
                </button>
                <button 
                  className="exitBtn"
                  onClick={() => closeModal('cart')}
                >
                  쇼핑 계속하기
                </button>
              </div>
            </CustomModal>

        </div>
      </div>
    </div>
  </>)
}
