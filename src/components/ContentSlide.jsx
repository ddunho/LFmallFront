import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../css/ContentSlide.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { useLocation } from 'react-router-dom';
// 전체 슬라이드 리스트
import { AllSlideList } from './SlideListData';

export default function ContentSlide(){
  const category_id = useLocation().pathname.split('/')[3];
  const slideList = category_id == 0 
  ? AllSlideList
  : AllSlideList.filter( (slide) => slide.category_id == category_id );

  return (<>
    <div className='content-slide'>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation // 좌우 화살표
        pagination={{
          type: 'custom',
          renderCustom: function (swiper, current, total) {
            return `<div class="custom-pagination-wrapper">
                      <img src="/icon/card_navi.png" alt="pagination" class="pagination-bg" />
                      <div class="pagination-text">
                        <div class="swiper-pagination-current">${current}</div>
                        <div class="swiper-pagination-total">${total}</div>
                      </div>
                    </div>`;
          }
        }}
        autoplay={{ delay: 6000 }} // 자동재생
        speed={1000} // 밀리초 단위(기본값: 300ms)
        loop={true}
        spaceBetween={0}      // 슬라이드 사이 간격
        centeredSlides={true}
      >
        {
          slideList.map( (slide, index) => (
            <SwiperSlide key={index}>
              <div className="slide-container">
                <img 
                  className='slide-img' 
                  src={`/slide/${slide.image}`} 
                  alt={`배너${index+1}`} 
                />
                <div className="slide-text-overlay">
                  <div className="slide-brand">{slide.brand}</div>
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-subtitle">{slide.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  </>);
}