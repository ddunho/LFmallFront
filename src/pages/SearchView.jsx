import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FetchCall } from "../FetchCall";
import ListBox from "../components/Main/ListBox";
import Sidebar from "../components/Main/Sidebar";
import "../css/SearchResultView.css";

// 선택된 필터들을 박스 형태로 표시하는 컴포넌트
const FilterTags = ({ searchOption, setSearchOption }) => {
  // 모든 필터 초기화
  const resetAllFilters = () => {
    setSearchOption((prev) => ({
      ...prev,
      color: [],
      size: [],
      brand_name: [],
      addSearch: [],
    }));
  };

  // 추가 검색어 삭제
  const removeAddSearch = (keyword) => {
    setSearchOption((prev) => ({
      ...prev,
      addSearch: prev.addSearch.filter((item) => item !== keyword),
    }));
  };

  // 색상 필터 삭제
  const removeColor = (color) => {
    setSearchOption((prev) => ({
      ...prev,
      color: prev.color.filter((item) => item !== color),
    }));
  };

  // 사이즈 필터 삭제
  const removeSize = (size) => {
    setSearchOption((prev) => ({
      ...prev,
      size: prev.size.filter((item) => item !== size),
    }));
  };

  // 브랜드 필터 삭제
  const removeBrand = (brand) => {
    setSearchOption((prev) => ({
      ...prev,
      brand_name: prev.brand_name.filter((item) => item !== brand),
    }));
  };

  // 선택된 필터가 있는지 확인
  const hasFilters =
    searchOption.addSearch.length > 0 ||
    searchOption.color.length > 0 ||
    searchOption.size.length > 0 ||
    searchOption.brand_name.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="filter-tags-main">
      <div className="filter-left">
        <div className="tag-container">
          {/* 추가 검색어 태그들 */}
          {searchOption.addSearch.map((keyword, index) => (
            <div key={`add-${index}`} className="filter-tag blue">
              <span>{keyword}</span>
              <button onClick={() => removeAddSearch(keyword)}>×</button>
            </div>
          ))}

          {/* 색상 필터 태그들 */}
          {searchOption.color.map((color, index) => (
            <div key={`color-${index}`} className="filter-tag blue">
              <div className="filter-color-circle" style={{backgroundColor: color}}></div>
              <button onClick={() => removeColor(color)}>×</button>
            </div>
          ))}

          {/* 사이즈 필터 태그들 */}
          {searchOption.size.map((size, index) => (
            <div key={`size-${index}`} className="filter-tag blue">
              <span>{size}</span>
              <button onClick={() => removeSize(size)}>×</button>
            </div>
          ))}

          {/* 브랜드 필터 태그들 */}
          {searchOption.brand_name.map((brand, index) => (
            <div key={`brand-${index}`} className="filter-tag blue">
              <span>{brand}</span>
              <button onClick={() => removeBrand(brand)}>×</button>
            </div>
          ))}
        </div>
        <a className="reset-all-a" onClick={resetAllFilters}>
          초기화
        </a>
      </div>
    </div>
  );
};

