export const FetchCall = (url, type, data, callbackFnc) => {
    fetch(url, {
      method: type,
      headers: {
        "Content-Type": "application/json",
      },
      body: type.toUpperCase() === "GET" ? null : JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (callbackFnc) {
          callbackFnc(res);
        }
      })
      .catch((e) => {
        console.warn(e);
        if (callbackFnc) {
          // 에러 시에도 callback 실행
          callbackFnc({ success: false, message: "서버 오류가 발생했습니다." });
        }
      });
    return;
  };