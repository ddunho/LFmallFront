export const updateWatchedProducts = (productId) => {
  try {
    let existingWatchedProducts = [];
    const stored = localStorage.getItem("watchedProduct");
    if (stored) {
      const parsed = JSON.parse(stored);
      existingWatchedProducts = Array.isArray(parsed) ? parsed : [];
    }

    if (!existingWatchedProducts.includes(productId)) {
      // 없으면 맨 앞에 추가
      const updatedWatchedProducts = [
        productId,
        ...existingWatchedProducts,
      ];
      localStorage.setItem(
        "watchedProduct",
        JSON.stringify(updatedWatchedProducts)
      );
    } else {
      // 있으면 제거하고 맨 앞에 추가
      const filteredProducts = existingWatchedProducts.filter(
        id => id !== productId
      );
      const updatedWatchedProducts = [productId, ...filteredProducts];
      localStorage.setItem(
        "watchedProduct",
        JSON.stringify(updatedWatchedProducts)
      );
    }
  } catch (error) {
    console.error("localStorage 업데이트 중 오류:", error);
  }
};