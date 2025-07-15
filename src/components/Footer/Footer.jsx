import { Link } from 'react-router-dom';
import { images } from '../../constants/image';

const Footer = () => {
  return (
    <footer className="bg-coffee-primary-700 text-coffee-primary-000 p-0 m-0">
      <div className="container footer-container-custom w-100">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center">
          <Link to="/" className="navbar-brand footer-logo mb-5 mb-md-0">
            <img
              src={images.logoIcon}
              alt="coffee logo"
              className="logo-icon"
            />
            <span className="logo-text text-coffee-secondary-300">
              築豆咖啡
            </span>
          </Link>
          <div className="d-flex flex-column flex-md-row justify-content-evenly align-items-center footer-top">
            <Link to="/products" className="footer-top-link">
              商品資訊
            </Link>
            <Link to="/contact" className="footer-top-link">
              聯絡我們
            </Link>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between  align-items-center m-0">
          <div className="text-center text-md-start mb-5 mb-md-0">
            <ul className="list-unstyled fw-lighter footer-info-item">
              <li>
                <i className="bi bi-clock footer-info-icon"></i>
                營業時間：平日9:00 ~ 18:00
              </li>
              <li>
                <i className="bi bi-telephone footer-info-icon"></i>
                客服專線：0912-345678
              </li>
              <li>
                <i className="bi bi-envelope footer-info-icon"></i>
                客服信箱：Coffee3Service@travel.com
              </li>
              <li>
                <i className="bi bi-geo-alt footer-info-icon"></i>
                聯絡地址：新北市板橋區仁愛路123號
              </li>
            </ul>
          </div>

          <div className="d-flex justify-content-center justify-content-md-end align-self-center align-self-md-start footer-media">
            {['facebook', 'instagram', 'line'].map((platform) => (
              <a key={platform} href="#" className="text-white px-3">
                <i className={`bi bi-${platform} footer-media-item`}></i>
              </a>
            ))}
          </div>
        </div>

        <span className="d-block text-center text-md-start mt-mb-3">
          &copy;2025 築豆咖啡 All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
