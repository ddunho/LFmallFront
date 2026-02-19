import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/detail.css"
import ToggleContent from "../components/ToggleContent";

function Detail () {

    const {categoryId,productId} = useParams();
    console.log('categoryId : ' , categoryId);
    const [productDetail , setProductDetail] = useState();
    console.log('productId : ' , productId);

    const [isOpen , setIsOpen] = useState(false);

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

    const handleDecreage = () => {
        setOptionCount(prev => (prev > 1 ? prev - 1 : 1))
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

    return(
        <>
            <div>
                <div className="category_king">
                    <ul>
                        <li>
                            <a href="/app">홈</a>
                        </li>
                        <li>
                            <a href="/app/outlet/20250101">여성의류</a>
                        </li>
                        <li>
                            <a href="/app/outlet/20250201">티셔츠</a>
                        </li>
                        <li>
                            <a href="/app/outlet/20250202">반팔</a>
                        </li>                                                                        
                    </ul>
                </div>

                <div className="product_container">
                    <div className="product_picture">
                        <div className="picture_main">
                            <img src={`/img/${encodeURIComponent(productDetail?.images[0].name)}`} alt="걍 때려박은 이미지" />
                        </div>
                        <div className="picture_thumbnails">
                            <div>
                                <img src={`/img/${encodeURIComponent(productDetail?.images[1].name)}`} />
                            </div>
                            <div>
                                <img src="" />1
                            </div>
                            <div>
                                <img src="" />
                            </div>   
                            <div>
                                <img src="" />
                            </div>                                                                                                          
                        </div>
                        
                    </div>             
                    <div className="product_info">
                        <div className="product_content">
                            <div className="product_brand">
                                {productDetail?.brand_name}  <a href="/app/outlet/20250201">티셔츠</a>
                            </div>
                            <div className="product_title">
                                [24SS][가격인하][스테디셀러]{productDetail?.name}
                            </div>
                            <div>
                                아울렛 빅 엿
                            </div>
                            <div className="product_regular_price">
                                {productDetail?.price} 원
                            </div>       
                            <div className="product_price">
                                <span>{productDetail?.discount}%</span> {productDetail?.price * (1-productDetail?.discount / 100)} 원
                            </div>
                        </div>
                        <hr />
                        <div className="benefit_section">
                            <div className="benefit_price">혜택가 {productDetail?.price} 원</div>
                            <div className="benefit_point">{productDetail?.price * 0.01}M 적립예정</div>
                            <span className="toggle_icon" onClick={handleToggle}>{isOpen ? '▽' : '△' }
                            </span>
                            <div className="benefit_signup">
                                <a href="/app/signup">회원가입하고 혜택받기</a>
                            </div>
                            <div className={`benefit_content ${isOpen ? 'open' : ''}`}>
                                {isOpen && <ToggleContent productDetail={productDetail} />}
                            </div>                            
                        </div>

                        <div className="delivery_section">

                        </div>

                        <div className="option_section">
                            <div><h3>옵션 선택</h3></div>
                            <div className="option_detail">
                                <select value={option} onChange={(e) => {setOption(e.target.value)}}>
                                    <option value="" disabled hidden>색상/사이즈</option>
                                    <option value="화이트/F">화이트/F</option>
                                    <option value="카키/F">카키/F</option>
                                    <option value="네이비/F">네이비/F</option>
                                    <option value="블랙/F">블랙/F</option>
                                </select>

                                <div>
                                    {option &&
                                        <div className="option_select">
                                            <div className="option_name">
                                                <span>{option}</span>
                                            </div>

                                            <div className="option_count">
                                                <button onClick={handleDecreage}>-</button>
                                                <span>{optionCount}</span>
                                                <button onClick={handleIncrease}>+</button>
                                            </div>

                                            <div className="option_price">
                                                <span>13,930 * {optionCount}원</span>
                                            </div>

                                            <div className="option_remove">
                                                <span>X</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="shopping_bag_section">
                            {/* <a href="/app/shopping">쇼핑백</a> */}
                            <button onClick={handleAddToCart}>쇼핑백</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Detail;