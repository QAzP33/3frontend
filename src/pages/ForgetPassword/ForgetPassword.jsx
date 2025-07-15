import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const ForgetPassword = () => {
  const [account, setAccount] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const navigate = useNavigate();
  const { token, isAuthChecked } = useSelector((state) => state.auth);

  // 如果是登入狀態就導向其他頁面
  useEffect(() => {
    if (token && isAuthChecked) {
      navigate('/');
    }
  }, [token, isAuthChecked, navigate]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const route = `${apiUrl}/api/v1/users/forget`;

  // 倒數計時
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // 控制 modal
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const emailHandler = () => {
    const accountRegex =
      /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (account.trim() === '') {
      setModalMsg('欄位未填寫正確');
      setIsOpen(true);
      return;
    } else if (!accountRegex.test(account) || account.length > 100) {
      setModalMsg('信箱格式錯誤');
      setIsOpen(true);
      return;
    }

    axios
      .patch(route, {
        email: account,
      })
      .then(() => {
        setModalMsg('密碼重設信件已發送至信箱，請至信箱查收');
        setIsOpen(true);
        setCooldown(60);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || '發生錯誤';
        setModalMsg(msg);
        setIsOpen(true);
      });
  };

  return (
    <>
      <Header />
      <div className="auth-bg d-flex justify-content-center align-items-center ">
        <div className="shadow auth-custom">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <img
              src={images.logoDark}
              alt="dark logo"
              className="logo-custom"
            />
            <h4 className="auth-title text-center">忘記密碼</h4>
          </div>
          <form className="form-custom">
            <div className="form-input-custom">
              <label
                htmlFor="memberEmail"
                className="form-label form-label-custom text-coffee-primary-900"
              >
                會員電子信箱 *
              </label>
              <input
                type="email"
                className="form-control form-control-custom rounded-0"
                id="memberEmail"
                placeholder="請輸入會員帳號/Email"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                maxLength={100}
              />
            </div>
          </form>

          <button
            type="button"
            className={`btn btn-coffee-primary-700 btn-style w-100 rounded-0 border-0 ${cooldown > 0 ? 'disabled-btn' : ''}`}
            onClick={emailHandler}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `${cooldown} 秒後可再次發送信件` : '送出信件'}
          </button>

          <div className="text-center">
            <span className="text-coffee-grey-600 btn-cta-text">
              將寄發重新設定密碼連結至電子信箱
            </span>
          </div>
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

export default ForgetPassword;
