import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FetchCall } from "../FetchCall";
import { useEffect, useState } from "react";
import CartPricediv from "./CartPricediv";
import { useCartPrice } from "../CartPriceContext";
import { ChangeOptionModal } from "./ChangeOptionModal";
import { ColorNames } from "./ColorNamesData";
console.log("🔥 cartList.jsx loaded");
const CartItem = () => {
  const navigate = useNavigate();
  const { member } = useAuth();
  const [cartList, setCartList] = useState([]);
  const { setSelectedItems } = useCartPrice();
  const [selectCheckbox, setSelectCheckBox] = useState({});
  const [allselectcheckbox, setAllselectcheckbox] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [changeOption, setChangeOption] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [onebuyNow, setOnebuyNow] = useState([]);

  const getCart = () => {
    FetchCall(
      `/api/cart/carts`,
      "POST",
      {},
      (res) => {
        console.log("res.success : " , res.success);
        if (res.success) {
          

          setCartList(res.data);
          // 장바구니 데이터 로드 시 체크박스 상태 초기화
          const initialCheckbox = {};
          res.data.forEach((item) => {
            initialCheckbox[item.cartId] = false;
          });
          setSelectCheckBox(initialCheckbox);
          setAllselectcheckbox(false);

          setSelectedItems([]);
        }
        else {console.log("res.success : ", res.success)}
      }
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (member) { // && member.memberId
        getCart();
      } else {
        console.log(member);
        navigate("/app/login");
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [member, navigate]);

  // selectedItems 변경될 때마다 저장(여러개)
  useEffect(() => {
    if (selectedCartItem && selectedCartItem.length > 0) {
      sessionStorage.setItem("cartBuy", JSON.stringify(selectedCartItem));
    } else {
      sessionStorage.removeItem("cartBuy");
    }
  }, [selectedCartItem]);

  // 개별 체크박스 핸들러
  const onHandleCheckbox = (e) => {
    const cartId = e.target.value;
    const isChecked = e.target.checked;

    setSelectCheckBox((prev) => ({
      ...prev,
      [cartId]: isChecked,
    }));

    // Context의 selectedItems 업데이트
    if (isChecked) {
      const selectedProduct = cartList.find((item) => item.cartId == cartId);
      setSelectedItems((prev) => [...prev, selectedProduct]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item.cartId != cartId));
    }

    // 전체 선택 상태 확인
    const newSelectCheckbox = {
      ...selectCheckbox,
      [cartId]: isChecked,
    };
    const allChecked = Object.values(newSelectCheckbox).every(
      (checked) => checked
    );
    setAllselectcheckbox(allChecked);
  };

  // 전체 선택/해제 핸들러
  const onHandleAllSelect = () => {
    const newAllSelectState = !allselectcheckbox;
    setAllselectcheckbox(newAllSelectState);

    // 모든 체크박스 상태 업데이트
    const newSelectCheckbox = {};
    cartList.forEach((item) => {
      newSelectCheckbox[item.cartId] = newAllSelectState;
    });
    setSelectCheckBox(newSelectCheckbox);

    // selectItem 업데이트
    if (newAllSelectState) {
      setSelectedItems([...cartList]);
    } else {
      setSelectedItems([]);
    }
  };

  // 가격 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleQuantityChange = (cartId, newQuantity) => {
    FetchCall(
      "/api/cart/chquantity",
      "POST",
      { cart_id: cartId, quantity: newQuantity },
      (res) => {
        if (res.success) {
          console.log("수량업데이트", res.message);
          setCartList((prevCartList) =>
            prevCartList.map((item) =>
              item.cartId === cartId
                ? { ...item, quantity: parseInt(newQuantity) }
                : item
            )
          );
        } else {
          console.error("수량업데이트 변경 실패");
        }
      }
    );

    // 2. 선택된 아이템이 있다면 context의 selectedItems도 업데이트
    setSelectedItems((prevSelected) =>
      prevSelected.map((item) =>
        item.cart_id === cartId
          ? { ...item, quantity: parseInt(newQuantity) }
          : item
      )
    );
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
  const HandleOnclickChangeOption = (item) => {
    setSelectedCartItem(item);
    setChangeOption(true);
  };
  const handleOptionUpdate = (cartId, optionId, quantity) => {
    FetchCall(
      "/api/cart/update-option",
      "POST",
      {
        cart_id: cartId,
        option_id: optionId,
        quantity: quantity,
        member_id: member.member_id,
      },
      (res) => {
        if (res.success) {
          getCart(); // 장바구니 새로고침
          setChangeOption(false);
          setSelectedCartItem(null);
        } else {
          alert("옵션 변경에 실패했습니다.");
        }
      }
    );
  };

  const getColorKoName = (colorName) => {
    const color = ColorNames.find((c) => c.color_name === colorName);
    return color ? color.color_ko : colorName;
  };

  const handleDelete = (cartIds) => {
    if (cartIds.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    if (
      window.confirm(`선택한 ${cartIds.length}개의 상품을 삭제하시겠습니까?`)
    ) {
      FetchCall(
        "/api/cart/delete",
        "POST",
        {
          cart_ids: cartIds,
          member_id: member.member_id,
        },
        (res) => {
          if (res.success) {
            getCart(); // 장바구니 새로고침
            setSelectCheckBox({});
            setAllselectcheckbox(false);
            setSelectedItems([]);
          } else {
            alert("삭제에 실패했습니다.");
          }
        }
      );
    }
  };

  // 선택삭제 핸들러
  const onClickSelectedDelete = () => {
    const selectedCartIds = Object.keys(selectCheckbox)
      .filter((cartId) => selectCheckbox[cartId])
      .map((cartId) => parseInt(cartId));

    handleDelete(selectedCartIds);
  };

  // 개별삭제 핸들러
  const onClickDelete = (cartId) => {
    handleDelete([cartId]);
  };

  const onClickbuyNow = (item) => {
      const productCallBack = ( res ) => {
        localStorage.setItem("product_info", JSON.stringify(res));
      }
      const optionCallBack = ( res ) => {
        localStorage.setItem("nowBuy", JSON.stringify(res));
      }

    FetchCall("/api/product/detail", "POST", item.productId, productCallBack);
    FetchCall("/api/product/option", "POST", item.optionId, optionCallBack);
    // todo : 장바구니 item의 option 정보가 어디에 있더라?
    sessionStorage.setItem("nowBuy", JSON.stringify(item));
    navigate("/app/order");
    //onebuyNow()
  };

  return (
    <>
      <div style={{ marginBottom: "15px" }}>
        <button className="cart-table__select-all" onClick={onHandleAllSelect}>
          전체선택
        </button>
        <button
          className="cart-table__selected-delete"
          onClick={onClickSelectedDelete}
        >
          선택삭제
        </button>
      </div>

      <table className="cart-table">
        <thead className="cart-table__header">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allselectcheckbox}
                onChange={onHandleAllSelect}
              />
            </th>
            <th>상품정보</th>
            <th>상품금액</th>
            <th>배송비</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="cart-table__body">
          {cartList.length > 0 ? (
            cartList.map((item, index) => (
              <tr key={item.cartId || index}>
                <td className="cart-table__checkbox">
                  <input
                    type="checkbox"
                    value={item.cartId}
                    checked={selectCheckbox[item.cartId] || false}
                    onChange={onHandleCheckbox}
                  />
                </td>

                <td className="cart-table__product">
                  <div className="cart-table__product-image">
                    <div className="cartitem-eachimg">
                      <img
                        src={`/img/${item.imgName}`}
                        alt={item.productName}
                        className="cartitem-product-img"
                        onError={(e) => {
                          if (e.currentTarget.dataset.fallbackApplied) return; // ✅ 재진입 차단
                          e.currentTarget.dataset.fallbackApplied = "1";
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                  </div>

                  <div className="cart-table__product-info">
                    <div className="cart-table__brand">{item.brandName}</div>
                    <div className="cart-table__product-name">
                      {item.productName || "상품정보"}
                    </div>
                    <div className="cart-table__options">
                      {item.optionColor === "X" ? "" : `${getColorKoName(item.optionColor)} / `}{item.optionSize} / {" "}
                      {item.cartQuantity}개
                    </div>

                    <div className="cart-table__quantity-selector">
                      <select
                        className="cart-table__quantity-select"
                        value={item.cartQuantity}
                        onChange={(e) =>
                          handleQuantityChange(item.cartId, e.target.value)
                        }
                      >
                        {[...Array(item.stock)].map((_, i) => ( // todo : db에 물품 재고 수량 column이 없음.
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <button
                        className="cart-table__options-btn"
                        onClick={() => HandleOnclickChangeOption(item)}
                      >
                        옵션변경
                      </button>
                      {changeOption && selectedCartItem && (
                        <ChangeOptionModal
                          item={selectedCartItem}
                          onClose={() => {
                            setChangeOption(false);
                            setSelectedCartItem(null);
                          }}
                          onOptionUpdate={handleOptionUpdate}
                        />
                      )}
                    </div>

                    <div className="cart-table__promotion">
                      {getDeliveryDate()} 이내 도착확률 91%
                    </div>
                  </div>
                </td>

                <td className="cart-table__price">
                  <div className="cart-table__original-price">
                    {formatPrice(item.productPrice * item.cartQuantity)}원
                  </div>
                  <div className="cart-table__current-price">
                    {formatPrice(
                      ((item.productPrice * (100 - (item.discount || 0))) / 100) *
                        item.cartQuantity
                    )}
                    원
                  </div>
                </td>

                <td
                  className={`cart-table__delivery ${item.free_delivery === "Y" ? "cart-table__delivery--free" : ""}`}
                >
                  {item.free_delivery === "Y"
                    ? "무료"
                    : `${formatPrice(item.delivery_fee || 3000)}원`}
                </td>

                <td className="cart-table__actions">
                  <button
                    className="cart-table__btn cart-table__btn--primary"
                    onClick={() => onClickbuyNow(item)}
                  >
                    바로구매
                  </button>
                  <button
                    className="cart-table__btn cart-table__btn--danger"
                    onClick={() => onClickDelete(item.cartId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="cart-table__empty">
                장바구니가 비어있습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <CartPricediv />
    </>
  );
};

export default CartItem;
