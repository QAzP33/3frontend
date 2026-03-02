import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // 從 URL 參數獲取藍新金流的回調資料
        const TradeInfo = searchParams.get('TradeInfo');
        const TradeSha = searchParams.get('TradeSha');

        if (!TradeInfo || !TradeSha) {
          setError('缺少付款回調參數');
          return;
        }

        // 發送請求到後端處理付款結果
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.post(
          `${apiUrl}/api/v1/users/payment/callback`,
          {
            TradeInfo,
            TradeSha,
          },
        );

        // 根據後端回應決定跳轉到成功或失敗頁面
        if (response.data.success) {
          navigate('/payment/success');
        } else {
          navigate('/payment/error');
        }
      } catch (error) {
        console.error('處理付款回調失敗:', error);
        setError('處理付款回調時發生錯誤');
      }
    };

    processPaymentCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <>
        <Header />
        <div
          className="d-flex flex-column justify-content-center align-items-center py-5"
          style={{ minHeight: '70vh', background: '#F6F5F3' }}
        >
          <div
            className="text-center p-5 rounded-4 shadow-sm bg-white"
            style={{ maxWidth: 480, width: '100%' }}
          >
            <h2
              className="fw-bold mb-3"
              style={{ color: '#C0392B', fontSize: '2rem' }}
            >
              處理付款時發生錯誤
            </h2>
            <p
              className="mb-4 fw-semibold"
              style={{ color: '#3C2A1E', fontSize: '1.1rem' }}
            >
              {error}
            </p>
            <button
              className="btn btn-primary px-5 py-3 fw-bold rounded-3"
              onClick={() => navigate('/member/orders')}
              style={{
                background: '#3C2A1E',
                border: 'none',
                fontSize: '1.1rem',
              }}
            >
              檢視訂單
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        className="d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: '70vh', background: '#F6F5F3' }}
      >
        <div
          className="text-center p-5 rounded-4 shadow-sm bg-white"
          style={{ maxWidth: 480, width: '100%' }}
        >
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">處理中...</span>
          </div>
          <h2
            className="fw-bold mb-3"
            style={{ color: '#3C2A1E', fontSize: '2rem' }}
          >
            處理付款中...
          </h2>
          <p
            className="mb-4 fw-semibold"
            style={{ color: '#3C2A1E', fontSize: '1.1rem' }}
          >
            請稍候，正在確認您的付款狀態
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentCallback;
