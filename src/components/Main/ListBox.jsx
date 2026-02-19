import samplePic from "../../pic/0MST5A901G3_00.avif";
import logoPic from "../../pic/icon/lf_logo_mini.png";
import "../../css/ListBox.css";
import { useNavigate } from "react-router-dom";

export default function ListBox({
  product,
  index,
  width = 230,
  height = 530,
  is_search = true,
  is_option = true, // 추가된 prop
}) {
  const navigate = useNavigate();
  const discountPrice = (product.price * (100 - product.discount)) / 100;

  const textStyle = {
    whiteSpace: is_search ? "normal" : "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const onClickproduct = (e) => {
  e.preventDefault();
  //본 상품 localstorage에서 가져와서 저장하는 방법(26줄~32줄)
  let existingWatchedProducts = [];
  try {
    const stored = localStorage.getItem("watchedProduct");
    if (stored) {
      existingWatchedProducts = JSON.parse(stored);
    }
  } catch (error) {
    console.error("localStorage 파싱 에러:", error);
    existingWatchedProducts = [];
  }

  if (!existingWatchedProducts.includes(product.product_id)) {
    // 없으면 맨 앞에 추가
    const updatedWatchedProducts = [
      product.product_id,
      ...existingWatchedProducts,
    ];
    localStorage.setItem(
      "watchedProduct",
      JSON.stringify(updatedWatchedProducts)
    );
  } else {
    // 있으면 제거하고 맨 앞에 추가
    const filteredProducts = existingWatchedProducts.filter(
      id => id !== product.product_id
    );
    const updatedWatchedProducts = [product.product_id, ...filteredProducts];
    localStorage.setItem(
      "watchedProduct",
      JSON.stringify(updatedWatchedProducts)
    );
  }

  is_search
    ? window.open(`/app/product/${product.product_id}`, "_blank")
    : navigate(`/app/product/${product.product_id}`);
};

  return (
    <div
      className="listBox"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <a className="lb-imgBox" href="#" onClick={onClickproduct}>
        {index >= 0 && index <= 3 && <div className="lb-rank">{index + 1}</div>}
        {product.img_names && product.img_names.length > 0 ? (
          product.img_names.map((img, i) => (
            <img
              key={img}
              className={`lb-productimg ${i === 0 ? "main" : i === 1 ? "hover" : ""}`}
              src={`/img/${encodeURIComponent(img)}`}
              alt="상품 이미지"
            />
          ))
        ) : (
          <img className="lb-productimg" src={samplePic} alt="샘플 이미지" />
        )}
      </a>

      <div className="lb-contentBox">
        <a
          className="lb-brand"
          href="#"
          onClick={onClickproduct}
          style={textStyle}
        >
          {product.brand_name}
        </a>
        <a
          className="lb-name"
          href="#"
          onClick={onClickproduct}
          style={textStyle}
        >
          {product.name}
        </a>
        <div className="lb-pricebox">
          {/* 할인율 0일시 표시 x */}
          {product.discount > 0 && (
            <>
              <div className="lb-discount">{product.discount}%</div>
              <div className="lb-price">{product.price.toLocaleString()}</div>
            </>
          )}
          <div className="lb-discount-price">
            {discountPrice.toLocaleString()}
          </div>
        </div>

        {/* is_option이 true일 때만 표시 */}
        {is_option && (
          <>
            {/* <div className='lb-rate'>★ 4.7 (221)</div> */}
            <div className="lb-colorbox">
              {product.color &&
                product.color
                  .filter((color) => color !== "X")
                  .map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: color,
                        border: "1px solid lightgray",
                      }}
                    />
                  ))}
            </div>
          </>
        )}

        {/* is_search가 true일 때만 배송 정보 표시 */}
        {is_search && (
          <>
            {product.delivery_state === "Y" && (
              <div className="lb-delivery">
                <img src={logoPic} alt="로고" />
                <div className="lb-state">슝배송</div>
              </div>
            )}
            {product.is_note && product.is_note !== "X" && (
              <div className="lb-note">{product.is_note}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
