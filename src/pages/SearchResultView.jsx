import { useParams } from 'react-router-dom';
import '../css/SearchResultView.css';
import ListBox from "../components/Main/ListBox";
import Sidebar from '../components/Main/Sidebar';


export default function SearchResultView(){
  const { result } = useParams();
  const count = 414002;
  
  const list = [
    {
    "brand_name" : "HAZZYS LADIES",
    "name" : "[25SS] [HAZZYS HARRY] 반팔 스트라이트 티셔츠 아이보리",
    "discount" : 39,
    "price" : 69000,
    "delivery_state" : "Y",
    "free_delivery" : "N",
    "is_note" : "인기 급상승"
    },
    {
    "brand_name" : "HAZZYS LADIES",
    "name" : "[25SS] [HAZZYS HARRY] 반팔 스트라이트 티셔츠 아이보리",
    "discount" : 39,
    "price" : 69000,
    "delivery_state" : "Y",
    "free_delivery" : "N",
    "is_note" : "인기 급상승"
    },
    {
    "brand_name" : "HAZZYS LADIES",
    "name" : "[25SS] [HAZZYS HARRY] 반팔 스트라이트 티셔츠 아이보리",
    "discount" : 39,
    "price" : 69000,
    "delivery_state" : "Y",
    "free_delivery" : "N",
    "is_note" : "인기 급상승"
    },
    {
    "brand_name" : "HAZZYS LADIES",
    "name" : "[25SS] [HAZZYS HARRY] 반팔 스트라이트 티셔츠 아이보리",
    "discount" : 39,
    "price" : 69000,
    "delivery_state" : "Y",
    "free_delivery" : "N",
    "is_note" : "인기 급상승"
    },
    {
    "brand_name" : "HAZZYS LADIES",
    "name" : "[25SS] [HAZZYS HARRY] 반팔 스트라이트 티셔츠 아이보리",
    "discount" : 39,
    "price" : 69000,
    "delivery_state" : "Y",
    "free_delivery" : "N",
    "is_note" : "인기 급상승"
    },
    {
    "brand_name" : "HAZZYS LADIES",
    "name" : "[25SS] [HAZZYS HARRY] 반팔 스트라이트 티셔츠 아이보리",
    "discount" : 39,
    "price" : 69000,
    "delivery_state" : "Y",
    "free_delivery" : "N",
    "is_note" : "인기 급상승"
    },
    {
    "brand_name" : "HAZZYS LADIES",
    "name" : "[25SS] [HAZZYS HARRY] 반팔 스트라이트 티셔츠 아이보리",
    "discount" : 39,
    "price" : 69000,
    "delivery_state" : "Y",
    "free_delivery" : "N",
    "is_note" : "아울렛반값세일"
    },
  ]

  return(<>
    <div className='resultSearch'>
      { result ?  
        <>
          <div className='rs-result'>'{ result }'</div>
          <div>에 대한</div>
          <div className='rs-count'>{ count.toLocaleString() }</div>
          <div>개의 검색 결과</div>
        </>
        : ''
      }
      
    </div>
    <div className='content'>
      <Sidebar/>
      <div className="content-main">
        <div className='searchSort'>
          <button>신상품순</button>
          <button>낮은 가격순</button>
          <button>할인율 높은순</button>
          <button>높은 가격순</button>

        </div>
        <div className='content-wrap'>
          {
            list.map( (product) => (
              <ListBox product={ product } />
            ))
            
          }
        </div>
      </div>
    </div>
  </>);
}