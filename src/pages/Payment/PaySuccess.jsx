import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';
import { Link } from 'react-router-dom';

const PaySuccess = () => {
  return (
    <>
      <Header />
      <div
        className="pay-result-bg d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: '70vh', background: '#F6F5F3' }}
      >
        <div
          className="pay-result-card text-center p-5 rounded-4 shadow-sm bg-white"
          style={{ maxWidth: 480, width: '100%' }}
        >
          <div className="mb-4">
            <img
              src={images.logoIcon}
              alt="success"
              style={{ width: 100, height: 100 }}
            />
          </div>
          <h2
            className="fw-bold mb-3"
            style={{ color: '#3C2A1E', fontSize: '2rem' }}
          >
            感謝您的訂購！
          </h2>
          <p
            className="mb-4 fw-semibold"
            style={{ color: '#3C2A1E', fontSize: '1.1rem' }}
          >
            已收到您的訂單，點選檢視訂單可確認您的付款狀態
          </p>
          <div className="d-flex flex-column flex-md-row justify-content-center gap-4 mt-4">
            <Link
              to="/"
              className="btn btn-secondary px-5 py-3 fw-bold rounded-3"
              style={{ fontSize: '1.1rem' }}
            >
              返回首頁
            </Link>
            <Link
              to="/member/orders"
              className="btn btn-primary px-5 py-3 fw-bold rounded-3"
              style={{
                background: '#3C2A1E',
                border: 'none',
                fontSize: '1.1rem',
              }}
            >
              檢視訂單
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaySuccess;
