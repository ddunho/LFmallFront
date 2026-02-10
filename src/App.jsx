import { BrowserRouter, Routes, Route } from "react-router-dom";
import Example from "./pages/Example.jsx";
import Example2 from "./pages/Example2.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/" element={<Example2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;