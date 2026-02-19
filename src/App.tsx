import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import { useEffect } from 'react';
import { CartPriceProvider } from './CartPriceContext';

function App() {

  return (
    <>
      <CartPriceProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </CartPriceProvider>
    </>
  );
}

export default App;
