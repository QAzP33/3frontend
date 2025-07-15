import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const Login = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
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
  const route = `${apiUrl}/api/v1/users/login`;

  const dispatch = useDispatch();

  const clearInputs = () => {
    setAccount('');
    setPassword('');
  };

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

  const loginHandler = () => {
    const accountRegex =
      /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

    if (account.trim() === '' || password.trim() === '') {
      setModalMsg('帳號密碼不可為空');
      setIsOpen(true);
      clearInputs();
      return;
    } else if (!accountRegex.test(account) || account.length > 100) {
      setModalMsg('使用者不存在或密碼輸入錯誤');
      setIsOpen(true);
      clearInputs();
      return;
    } else if (!passwordRegex.test(password)) {
      setModalMsg('使用者不存在或密碼輸入錯誤');
      setIsOpen(true);
      clearInputs();
      return;
    }

    axios
      .post(route, {
        email: account,
        password: password,
      })
      .then((res) => {
        const token = res.data.data.token;
        const name = res.data.data.user.name;
        const role = res.data.data.user.role;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', name);

        console.log(res)

        dispatch(setCredentials({ token, role, username: name }));

        clearInputs();
        navigate('/member/profile');
      })
      .catch((err) => {
        const msg = err.response?.data?.message || '發生錯誤';
        setModalMsg(msg);
        setIsOpen(true);
        clearInputs();
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
            <h4 className="display-6 text-center text-coffee-primary-600">
              登入
            </h4>
          </div>

          <form className="form-custom">
            <div className="form-input-custom">
              <label
                htmlFor="memberEmail"
                className="form-label form-label-custom text-coffee-primary-900"
              >
                會員帳號
              </label>
              <input
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                type="email"
                className="form-control form-control-custom rounded-0"
                id="memberEmail"
                placeholder="請輸入會員帳號/Email"
                maxLength={100}
              />
            </div>

            <div className="form-input-custom">
              <label
                htmlFor="memberPassword"
                className="form-label form-label-custom text-coffee-primary-900"
              >
                會員密碼
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control form-control-custom rounded-0"
                id="memberPassword"
                placeholder="請輸入會員密碼"
              />
            </div>

            <div className="text-end">
              <Link
                to="/forget"
                href="#"
                className="text-decoration-none link-custom"
              >
                忘記密碼？
              </Link>
            </div>
          </form>

          <button
            type="button"
            className="btn btn-coffee-primary-700 btn-style w-100 rounded-0 border-0"
            onClick={loginHandler}
          >
            登入
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
            透過 Google 登入
          </button>

          <div className="text-center">
            <span className="text-coffee-grey-600 btn-cta-text">
              還不是會員？
            </span>
            <Link to="/signup" className="text-decoration-none link-custom">
              馬上註冊
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

export default Login;
