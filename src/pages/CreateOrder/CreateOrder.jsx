import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const CreateOrder = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showTopBtn, setShowTopBtn] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const getRoute = `${apiUrl}/api/v1/users/orderReview`;
  const postRoute = `${apiUrl}/api/v1/users/membership/order`;

  // top 按鈕
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 取得訂單
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(getRoute, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;
        setOrderData(data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        } else if (err.response?.status === 400) {
          const msg = err.response?.data?.message || '發生錯誤';
          setModalMsg(msg);
          setIsReceiverModalOpen(true);
        } else {
          const msg = err.response?.data?.message || '發生錯誤';
          setModalMsg(msg);
          setIsOpen(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, getRoute]);

  //建立訂單
  const handleCreateOrder = () => {
    const token = localStorage.getItem('token');

    axios
      .post(
        postRoute,
        {
          name: orderData.receiver.name,
          phone: orderData.receiver.phone,
          post_code: orderData.receiver.post_code || '000000',
          address: orderData.receiver.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        const orderId = res.data.data.order_id;
        navigate(`/checkout?order_id=${orderId}`);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          const msg = err.response?.data?.message || '';
          if (msg.includes('JWT') || msg.includes('token')) {
            localStorage.removeItem('token');
            navigate('/login');
          }
          navigate('/');
          return;
        }

        const msg = err.response?.data?.message || '發生錯誤';
        setModalMsg(msg);
        setIsOpen(true);
      });
  };

  if (loading) return <div>Loading...</div>;

  if (!orderData) {
    return (
      <>
        {isOpen && (
          <div
            className="modal show fade d-block custom-modal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog custom-modal-dialog">
              <div className="modal-content custom-modal-content">
                <div className="modal-header custom-modal-header">
                  <h5 className="custom-modal-title">系統通知</h5>
                  <button
                    type="button"
                    className="custom-modal-close"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/products');
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body custom-modal-body">{modalMsg}</div>
                <div className="modal-footer custom-modal-footer">
                  <button
                    type="button"
                    className="custom-modal-btn"
                    onClick={() => navigate('/products')}
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isReceiverModalOpen && (
          <div
            className="modal show fade d-block custom-modal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog custom-modal-dialog">
              <div className="modal-content custom-modal-content">
                <div className="modal-header custom-modal-header">
                  <h5 className="custom-modal-title">系統通知</h5>
                  <button
                    type="button"
                    className="custom-modal-close"
                    onClick={() => {
                      setIsReceiverModalOpen(false);
                      navigate('/member/receiver');
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body custom-modal-body">{modalMsg}</div>
                <div className="modal-footer custom-modal-footer">
                  <button
                    type="button"
                    className="custom-modal-btn"
                    onClick={() => {
                      setIsReceiverModalOpen(false);
                      navigate('/member/receiver');
                    }}
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  
  const {
    totalPrice = 0,
    discount_amount = 0,
    shipping_fee = 0,
  } = orderData.cost_summary || {};

  const subtotal = totalPrice - discount_amount;
  const grandTotal = subtotal + shipping_fee;
  
  return (
    <>
      <Header />
      <div className="bg-coffee-bg-light create-custom">
        <div className="create-banner-container">
          <img
            src={images.hotCoffeeBanner}
            alt="create banner"
            className="narrow-banner"
          />
        </div>
        <div className="container create-container ">
          {/* 頁面標題 */}
          <div className="create-title">
            <p className="create-title-chinese m-0">建立訂單</p>
            <span className="create-title-line"></span>
            <p className="create-title-english m-0">Order Review</p>
          </div>

          <div className="content-style m-0">
            <div className="content-style-create p-0">
              <div className="create-custom">
                <div className="orders-custom">
                  {/* 訂單詳情 */}
                  {/* 手機版 */}
                  <div className="table-body-scroll-container d-block d-md-none">
                    <div className="orders-custom-mobile">
                      {orderData.orderItems.map((item, idx) => (
                        <div className="order-card" key={idx}>
                          <div className="order-card-content">
                            <div className="text-group">
                              <p className="text-group-title m-0">商品名稱</p>
                              <p className="text-group-text m-0">{item.name}</p>
                            </div>
                            <div className="text-group">
                              <p className="text-group-title m-0">單價</p>
                              <p className="text-group-text m-0">
                                NTD$ {item.price}
                              </p>
                            </div>
                            <div className="text-group">
                              <p className="text-group-title m-0">數量</p>
                              <p className="text-group-text m-0">
                                {item.quantity}
                              </p>
                            </div>
                            <div className="text-group">
                              <p className="text-group-title m-0">小計</p>
                              <p className="text-group-text m-0">
                                NTD$ {item.subtotal}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 桌電版 */}
                  <div className="d-none d-md-block table-body-scroll-container">
                    <table className="orders-custom-table">
                      <thead className="orders-custom-style">
                        <tr>
                          <th scope="col" className="orders-custom-style-th">
                            商品名稱
                          </th>
                          <th scope="col" className="orders-custom-style-th">
                            單價
                          </th>
                          <th scope="col" className="orders-custom-style-th">
                            數量
                          </th>
                          <th scope="col" className="orders-custom-style-th">
                            小計
                          </th>
                        </tr>
                      </thead>
                      <tbody className="orders-custom-tbody">
                        {orderData.orderItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="orders-custom-tbody-td">
                              {item.name}
                            </td>
                            <td className="orders-custom-tbody-td price-box">
                              <p className="box-currency m-0">NTD$</p>
                              <p className="box-price m-0">{item.price}</p>
                            </td>
                            <td className="orders-custom-tbody-td">
                              {item.quantity}
                            </td>
                            <td className="orders-custom-tbody-td price-box">
                              <p className="box-currency m-0">NTD$</p>
                              <p className="box-price m-0">{item.subtotal}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bottom-style">
                  {/* 確認收貨資訊 */}
                  <div className="check-receiver">
                    <h4 className="check-title m-0">確認收貨資訊</h4>
                    <div className="text-style">
                      <div className="check-receiver-content">
                        <p className="check-receiver-content-title">收件人</p>
                        <p className="check-receiver-content-text">
                          {orderData.receiver.name}
                        </p>
                      </div>
                      <div className="check-receiver-content">
                        <p className="check-receiver-content-title">連絡電話</p>
                        <p className="check-receiver-content-text">
                          {orderData.receiver.phone}
                        </p>
                      </div>
                      <div className="check-receiver-content">
                        <p className="check-receiver-content-title">郵遞區號</p>
                        <p className="check-receiver-content-text">
                          {orderData.receiver.post_code}
                        </p>
                      </div>
                      <div className="check-receiver-content">
                        <p className="check-receiver-content-title">詳細地址</p>
                        <p className="check-receiver-content-text">
                          {orderData.receiver.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 結算區域 */}
                  <div className="cart-total">
                    <div className="cart-total-custom">
                      <div className="price-detail">
                        <p className="product-title m-0">商品金額</p>
                        <div className="price-box">
                          <p className="product-price m-0">NTD$</p>
                          <p className="product-price m-0">
                            {totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="price-detail">
                        <p className="account-title m-0">折扣金額</p>
                        <div className="price-box">
                          <p className="account-price m-0">NTD$</p>
                          <p className="account-price m-0">
                            {discount_amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="price-detail">
                        <p className="account-title m-0">小計</p>
                        <div className="price-box">
                          <p className="account-price m-0">NTD$</p>
                          <p className="account-price m-0">
                            {subtotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="price-detail">
                        <p className="account-title m-0">運費</p>
                        <div className="price-box">
                          <p className="account-price m-0">NTD$</p>
                          <p className="account-price m-0">
                            {shipping_fee.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <span className="total-line"></span>

                      <div className="price-detail">
                        <p className="total-title m-0">金額總計</p>
                        <div className="price-box">
                          <p className="total-price m-0">NTD$</p>
                          <p className="total-price m-0">
                            {grandTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="total-check">
                        <button
                          type="button"
                          className="total-check-continue"
                          onClick={() => navigate('/products')}
                        >
                          繼續選購
                        </button>
                        <button
                          className={`total-check-proceed border-0 ${
                            totalPrice === 0 ||
                            orderData.orderItems.length === 0
                              ? 'cant-check'
                              : ''
                          }`}
                          onClick={handleCreateOrder}
                          disabled={
                            totalPrice === 0 ||
                            orderData.orderItems.length === 0
                          }
                        >
                          {totalPrice === 0 || orderData.orderItems.length === 0
                            ? '前往付款'
                            : '前往付款'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>

      {/* top */}
      {showTopBtn && (
        <button className="back-to-top" onClick={scrollToTop}>
          <img src={images.topBtn} alt="back to top btn" />
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          className="modal show fade d-block custom-modal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog custom-modal-dialog">
            <div className="modal-content custom-modal-content">
              <div className="modal-header custom-modal-header">
                <h5 className="custom-modal-title">系統通知</h5>
                <button
                  type="button"
                  className="custom-modal-close"
                  onClick={() => {
                    setIsReceiverModalOpen(false);
                    navigate('/member/receiver');
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body custom-modal-body">{modalMsg}</div>
              <div className="modal-footer custom-modal-footer">
                <button
                  type="button"
                  className="custom-modal-btn"
                  onClick={() => {
                    setIsReceiverModalOpen(false);
                    navigate('/member/receiver');
                  }}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receiver Modal */}
      {isReceiverModalOpen && (
        <div
          className="modal show fade d-block custom-modal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog custom-modal-dialog">
            <div className="modal-content custom-modal-content">
              <div className="modal-header custom-modal-header">
                <h5 className="custom-modal-title">系統通知</h5>
                <button
                  type="button"
                  className="custom-modal-close"
                  onClick={() => {
                    setIsReceiverModalOpen(false);
                    navigate('/member/receiver');
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body custom-modal-body">{modalMsg}</div>
              <div className="modal-footer custom-modal-footer">
                <button
                  type="button"
                  className="custom-modal-btn"
                  onClick={() => {
                    setIsReceiverModalOpen(false);
                    navigate('/member/receiver');
                  }}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CreateOrder;