const SearchView = () => {
  const params = useParams();
  const searchtxt = params.query;
  console.log(searchtxt);
  const navigate = useNavigate();
  const [imgs, setImgs] = useState({
    name: ''
  });
  const [resultForm, setResultForm] = useState({
    cnt: 0,
    productList: [],
  });

  const [searchOption, setSearchOption] = useState({
    searchtxt: searchtxt || "",
    searchtype: "recent",
    color: [],
    size: [],
    brand_name: [],
    addSearch: [],
  });

  const [detailOptionForm, setDetailOptionForm] = useState({
    color: [],
    brand_name: [],
    size: [],
  });

  // 정렬 버튼 핸들러들
  const onClickRecentBtn = () => {
    setSearchOption((prev) => ({
      ...prev,
      searchtype: "recent",
    }));
  };

  const onClickPriceLowBtn = () => {
    setSearchOption((prev) => ({
      ...prev,
      searchtype: "price_low",
    }));
  };

  const onClickPriceHighBtn = () => {
    setSearchOption((prev) => ({
      ...prev,
      searchtype: "price_high",
    }));
  };

  const onClickDiscountHighBtn = () => {
    setSearchOption((prev) => ({
      ...prev,
      searchtype: "sale_high",
    }));
  };

  // 초기 옵션 데이터 가져오기 (필터 없이)
  const getInitialOptions = () => {
    const initialSearchOptions = {
      searchtxt: searchOption.searchtxt,
      searchtype: searchOption.searchtype,
      color: [],
      size: [],
      brand_name: [],
      addSearch: searchOption.addSearch,
    };

    FetchCall("/api/search/result", "POST", initialSearchOptions, (res) => {
      if (res.success && res.data && res.data.length > 0) {
        const allColors = res.data.flatMap((product) =>
          Array.isArray(product.color) ? product.color : []
        );
        const allSizes = res.data.flatMap((product) =>
          Array.isArray(product.size) ? product.size : []
        );
        const allBrands = res.data
          .map((product) => product.brand_name)
          .filter((brand) => brand);

        setDetailOptionForm({
          color: [...new Set(allColors)].sort(),
          size: [...new Set(allSizes)].sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }
            return a.localeCompare(b);
          }),
          brand_name: [...new Set(allBrands)].sort(),
        });
      }
    });
  };

  // 검색 실행 함수 (필터 적용)
  const RenderingProduct = (searchOptions) => {
    const sanitizedOptions = {
      ...searchOptions,
      color: Array.isArray(searchOptions.color) ? searchOptions.color : [],
      size: Array.isArray(searchOptions.size) ? searchOptions.size : [],
      brand_name: Array.isArray(searchOptions.brand_name)
        ? searchOptions.brand_name
        : [],
      addSearch: Array.isArray(searchOptions.addSearch)
        ? searchOptions.addSearch
        : [],
    };

    console.log("검색 조건:", sanitizedOptions);

    FetchCall("/api/search/result", "POST", sanitizedOptions, (res) => {
      if (res.success) {
        setResultForm({
          cnt: res.total || res.data?.length || 0,
          productList: res.data || [],
        });
      } else {
        console.error("데이터 호출 에러발생: searchview", res);
        setResultForm({
          cnt: 0,
          productList: [],
        });
      }
    });
  };

  useEffect(() => {
    if (searchtxt !== searchOption.searchtxt) {
      setSearchOption((prev) => ({
        ...prev,
        searchtxt: searchtxt || "",
        color: [],
        size: [],
        brand_name: [],
        addSearch: [],
      }));
    }
  }, [searchtxt, searchOption.searchtxt]);

  // 2. searchOption이 업데이트될 때만 검색 실행 (구체적 의존성)
  useEffect(() => {
    if (searchOption.searchtxt) {
      getInitialOptions();
      RenderingProduct(searchOption);
    }
  }, [
    searchOption.searchtxt,
    searchOption.addSearch,
    searchOption.color,
    searchOption.size,
    searchOption.brand_name,
    searchOption.searchtype,
  ]);

  return (
    <>
      <div className="resultSearch">
        {searchtxt ? (
          <>
            <div className="rs-result">'{searchtxt}'</div>
            <div>에 대한</div>
            <div className="rs-count">{resultForm.cnt.toLocaleString()}</div>
            <div>개의 검색 결과</div>
          </>
        ) : (
          <div className="rs-count">
            총 {resultForm.cnt.toLocaleString()}개의 상품
          </div>
        )}
      </div>

      <div className="content">
        <Sidebar
          searchOption={searchOption}
          setSearchOption={setSearchOption}
          detailOptionForm={detailOptionForm}
          setDetailOptionForm={setDetailOptionForm}
        />

        <div className="content-main">
          {/* 필터 태그들 - 정렬 버튼 위에 위치 */}
          <FilterTags
            searchOption={searchOption}
            setSearchOption={setSearchOption}
          />

          <div className="searchSort">
            <button
              onClick={onClickRecentBtn}
              className={searchOption.searchtype === "recent" ? "active" : ""}
            >
              신상품순
            </button>
            <button
              onClick={onClickPriceLowBtn}
              className={
                searchOption.searchtype === "price_low" ? "active" : ""
              }
            >
              낮은 가격순
            </button>
            <button
              onClick={onClickDiscountHighBtn}
              className={
                searchOption.searchtype === "sale_high" ? "active" : ""
              }
            >
              할인율 높은순
            </button>
            <button
              onClick={onClickPriceHighBtn}
              className={
                searchOption.searchtype === "price_high" ? "active" : ""
              }
            >
              높은 가격순
            </button>
          </div>

          <div className="content-wrap">
            {resultForm.productList.length > 0 ? (
              resultForm.productList.map((product, index) => (
                <ListBox key={product.product_id || index} product={product}/>
              ))
            ) : (
              <div className="no-results">
                {searchtxt
                  ? `'${searchtxt}'에 대한 검색 결과가 없습니다.`
                  : "상품이 없습니다."}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchView;
