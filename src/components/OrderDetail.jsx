import { useDaumPostcodePopup } from "react-daum-postcode";
import Postcode from "react-daum-postcode";
import { useState, useEffect } from "react";

const OrderDetail = ({ orderinfo, setOrderinfo }) => {
  const [phone1, setPhone1] = useState("010");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const scriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  const open = useDaumPostcodePopup(scriptUrl);

  console.log(orderinfo);

  const onClickDaumPostcode = () => {
    open({ onComplete: handleAddressComplete });
  };
  const handleAddressComplete = (data) => {
    const baseAddress = data.address;
    const zipcode = data.zonecode;

    console.log(zipcode);

    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
    }
    const formattedextraAddress = "(" + extraAddress + ")";

    const fulladdress = baseAddress + " " + formattedextraAddress;

    setOrderinfo((prev) => ({
      ...prev,
      recipientFixAddress: fulladdress,
      recipientZipCode: data.zonecode,
    }));
  };

  // input 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderinfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // checkbox 변경 핸들러
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setOrderinfo((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDeliverySelectChange = (e) => {
    const { value } = e.target;

    if (value === "I") {
      setShowCustomInput(true);
      setOrderinfo((prev) => ({
        ...prev,
        orderMsgOption: value,
      }));
    } else {
      setShowCustomInput(false);
      setCustomMessage(""); // 다른 옵션 선택시 커스텀 메시지 초기화
      setOrderinfo((prev) => ({
        ...prev,
        orderMsgOption: value,
      }));
    }
  };

  const handleCustomMessageChange = (e) => {
    setCustomMessage(e.target.value);
    setOrderinfo((prev) => ({
      ...prev,
      customMsgOption: e.target.value,
    }));
  };

  useEffect(() => {
    const fullPhone = phone2 && phone3 ? `${phone1}-${phone2}-${phone3}` : "";
    setOrderinfo((prev) => ({
      ...prev,
      recipientMobilePhone: fullPhone,
    }));
  }, [phone1, phone2, phone3, setOrderinfo]);

  useEffect(() => {
    if (orderinfo?.recipientMobilePhone) {
      const phoneParts = orderinfo.recipientMobilePhone.split("-");
      if (phoneParts.length === 3) {
        setPhone1(phoneParts[0] || "010");
        setPhone2(phoneParts[1] || "");
        setPhone3(phoneParts[2] || "");
      }
    }
  }, []);

  return (<>
    <div className="orderdet_container">
      <div className="orderdet_header">
        <h2 className="orderdet_title">배송정보</h2>
        <button className="orderdet_directInput">직접 입력</button>
      </div>

      <table className="orderdet_table">
        <tbody>
          <tr className="orderdet_table_row">
            <td className="orderdet_table_label">
              보내는 분<span className="orderdet_question">?</span>
            </td>
            <td className="orderdet_table_input">
              <input
                type="text"
                className="orderdet_input"
                name="orderMemberName"
                placeholder="보내는 분의 이름을 입력해주세요"
                maxLength="10"
                value={orderinfo?.orderMemberName || ""}
                onChange={handleInputChange}
              />
            </td>
          </tr>

          <tr className="orderdet_table_row">
            <td className="orderdet_table_label">받는 분</td>
            <td className="orderdet_table_input">
              <input
                type="text"
                className="orderdet_input"
                name="recipientName"
                placeholder="받는 분의 이름을 입력해주세요"
                maxLength="10"
                value={orderinfo?.recipientName || ""}
                onChange={handleInputChange}
              />
            </td>
          </tr>

          <tr className="orderdet_table_row">
            <td className="orderdet_table_label">연락처</td>
            <td className="orderdet_table_input">
              <div className="orderdet_phoneGroup">
                <select
                  className="orderdet_phonePrefix"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                  <option value="050">050</option>
                  <option value="070">070</option>
                </select>
                <span className="orderdet_separator">-</span>
                <input
                  type="text"
                  className="orderdet_phoneInput"
                  maxLength="4"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                />
                <span className="orderdet_separator">-</span>
                <input
                  type="text"
                  className="orderdet_phoneInput"
                  maxLength="4"
                  value={phone3}
                  onChange={(e) => setPhone3(e.target.value)}
                />
              </div>
            </td>
          </tr>

          <tr className="orderdet_table_row">
            <td className="orderdet_table_label">주소</td>
            <td className="orderdet_table_input">
              <div className="orderdet_addressGroup">
                <div className="orderdet_zipGroup">
                  <input
                    className="orderdet_zipInput"
                    type="text"
                    name="recipientZipCode"
                    placeholder="우편번호"
                    value={orderinfo?.recipientZipCode || ""}
                    readOnly
                  />
                  <button
                    className="orderdet_zipButton"
                    onClick={onClickDaumPostcode}
                  >
                    우편번호 찾기
                  </button>
                </div>
                <input
                  type="text"
                  className="orderdet_addressInput"
                  name="recipientFixAddress"
                  placeholder="기본주소"
                  value={orderinfo?.recipientFixAddress || ""}
                  readOnly
                />
                <input
                  type="text"
                  className="orderdet_addressInput"
                  name="recipientDetailAddress"
                  placeholder="상세주소를 입력해주세요"
                  value={orderinfo?.recipientDetailAddress || ""}
                  onChange={handleInputChange}
                />
              </div>
            </td>
          </tr>

          <tr className="orderdet_table_row">
            <td className="orderdet_table_label">배송요청사항</td>
            <td className="orderdet_table_input">
              <div className="orderdet_deliveryContainer">
                <select
                  className="orderdet_deliverySelect"
                  name="orderMsgOption"
                  value={orderinfo?.orderMsgOption || ""}
                  onChange={handleDeliverySelectChange}
                >
                  <option value="">배송 장소를 선택해주세요(선택)</option>
                  <option value="direct">직접 받고 부재 시 문 앞에 놓아주세요</option>
                  <option value="door">문 앞에 놓아주세요</option>
                  <option value="security">경비실에 맡겨주세요</option>
                  <option value="box">택배함에 넣어주세요</option>
                  <option value="I">직접 입력하기</option>
                </select>

                {showCustomInput && (
                  <textarea 
                    className="orderdet_deliveryTextarea"
                    onChange={handleCustomMessageChange}
                    placeholder="배송받으실 장소를 입력해주세요. ※ 선물포장 관련 요청사항은 반영되지 않습니다."
                    value={customMessage}
                    maxlength="50">
                  </textarea>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="orderdet_notice">
        <p>• 발송처가 다를 경우, 빨리 준비된 상품부터 배송될 수 있습니다.</p>
      </div>

      <div className="orderdet_saveOption">
        <label className="orderdet_checkboxLabel">
          <input
            type="checkbox"
            className="orderdet_checkbox"
            name="isDefault"
            checked={orderinfo?.isDefault || false}
            onChange={handleCheckboxChange}
          />
          기본 배송지로 저장
        </label>
      </div>
    </div>
  </>);
};

export default OrderDetail;