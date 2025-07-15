import { Link } from 'react-router-dom';

import MemberSidebar from '../../components/MemberSidebar/MemberSidebar';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const Membership = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <MemberSidebar>
            <div className="container sidebar-container-custom w-100">
              <h4 className="content-title m-0">會員中心</h4>
              <img
                src={images.membershipBanner}
                alt="banner image"
                className="banner-img"
              />
              <div className="membership-card">
                <Link to="/member/profile" className="membership-card-box">
                  <p className="card-title">個人資料</p>
                  <div className="card-icon">
                    <img src={images.peopleIcon} alt="" className="icon-img" />
                  </div>
                </Link>
                <Link to="/member/receiver" className="membership-card-box">
                  <p className="card-title">收件資料</p>
                  <div className="card-icon">
                    <img src={images.tableIcon} alt="" className="icon-img" />
                  </div>
                </Link>
                <Link to="/member/orders" className="membership-card-box">
                  <p className="card-title">訂單訊息</p>
                  <div className="card-icon">
                    <img src={images.formIcon} alt="" className="icon-img" />
                  </div>
                </Link>
                <div className="membership-card-box  coming-soon">
                  <p className="card-title">願望清單</p>
                  <div className="card-icon">
                    <img src={images.loveIcon} alt="" className="icon-img" />
                  </div>
                  <div className="coming-soon-overlay">
                    <span>敬請期待</span>
                  </div>
                </div>
              </div>
            </div>
          </MemberSidebar>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Membership;
