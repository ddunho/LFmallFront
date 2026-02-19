import { useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import TopMenu from "./common/TopMenu";
import AppRoutes from "./AppRoutes";
import ContentSlide from "./components/ContentSlide";

export default function Layout(){
  const location = useLocation();
  const is_listView = location.pathname.startsWith("/app/menu");

  return (<>
    <AuthProvider>
      <TopMenu/>
      
      {/* 슬라이드 */}
      { is_listView && <ContentSlide /> }

      <div className="wrap">
        <AppRoutes />
      </div>
    </AuthProvider>

    {/* <Footer /> */}
  </>)
}