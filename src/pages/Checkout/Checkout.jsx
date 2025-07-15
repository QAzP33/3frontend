import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const order_id = searchParams.get('order_id');

  const [orderInfo, setOrderInfo] = useState(null);

  const [agreeCredit, setAgreeCredit] = useState({
    confirmOrder: false,
    agreeTerms: false,
  });
  const [fieldErr, setFieldErr] = useState({
    agree: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formValidated, setFormValidated] = useState(false);

  const cardRefs = [useRef(), useRef(), useRef(), useRef()];
  const ccvRef = useRef();

  // const [agreeCOD, _] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const handleCardInput = (e, idx) => {
    const value = e.target.value;
    if (value.length === 4 && idx < cardRefs.length - 1) {
      cardRefs[idx + 1].current?.focus();
    }
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );
  const years = Array.from({ length: 10 }, (_, i) =>
    String(new Date().getFullYear() + i),
  );

  // 取得訂單資訊
  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `${apiUrl}/api/v1/users/checkout?order_id=${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.data) {
          setOrderInfo(response.data.data);
        }
      } catch (error) {
        console.error('獲取訂單資訊失敗:', error);
        // 如果獲取訂單資訊失敗，導回上一頁
        navigate(-1);
      }
    };

    if (order_id) {
      fetchOrderInfo();
    } else {
      // 如果沒有 order_id，導回上一頁
      navigate(-1);
    }
  }, [order_id, navigate]);

  // 修改付款方式選擇的處理
  const handlePaymentMethodChange = (method) => {
    
    if (method === 'credit') {
      setModalMsg('目前金流維護中，請選擇貨到付款，謝謝');
      setIsOpen(true);
      setPaymentMethod('cod');
    } else {
      setPaymentMethod(method);
    }
    setFieldErr((prev) => ({
      ...prev,
      paymentMethod: '',
      agree: '',
    }));
  };

  // 送出選單控制
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    let newFieldErr = { paymentMethod: '', agree: '' };

    if (!paymentMethod) {
      newFieldErr.paymentMethod = '這是必選選項';
      hasError = true;
    }

    if (paymentMethod === 'credit') {
      if (!agreeCredit.confirmOrder || !agreeCredit.agreeTerms) {
        newFieldErr.agree = '請勾選同意條款';
        hasError = true;
      }
    } else if (paymentMethod === 'cod') {
      if (!agreeChecked) {
        newFieldErr.agree = '請勾選同意條款';
        hasError = true;
      }
    }

    setFieldErr(newFieldErr);
    setFormValidated(true);

    if (hasError) {
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${apiUrl}/api/v1/users/checkout`,
        {
          display_id: orderInfo?.order?.display_id,
          payment_method_id: paymentMethod === 'cod' ? 1 : 2, // 1 為貨到付款，2 為信用卡
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate('/payment/success');
      }
    } catch (error) {
      console.error('結帳失敗:', error);
      navigate('/payment/error');
    }
  };

  // 在訂單資訊載入前顯示載入中
  if (!orderInfo) {
    return (
      <>
        <Header />
        <div className="bg-coffee-bg-light checkout-style">
          <div className="container checkout-container">
            <div className="text-center py-5">載入中...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-coffee-bg-light checkout-style">
        <img
          src={images.hotCoffeeBanner}
          alt="cart banner"
          className='narrow-banner'
        />
        <div className="container checkout-container">
          {/* 標題 */}
          <div className="checkout-title">
            <p className="checkout-title-chinese m-0">付款結帳</p>
            <span className="checkout-title-line"></span>
            <p className="checkout-title-english m-0">Payment checkout</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row checkout-container-style">
              <div className="col-12 col-md-5 col-custom">
                {/* 訂單資訊 */}
                <div className="order-custom">
                  <h4 className="box-title">訂單資訊</h4>
                  <div className="box-content">
                    <p className="box-content-title">訂單編號</p>
                    <p className="box-content-text">{orderInfo.order.display_id}</p>
                  </div>
                  <div className="box-content">
                    <p className="box-content-title">訂單金額</p>
                    <div className="box-content-price">
                      <p className="box-content-price-currency m-0">NTD$</p>
                      <p className="box-content-price-num m-0">{orderInfo.order.total_price}</p>
                    </div>
                  </div>
                  <span className="total-line"></span>
                  <div className="order-total">
                    <p className="order-total-title m-0">應付金額</p>
                    <div className="order-total-price">
                      <p className="order-total-price-currency m-0">NTD$</p>
                      <p className="order-total-price-num m-0">{orderInfo.order.total_price}</p>
                    </div>
                  </div>
                </div>

                {/* 收件資訊 */}
                <div className="receiver-custom">
                  <h4 className="box-title">收件資訊</h4>
                  <div className="box-content">
                    <p className="box-content-title">收件人</p>
                    <p className="box-content-text">{orderInfo.receiver.name}</p>
                  </div>
                  <div className="box-content">
                    <p className="box-content-title">連絡電話</p>
                    <p className="box-content-text">{orderInfo.receiver.phone}</p>
                  </div>
                  <div className="box-content">
                    <p className="box-content-title">收件地址</p>
                    <p className="box-content-text">{orderInfo.receiver.address}</p>
                  </div>
                </div>
              </div>

              {/* 付款相關 */}
              <div className="col-12 col-md-6 col-custom">
                <div className="payment-custom">
                  <h4 className="box-title">付款方式</h4>
                  <div className="box-content">
                    <input
                      type="radio"
                      id="pay-credit"
                      name="payment"
                      checked={paymentMethod === 'credit'}
                      onChange={() => handlePaymentMethodChange('credit')}
                      className={fieldErr.paymentMethod ? 'input-error' : ''}
                    />
                    <label htmlFor="pay-credit" className="box-content-text">
                      信用卡
                    </label>
                  </div>
                  <div className="box-content">
                    <input
                      type="radio"
                      id="pay-cod"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className={fieldErr.paymentMethod ? 'input-error' : ''}
                    />
                    <label htmlFor="pay-cod" className="box-content-text">
                      貨到付款
                    </label>
                    <p className="box-content-remark m-0">
                      * 僅支援一次付清付款
                    </p>
                  </div>
                  {formValidated && fieldErr.paymentMethod && (
                    <div className="text-danger">
                      * {fieldErr.paymentMethod}
                    </div>
                  )}
                  <span className="total-line"></span>

                  <h4 className="box-title">付款資料</h4>

                  <div className="box-content ">
                    <p className="box-content-title">付款人信箱</p>
                    <div className="box-content-card-input">
                      <p className="box-content-text">{orderInfo.user.email}</p>
                    </div>
                  </div>

                  {paymentMethod === 'credit' && (
                    <>
                      <div className="box-content ">
                        <p className="box-content-title">信用卡號</p>
                        <div className="box-content-card-input">
                          {cardRefs.map((ref, idx) => (
                            <div key={idx}>
                              <input
                                key={idx}
                                type="text"
                                maxLength="4"
                                className="box-content-card-input-detail"
                                ref={ref}
                                onChange={(e) => handleCardInput(e, idx)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="box-content">
                        <p className="box-content-title">有效年月</p>
                        <div className="box-content-card-input year-custom">
                          <select className="box-content-card-input-detail card-expiration">
                            {months.map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                          <span>/</span>

                          <select className="box-content-card-input-detail card-expiration">
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="box-content">
                        <p className="box-content-title">背面末三碼</p>
                        <div className="box-content-card-input">
                          <input
                            type="text"
                            maxLength="3"
                            className="box-content-card-input-detail card-ccv-input"
                            ref={ccvRef}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 同意條款 */}
                  {paymentMethod === 'cod' && (
                    <div className="check-content">
                      <div className="check-content-option">
                        <input
                          type="radio"
                          id="agree-cod"
                          className="radio-style"
                          checked={agreeChecked}
                          onClick={() => {
                            setAgreeChecked((prev) => !prev);
                            setFieldErr((prev) => ({ ...prev, agree: '' }));
                          }}
                          onChange={() => {}}
                        />
                        <label
                          htmlFor="agree-cod"
                          className="check-content-text"
                        >
                          {fieldErr.agree && !agreeChecked && (
                            <span className="err-sign">*</span>
                          )}
                          我已再次「確認訂單」及「付款資訊」，結帳完成後系統將發送通知信至
                          E-mail 信箱
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'credit' && (
                    <div className="check-content">
                      <div className="check-content-option">
                        <input
                          type="radio"
                          id="agree-confirmOrder"
                          className="radio-style"
                          checked={agreeCredit.confirmOrder}
                          onClick={() => {
                            setAgreeCredit((prev) => ({
                              ...prev,
                              confirmOrder: !prev.confirmOrder,
                            }));
                            setFieldErr((prev) => ({ ...prev, agree: '' }));
                          }}
                          onChange={() => {}}
                        />
                        <label
                          htmlFor="agree-confirmOrder"
                          className="check-content-text"
                        >
                          {fieldErr.agree && !agreeCredit.confirmOrder && (
                            <span className="err-sign">*</span>
                          )}
                          我已再次「確認訂單」及「付款資訊」，付款完成後藍新金流將發送通知信至E-mail信箱
                        </label>
                      </div>

                      <div className="check-content-option">
                        <input
                          type="radio"
                          id="agree-terms"
                          className="radio-style"
                          checked={agreeCredit.agreeTerms}
                          onClick={() => {
                            setAgreeCredit((prev) => ({
                              ...prev,
                              agreeTerms: !prev.agreeTerms,
                            }));
                            setFieldErr((prev) => ({ ...prev, agree: '' }));
                          }}
                          onChange={() => {}}
                        />
                        <label
                          htmlFor="agree-terms"
                          className="check-content-text"
                        >
                          {fieldErr.agree && !agreeCredit.agreeTerms && (
                            <span className="err-sign">*</span>
                          )}
                          我已同意並閱讀藍新金流第三方支付金流平台服務條款
                        </label>
                      </div>

                      <div className="check-content-option">
                        <input
                          type="checkbox"
                          id="remember-card"
                          className="checkbox-style"
                        />
                        <label
                          htmlFor="remember-card"
                          className="check-content-text"
                        >
                          記住這張信用卡，下次結帳更快速
                        </label>
                      </div>
                    </div>
                  )}

                  {formValidated && fieldErr.agree && (
                    <div className="text-danger">* {fieldErr.agree}</div>
                  )}

                  <div className="btn-custom">
                    <button
                      type="button"
                      className="btn-custom-back"
                      onClick={() => window.history.back()}
                    >
                      回到上一步
                    </button>
                    <button
                      type="submit"
                      className="btn-custom-confirm border-0"
                    >
                      確定送出
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

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
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body custom-modal-body">{modalMsg}</div>
              <div className="modal-footer custom-modal-footer">
                <button
                  type="button"
                  className="custom-modal-btn"
                  onClick={() => setIsOpen(false)}
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

export default Checkout;
