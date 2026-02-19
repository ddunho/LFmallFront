
export default function PaymentFail(){
  const urlParams = new URLSearchParams(window.location.search);

  const code = urlParams.get("code");
  const message = urlParams.get("message")

  return (<>
    <h2> 결제 실패 </h2>
    <p id="code">{code}</p>
    <p id="message">{message}</p>
  </>)
}