import { useEffect, useState, useRef } from "react";
import { FetchCall } from "../FetchCall";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../css/watchlist.css";
import { WatchedListBox } from "./WatchedListBox";

const WatchedList = () => {
  const [watchedProducts, setWatchedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const ITEMS_PER_VIEW = 4;

  // ref들
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);

  // localStorage에서 최근 본 상품 불러오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem("watchedProduct");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchedProducts(parsed);
        }
      }
    } catch (error) {
      console.error("localStorage 읽기 에러:", error);
      setWatchedProducts([]);
    }
  }, []);

  // 상품 정보 가져오기
  useEffect(() => {
    if (watchedProducts.length > 0) {
      getProducts(watchedProducts);
    } else {
      setProducts([]);
    }
  }, [watchedProducts]);

  // Swiper 네비게이션 업데이트
  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current && paginationRef.current) {
      // 네비게이션 업데이트
      swiperInstance.navigation.update();
      swiperInstance.pagination.update();
    }
  }, [swiperInstance, products]);

  const getProducts = (productIds) => {
    if (!Array.isArray(productIds) || productIds.length === 0) return;
    
    FetchCall(
      `/api/product/batch?ids=${productIds.join(",")}`,
      "GET",
      null,
      (res) => {
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("상품 정보 가져오기 실패");
          setProducts([]);
        }
      }
    );
  };

  // 상품 제거 함수
  const removeProduct = (productId) => {
    try {
      const updatedIds = watchedProducts.filter(id => id !== productId);
      const updatedProducts = products.filter(p => p.product_id !== productId);
      
      setWatchedProducts(updatedIds);
      setProducts(updatedProducts);
      
      if (updatedIds.length === 0) {
        localStorage.removeItem("watchedProduct");
      } else {
        localStorage.setItem("watchedProduct", JSON.stringify(updatedIds));
      }
    } catch (error) {
      console.error("상품 제거 에러:", error);
    }
  };

  // 페이지 계산
  const totalPages = Math.ceil(products.length / ITEMS_PER_VIEW);
  const hasMultiplePages = totalPages > 1;

  // 빈 상태
  if (products.length === 0) {
    return (
      <div className="watched-list-container">
        <div className="watched-list-empty">
          <div className="empty-title">최근 본 상품이 없습니다</div>
          <div className="empty-description">
            상품을 둘러보시면 최근 본 상품이 여기에 표시됩니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="watched-list-container">
      <div className="watched-swiper-wrapper">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          slidesPerGroup={1}
          speed={200}
          loop={hasMultiplePages} // 페이지가 여러 개일 때만 loop 활성화
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{
            el: paginationRef.current,
            type: "fraction",
          }}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            
            // 네비게이션과 페이지네이션 엘리먼트 할당
            setTimeout(() => {
              if (prevRef.current && nextRef.current && paginationRef.current) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.params.pagination.el = paginationRef.current;
                
                swiper.navigation.init();
                swiper.navigation.update();
                swiper.pagination.init();
                swiper.pagination.update();
              }
            }, 0);
          }}
          className="watched-products-swiper"
        >
          {Array.from({ length: totalPages }, (_, pageIndex) => (
            <SwiperSlide key={pageIndex}>
              <div className="products-list">
                {products
                  .slice(
                    pageIndex * ITEMS_PER_VIEW,
                    (pageIndex + 1) * ITEMS_PER_VIEW
                  )
                  .map((product) => (
                    <WatchedListBox
                      key={product.product_id}
                      product={product}
                      onRemove={() => removeProduct(product.product_id)}
                    />
                  ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 네비게이션 컨트롤 */}
        {hasMultiplePages && (
          <div className="recent-viewed-controls">
            <button
              className="recent-viewed-btn-prev"
              ref={prevRef}
              aria-label="이전"
            >
              <RiArrowLeftSLine />
            </button>

            <div 
              className="recent-viewed-pagination" 
              ref={paginationRef}
            />

            <button
              className="recent-viewed-btn-next"
              ref={nextRef}
              aria-label="다음"
            >
              <RiArrowRightSLine />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchedList;