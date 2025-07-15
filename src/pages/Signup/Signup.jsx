import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const Signup = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [memberName, setMemberName] = useState('');

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
  const route = `${apiUrl}/api/v1/users/signup`;

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

  const signupHandler = () => {
    const accountRegex =
      /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    const nameRegex = /^[A-Za-z0-9\u4e00-\u9fa5]{2,10}$/;

    if (
      account.trim() === '' ||
      password.trim() === '' ||
      checkPassword.trim() === '' ||
      memberName.trim() === ''
    ) {
      setModalMsg('欄位未填寫正確');
      setIsOpen(true);
      return;
    } else if (!accountRegex.test(account) || account.length > 100) {
      setModalMsg('信箱格式錯誤');
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
    } else if (!nameRegex.test(memberName)) {
      setModalMsg('會員名稱長度需為 2~10 字，且不得包含特殊字元或空白');
      setIsOpen(true);
      return;
    }
    axios
      .post(route, {
        email: account,
        password: password,
        name: memberName,
      })
      .then(() => {
        navigate('/');
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
            <h4 className="auth-title text-center">註冊會員</h4>
          </div>
          <form className="form-custom">
            <div className="form-input-custom">
              <label
                htmlFor="memberEmail"
                className="form-label form-label-custom text-coffee-primary-900"
              >
                電子信箱(將會成為會員帳號) *
              </label>
              <input
                type="email"
                className="form-control form-control-custom rounded-0"
                id="memberEmail"
                placeholder="請輸入Email"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                maxLength={100}
              />
            </div>
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
            <div className="form-input-custom">
              <label
                htmlFor="memberName"
                className="form-label form-label-custom text-coffee-primary-900"
              >
                會員名稱 *
              </label>
              <input
                type="text"
                className="form-control form-control-custom rounded-0"
                id="memberName"
                placeholder="最少2個字元，最長10字元，不得包含特殊字元與空白"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />
            </div>
          </form>

          <button
            type="button"
            className="btn btn-coffee-primary-700 btn-style w-100 rounded-0 border-0"
            onClick={signupHandler}
          >
            註冊會員
          </button>

          <button
            type="button"
            className="btn btn-outline-coffee-primary-400 text-coffee-primary-600 btn-style btn-style-light w-100 rounded-0"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="google logo"
              className="px-3"
            />
            透過 Google 註冊
          </button>

          <div className="text-center">
            <span className="text-coffee-grey-600 btn-cta-text">
              已經是會員？
            </span>
            <Link to="/login" className="text-decoration-none link-custom">
              馬上登入
            </Link>
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
                <h5 className="custom-modal-title">註冊失敗</h5>
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

export default Signup;
