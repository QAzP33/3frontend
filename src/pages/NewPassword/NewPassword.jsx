import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const [searchParams] = useSearchParams();
  const tokenURL = searchParams.get('token');
  const { token, isAuthChecked } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const route = `${apiUrl}/api/v1/users/reset-password`;

  useEffect(() => {
    if (!tokenURL) {
      setModalMsg('連結無效或已過期');
      setIsOpen(true);
    }
  }, [tokenURL]);

  // 如果是登入狀態就導向其他頁面
  useEffect(() => {
    if (token && isAuthChecked) {
      navigate('/');
    }
  }, [token, isAuthChecked, navigate]);

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

  const handleCloseModal = () => {
    setIsOpen(false);

    if (
      modalMsg === '連結無效或已過期' ||
      modalMsg === '密碼更新成功，請重新登入'
    ) {
      navigate('/login');
    }
  };

  const resetHandler = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

    if (password.trim() === '' || checkPassword.trim() === '') {
      setModalMsg('欄位未填寫正確');
      setIsOpen(true);
      return;
    } else if (!passwordRegex.test(password)) {
      setModalMsg(
        '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字，且不能包含特殊符號',
      );
      setIsOpen(true);
      return;
    } else if (password !== checkPassword) {
      setModalMsg('密碼與確認密碼內容需一致');
      setIsOpen(true);
      return;
    }
    axios
      .patch(`${route}?token=${tokenURL}`, {
        newPassword: password,
        newPasswordCheck: checkPassword,
      })
      .then(() => {
        setModalMsg('密碼更新成功，請重新登入');
        setIsOpen(true);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || '發生錯誤';
        setModalMsg(msg);
        setIsOpen(true);
        console.log(err);
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
            <h4 className="auth-title text-center">設定新密碼</h4>
          </div>
          <form className="form-custom">
            <div className="form-input-custom">
              <label
                htmlFor="memberPassword"
                className="form-label form-label-custom text-coffee-primary-900"
              >
                密碼 *
              </label>
              <input
                type="password"
                className="form-control form-control-custom rounded-0"
                id="memberPassword"
                placeholder="需要包含英文數字大小寫，最短8個字，最長16個字"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-input-custom">
              <label
                htmlFor="checkMemberPassword"
                className="form-label form-label-custom text-coffee-primary-900"
              >
                再次輸入密碼 *
              </label>
              <input
                type="password"
                className="form-control form-control-custom rounded-0"
                id="checkMemberPassword"
                placeholder="請輸入與上方相同的密碼"
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
              />
            </div>
          </form>

          <button
            type="button"
            className="btn btn-coffee-primary-700 btn-style w-100 rounded-0 border-0"
            onClick={resetHandler}
          >
            確定修改
          </button>
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
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body custom-modal-body">{modalMsg}</div>
              <div className="modal-footer custom-modal-footer">
                <button
                  type="button"
                  className="custom-modal-btn"
                  onClick={handleCloseModal}
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

export default NewPassword;
