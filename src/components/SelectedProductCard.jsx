import '../css/SelectedProductCard.css'
import { ColorNames } from './ColorNamesData';

export default function SelectedProductCard({
  product, 
  option,
  quantity,
  deleteClick,
  quantityBtn,
}){

  const discountPrice = product.price * (100-product?.discount) / 100
  const colorName = ColorNames.find((color) => option?.color_id == color.color_id )?.color_en ?? '';;

  return(<>
    <div className='sp_cardWrap'>
      <div className='sp_content'>
        <div className='sp_content_left'>
          <img src={`/img/${product.img_names[0]}`} />
        </div>

        <div className='sp_content_right'>
          <div className='sp_name'>{product.name}</div>
          <button 
            className='sp_closeBtn'
            onClick={() => deleteClick()}
          >
            <img src='/icon/close_icon.png' />
          </button>
          <div className='sp_option'>
            {option?.size_name}{ option?.color_name !== "X" && `( ${colorName} )`}
          </div>
          <div className='sp_quantity'>
            <div className='sp_quantityBtn'>
              <button onClick={() => quantityBtn(option?.option_id, 'minus')}>
                <img src='/icon/quantity_minus.png'/>
              </button>
              <div>{quantity}</div>
              <button onClick={() => quantityBtn(option?.option_id, 'plus')}>
                <img src='/icon/quantity_plus.png'/>
              </button>
            </div>
            <div className='sp_price'>{discountPrice.toLocaleString()}원</div>
          </div>
        </div>
      </div>
    </div>
  </>);
}