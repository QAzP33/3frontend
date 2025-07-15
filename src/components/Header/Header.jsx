import { Link, useNavigate, useLocation } from 'react-router-dom';
import { images } from '../../constants/image';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth, logout } from '../../store/authSlice';

import '../../constants/image';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [desktopUserDropdownOpen, setDesktopUserDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const { token, username, isAuthChecked, role } = useSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // 已登入不能進登入相關頁
  useEffect(() => {
    if (
      isAuthChecked &&
      token &&
      ['/login', '/signup', '/forget', '/reset-password'].includes(
        location.pathname,
      )
    ) {
      navigate('');
    }
  }, [isAuthChecked, token, navigate, location.pathname]);

  // 控制選單
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user')) {
        setUserDropdownOpen(false);
        setDesktopUserDropdownOpen(false);
      }
      if (!e.target.closest('.about')) {
        setAboutDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 控制手機選單的捲動
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };
  
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
  
      const overlay = document.querySelector('.mobile-menu-overlay');
      overlay?.addEventListener('touchmove', preventScroll, { passive: false });
      overlay?.addEventListener('wheel', preventScroll, { passive: false });
  
      document.addEventListener('wheel', preventScroll, { passive: false });
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
  
      const overlay = document.querySelector('.mobile-menu-overlay');
      overlay?.removeEventListener('touchmove', preventScroll);
      overlay?.removeEventListener('wheel', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    }
  
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
  
      const overlay = document.querySelector('.mobile-menu-overlay');
      overlay?.removeEventListener('touchmove', preventScroll);
      overlay?.removeEventListener('wheel', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    };
  }, [menuOpen]);
  
  
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-md bg-coffee-primary-700 sticky-top shadow nav-brand">
      <div className="container-fluid container-width">
        <Link to="/" className="navbar-brand nav-logo">
          <img src={images.logoIcon} alt="coffee logo" className="logo-icon" />
          <span className="logo-text text-coffee-secondary-300">築豆咖啡</span>
        </Link>

        {/* 手機版 */}
        <div className="d-flex d-md-none align-items-center ms-auto gap-2 mobile-custom">
          {/* 漢堡按鈕 */}
          <button
            className="hamburger-btn"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {menuOpen && (
          <>
            <div
              className="mobile-menu-overlay"
              onClick={() => setMenuOpen(false)}
            ></div>

            {/* 側邊選單 */}
            <div className="mobile-menu d-md-none">
              <ul className="px-0">
                <li>
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    首頁
                  </Link>
                </li>
                <li>
                  <Link to="/products" onClick={() => setMenuOpen(false)}>
                    商品資訊
                  </Link>
                </li>
                <li className="about">
                  <button onClick={() => setSubMenuOpen(!subMenuOpen)}>
                    關於我們
                    <img
                      src={images.keyboardArrow}
                      alt="arrow"
                      style={{
                        transform: subMenuOpen
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                        transition: '0.3s',
                      }}
                    />
                  </button>
                  {subMenuOpen && (
                    <div className="submenu">
                      <Link to="/contact" onClick={() => setMenuOpen(false)}>
                        關於築豆的咖啡故事
                      </Link>
                      <Link to="/" onClick={() => setMenuOpen(false)}>
                        關於咖啡的那些小事
                      </Link>
                    </div>
                  )}
                </li>
                {token && (
                  <li>
                    <Link to="/cart" onClick={() => setMenuOpen(false)}>
                      購物車
                    </Link>
                  </li>
                )}

                {/* 未登入時顯示登入註冊 */}
                {!token && (
                  <li>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      登入 / 註冊
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}

        {/* 使用者大頭貼 */}
        {token && (
          <div className="user d-block d-md-none">
            <button
              className="border-0 bg-transparent profile-btn"
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setMenuOpen(false);
              }}
            >
              <img
                src={images.profile}
                alt="user"
                className="d-md-none rounded-circle mobile-profile"
              />
            </button>

            {userDropdownOpen && (
              <>
                {/* 遮罩 */}
                <div
                  className="mobile-menu-overlay"
                  onClick={() => setUserDropdownOpen(false)}
                ></div>

                {/* 使用者選單 */}
                <div className="mobile-menu d-md-none">
                  <ul className="px-0">
                    {role === 'ADMIN' ? (
                      <>
                        <li>
                          <a
                            href="https://tt3x3.github.io/south3coffee-dashboard/"
                            className="dropdown-item"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            管理者後台中心
                          </a>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              handleLogout();
                              setUserDropdownOpen(false);
                            }}
                            className="dropdown-item"
                          >
                            登出
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            to="/member/profile"
                            className="dropdown-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            個人資訊
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/member/orders"
                            className="dropdown-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            訂單資訊
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/"
                            className="dropdown-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            願望清單
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              handleLogout();
                              setUserDropdownOpen(false);
                            }}
                            className="dropdown-item"
                          >
                            登出
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* 桌電版 */}
        <ul className="navbar-nav ms-auto d-none d-md-flex align-items-center navbar-menu">
          <li className="nav-item nav-li">
            <Link to="/" className="nav-link nav-link-custom">
              首頁
            </Link>
          </li>
          <li className="nav-item nav-li">
            <Link to="/products" className="nav-link nav-link-custom">
              商品資訊
            </Link>
          </li>
          <li
            className="nav-item dropdown hover-dropdown about"
            onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
          >
            <button
              type="button"
              className="nav-link nav-link-custom dropdown-toggle "
            >
              關於我們
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-custom dropdown-menu-custom-about rounded-0 ${aboutDropdownOpen ? 'show' : ''}`}
            >
              <li>
                <Link
                  to="/contact"
                  className="dropdown-item dropdown-item-custom"
                >
                  關於築豆的咖啡故事
                </Link>
              </li>
              <li>
                <Link to="/" className="dropdown-item dropdown-item-custom">
                  關於咖啡的那些小事
                </Link>
              </li>
            </ul>
          </li>
          {token && (
            <li className="nav-item">
              <Link to="/cart" className="nav-link nav-link-custom ">
                <i className="bi bi-cart2"></i>
              </Link>
            </li>
          )}

          {/* 已登入 */}
          {isAuthChecked && token ? (
            <li className="nav-item dropdown hover-dropdown user">
              <button
                type="button"
                className="nav-link nav-link-custom dropdown-toggle nav-user-toggle"
                onClick={() =>
                  setDesktopUserDropdownOpen(!desktopUserDropdownOpen)
                }
              >
                <img
                  src={images.profile}
                  alt="user"
                  className="rounded-circle nav-profile-mobile d-none d-md-inline-flex"
                />
                {username}
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-custom rounded-0 ${desktopUserDropdownOpen ? 'show' : ''}`}
              >
                {role === 'ADMIN' ? (
                  <>
                    <li>
                      <a
                        href="https://tt3x3.github.io/south3coffee-dashboard/"
                        className="dropdown-item dropdown-item-a"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        管理者後台中心
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item dropdown-item-custom"
                      >
                        登出
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/member/profile"
                        className="dropdown-item dropdown-item-custom"
                      >
                        個人資訊
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/member/orders"
                        className="dropdown-item dropdown-item-custom"
                      >
                        訂單訊息
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/"
                        className="dropdown-item dropdown-item-custom"
                      >
                        願望清單
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item dropdown-item-custom"
                      >
                        登出
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          ) : (
            // 未登入：只顯示登入/註冊按鈕
            <li className="nav-item dropdown hover-dropdown">
              <Link to="/login" className="nav-link nav-link-custom ">
                登入/註冊
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
