import '../css/ListView.css';
import { useLocation } from "react-router-dom";
import ListBox from "../components/Main/ListBox";
import { FetchCall } from '../FetchCall';
import { useEffect, useState } from 'react';
import { SortList } from '../components/SortListData';


export default function ListView(){
  const category_id = useLocation().pathname.split('/')[3];
  const sorts = SortList.find((sort) => sort.category_id == category_id )?.sorts || [];
  const [products, setProducts] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [sortId, setSortId] = useState(0);

  const handleClick = ( id ) => {
    setSortId(id);
  }

  const callBackFunc = ( res ) => {
    setProducts(prev => [...prev, ...res]);
  }

  useEffect(() => {
    setProducts([]);
    setSortId(0);

    if (category_id == 1) {
      FetchCall("/api/product/list", "POST", { category_id: 0, gender: "female" }, callBackFunc);
      return;
    }

    if (category_id == 2) {
      FetchCall("/api/product/list", "POST", { category_id: 0, gender: "male" }, callBackFunc);
      return;
    }

    FetchCall("/api/product/list", "POST", { category_id }, callBackFunc);
    if( category_id == 3){
      FetchCall("/api/product/list", "POST", { "category_id" : 4 }, callBackFunc);
    }
  }, [category_id]);

  useEffect(() => {
    if (sortId === 0) {
      setFilteredList(products);
    } else {
      setFilteredList(
        products.filter((product) => 
          sortId.includes(product.parent_category_id) ||
          sortId.includes(product.category_id)
        ) 
      );
    }
  }, [sortId, products]);

  return(<>
    <div className='productContent'>
      <div className='productContent-title'> 베스트 상품 </div>    
      <div className='productContent-sort'>
        <button 
          onClick={() => handleClick(0)}
          className={sortId === 0 ? 'clicked' : ''}
        >
          전체
        </button>
        {
          sorts?.map((sort) => (
            <button 
              key={sort.label} 
              onClick={() => handleClick(sort.id)}
              className={sortId == sort.id ? 'clicked' : ''}
            >
              {sort.label}
            </button>
          ))
        }

      </div>  
      <div className="productContent-main">
        <div className='productContent-wrap'>
          {
            filteredList && filteredList.length > 0
              ? (
              filteredList.slice(0, 100).map( (product, index) => {
                // 0~3번 인덱스일 때 다르게 설정
                const boxWidth = index >= 0 && index <= 3 ? 295 : 190;
                const boxHeight = index >= 0 && index <= 3 ? 458 : 315;
                
                return (
                  <ListBox 
                    key={product.product_id}
                    product={product}
                    index={index}
                    width={boxWidth}
                    height={boxHeight}
                    is_search={false}
                  />
                )
              })
            ) : (
              <div className='nonProducts'>상품이 존재하지 않습니다.</div>
            )
          }
        </div>
      </div>
    </div>
    
  </>);
}
