import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { images } from '../../constants/image';

const CartList = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [total, setTotal] = useState(0);
  const [modalMsg, setModalMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [recommendList, setRecommendList] = useState([]);
  const [recommendPage, setRecommendPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const saveSelectedToLocal = (set) => {
    localStorage.setItem('cartSelected', JSON.stringify(Array.from(set)));
  };

  const loadSelectedFromLocal = () => {
    const stored = localStorage.getItem('cartSelected');
    if (stored) return new Set(JSON.parse(stored));
    return new Set();
  };

  const selectedItemsRef = useRef(new Set());

  // 取得購物車
  const getCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setModalMsg('請先登入會員');
        setIsOpen(true);
        return;
      }
      const res = await axios.get(`${apiUrl}/api/v1/users/membership/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
        params: { t: Date.now() }, // 強制避免快取
      });

      const cartData = res.data?.data?.items;
      const cartInfo = res.data?.data;

      if (!Array.isArray(cartData)) {
        throw new Error('從伺服器收到的購物車資料格式不正確');
      }

      const filtered = cartData.filter((item) => !item.deleted_at); // 防止顯示軟刪除項

      setCartItems(
        filtered.map((item) => ({
          product: {
            id: item.product_id,
            name: item.name,
            image_url: item.image_url,
            price: item.price,
          },
          quantity: item.quantity || 1,
          price: item.price,
          is_selected: item.is_selected,
        })),
      );

      const fallbackSelected = new Set();
      filtered.forEach((item) => {
        if (item.is_selected) fallbackSelected.add(item.product_id);
      });
      const localSelected = loadSelectedFromLocal();
      const merged = new Set([
        ...fallbackSelected,
        ...localSelected,
        ...Array.from(selectedItemsRef.current),
      ]);
      setSelectedItems(merged);

      selectedItemsRef.current = merged;

      const price =
        cartInfo?.final_price ||
        filtered.reduce(
          (acc, item) =>
            merged.has(item.product_id)
              ? acc + item.price * (item.quantity || 1)
              : acc,
          0,
        );
      setTotal(price);
    } catch (error) {
      if (
        error.response?.status === 404 ||
        error.response?.data?.message === '購物車是空的'
      ) {
        setCartItems([]);
        setTotal(0);
      } else {
        const msg =
          error.response?.data?.message || error.message || '取得購物車失敗';
        setModalMsg(msg);
        setIsOpen(true);
      }
    }
  }, [apiUrl]);

  // 更新購物商商品數量
  const updateQuantity = async (productId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    setCartItems(
      cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setModalMsg('請先登入會員');
        setIsOpen(true);
        return;
      }

      await axios.patch(
        `${apiUrl}/api/v1/users/membership/cart`,
        { product_id: productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      const msg = error.response?.data?.message || '更新數量失敗';
      setModalMsg(msg);
      setIsOpen(true);
    }
  };

  // 刪除購物車項目
  const removeItem = async (productId) => {
    setCartItems(cartItems.filter((item) => item.product.id !== productId));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${apiUrl}/api/v1/users/membership/cart/delete`,
        { product_id: productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      const msg = error.response?.data?.message || '刪除失敗';
      setModalMsg(msg);
      setIsOpen(true);
    }
  };

  // 加入購物車
  const handleAddToCart = async (productId, event) => {
    if (addingId) return;
    setAddingId(productId);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setModalMsg('尚未登入，請先登入會員');
        setIsOpen(true);
        setAddingId(null);
        return;
      }

      await axios.post(
        `${apiUrl}/api/v1/users/membership/cart`,
        {
          product_id: productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      toast.success('已加入購物車', {
        autoClose: 500,
        className: 'product-toast-success',
        bodyClassName: 'product-toast-success-body',
        onClose: () => {
          navigate(0);
        },
      });
      if (event?.target) event.target.blur();
    } catch (error) {
      const msg = error.response?.data?.message || '加入失敗，請稍後再操作';
      toast.error(msg, {
        autoClose: 1000,
        className: 'product-toast-error',
        bodyClassName: 'product-toast-error-body',
      });
    } finally {
      setTimeout(() => setAddingId(null), 500);
    }
  };

  const handleSelectAll = () => {
    let updatedSelected;
    if (selectedItems.size === cartItems.length) {
      updatedSelected = new Set();
    } else {
      updatedSelected = new Set(cartItems.map((item) => item.product.id));
    }
    setSelectedItems(updatedSelected);
    selectedItemsRef.current = updatedSelected;
    saveSelectedToLocal(updatedSelected);
  };

  const handleSelectItem = (productId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      selectedItemsRef.current = newSelected;
      saveSelectedToLocal(newSelected);
      return newSelected;
    });
  };

  useEffect(() => {
    // 當購物車項目或選中項目改變時，重新計算總金額
    const newTotal = cartItems
      .filter((item) => selectedItems.has(item.product.id))
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
    
    if (couponCode) {
      setCouponCode('');
      setCouponError('商品變動，請重新輸入優惠券');
      setCouponSuccess('');
      setDiscountAmount(0);
    }
  }, [cartItems, selectedItems]);

  const handleDecrease = (item) => {
    updateQuantity(item.product.id, item.quantity - 1);
  };

  const handleIncrease = (item) => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleChange = (e, item) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      updateQuantity(item.product.id, val);
    }
  };

  const minValue = 1;

  // 套用優惠券
  const applyCoupon = async () => {
    const trimmedCode = couponCode.trim();

    if (
      trimmedCode.length === 0 ||
      trimmedCode !== couponCode ||
      !/^[A-Z0-9]{6}$/.test(trimmedCode)
    ) {
      setDiscountAmount(0);
      setCouponError('無此優惠劵');
      setCouponSuccess('');

      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `${apiUrl}/api/v1/users/membership/cart/discount`,
          {
            discount_id: null,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (err) {
        console.warn('清除後端優惠劵失敗：', err);
      }

      return;
    }

    await revalidateCoupon(trimmedCode);
  };

  // 重新驗證優惠券
  const revalidateCoupon = async (trimmedCode) => {
    try {
      const token = localStorage.getItem('token');

      const selectedTotal = cartItems
        .filter((item) => selectedItems.has(item.product.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

      const res = await fetch(`${apiUrl}/api/v1/users/membership/discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          discount_kol: trimmedCode,
          selected_total: selectedTotal,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        const discount = Math.min(
          result.data.discount_amount || 0,
          selectedTotal,
        );
        setDiscountAmount(discount);
        setCouponSuccess('已成功套用優惠券');
        setCouponError('');

        if (result.data?.discount_id) {
          await axios.patch(
            `${apiUrl}/api/v1/users/membership/cart/discount`,
            {
              discount_id: result.data.discount_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            },
          );
        }
      } else {
        setDiscountAmount(0);
        const knownMessages = [
          '無此優惠劵',
          '此優惠劵您已使用過',
          '優惠劵已逾期',
          '優惠劵已用光',
          '您的購物車是空的，無法套用優惠券',
          '不符活動門檻',
          '此優惠劵已失效',
        ];
        if (knownMessages.includes(result.message)) {
          setCouponError(result.message);
        } else {
          setCouponError('請重新套用優惠劵');
        }
        setCouponSuccess('');

        await axios.patch(
          `${apiUrl}/api/v1/users/membership/cart/discount`,
          {
            discount_id: null,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
    } catch (err) {
      setDiscountAmount(0);
      setCouponError('伺服器錯誤');
      setCouponSuccess('');
      console.error('revalidateCoupon error:', err);
    }
  };

  // 前往結帳
  const handleGoToCheckout = async () => {
    const token = localStorage.getItem('token');
    const selectedIds = Array.from(selectedItems);

    if (selectedIds.length === 0) {
      setModalMsg('請勾選至少一項商品');
      setIsOpen(true);
      return;
    }

    try {
      await axios.patch(
        `${apiUrl}/api/v1/users/membership/cart/select`,
        {
          selected_ids: selectedIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (discountAmount === 0) {
        await axios.patch(
          `${apiUrl}/api/v1/users/membership/cart/discount`,
          {
            discount_id: null,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      navigate('/create-order');
    } catch (error) {
      const msg = error.response?.data?.message || '無法前往結帳';
      setModalMsg(msg);
      setIsOpen(true);
    }
  };

  // 取得推薦商品
  const getBestSeller = useCallback(async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/v1/products/bestSeller?limit=12`,
      );
      setRecommendList(res.data?.data || []);
    } catch (error) {
      console.error('取得推薦商品失敗', error);
    }
  }, [apiUrl]);

  useEffect(() => {
    getCart();
    getBestSeller();
  }, [getCart, getBestSeller]);

  // 推薦商品用分頁輪播
  const perRecommendPage = 4;
  const totalRecommendPages = Math.ceil(
    recommendList.length / perRecommendPage,
  );

  const handleRecommendPrev = () => {
    setRecommendPage((prev) =>
      prev === 0 ? totalRecommendPages - 1 : prev - 1,
    );
  };

  const handleRecommendNext = () => {
    setRecommendPage((prev) =>
      prev === totalRecommendPages - 1 ? 0 : prev + 1,
    );
  };

  const currentRecommendList = recommendList.slice(
    recommendPage * perRecommendPage,
    recommendPage * perRecommendPage + perRecommendPage,
  );

  return (
    <>
      <Header />
      <div className="bg-coffee-bg-light cart-custom">
        <div className="cart-banner-container">
          <img
            src={images.hotCoffeeBanner}
            alt="cart banner"
            className="narrow-banner"
          />
        </div>
        <div className="container cart-container p-0 ">
          {/* 頁面標題 */}
          <div className="cart-title">
            <p className="cart-title-chinese m-0">購物車</p>
            <span className="cart-title-line"></span>
            <p className="cart-title-english m-0">Shopping cart</p>
          </div>

          <div className="content-style m-0">
            <div className="content-style-cart p-0">
              <div className="cart-custom">
                {cartItems.length > 0 ? (
                  <>
                    {/* 商品清單 */}
                    {/* 手機版 */}
                    <div className="d-flex d-md-none cart-custom-mobile">
                      {cartItems.map((item) => (
                        <div className="order-card" key={item.product.id}>
                          <div className="text-group">
                            <div className="product-img-group">
                              <input
                                type="checkbox"
                                className="checkbox-custom rounded-0"
                                checked={selectedItems.has(item.product.id)}
                                onChange={() =>
                                  handleSelectItem(item.product.id)
                                }
                              />
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="cart-product-img"
                              />
                            </div>
                            <div className="product-info-group">
                              <div className="info-header">
                                <div className="m-0 text-group-header">
                                  <p className="text-group-text m-0">
                                    {item.product.name}
                                  </p>
                                  <div
                                    className="del-icon"
                                    onClick={() => removeItem(item.product.id)}
                                  >
                                    <img
                                      src={images.delIcon}
                                      alt="delete icon-detail"
                                    />
                                  </div>
                                </div>
                              </div>
                              <p className="m-0 text-group-price">
                                NTD${' '}
                                <span className="text-group-text">
                                  {item.product.price}
                                </span>
                              </p>
                              {/* 增減數量 */}
                              <div className="order-options">
                                <div className="order-options-quantity">
                                  <button
                                    type="button"
                                    className="quantity-decrease"
                                    onClick={() => handleDecrease(item)}
                                  >
                                    <div className="decrease-icon">
                                      <img
                                        src={images.productDecrease}
                                        alt="product-decrease"
                                        className="decrease-detail"
                                      />
                                    </div>
                                  </button>
                                  <div className="quantity-value">
                                    <input
                                      type="number"
                                      className="value-input border-0"
                                      value={item.quantity}
                                      onChange={(e) => handleChange(e, item)}
                                      min={minValue}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="quantity-increase"
                                    onClick={() => handleIncrease(item)}
                                  >
                                    <div className="increase-icon">
                                      <img
                                        src={images.productIncrease}
                                        alt="product-increase"
                                        className="increase-detail"
                                      />
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 桌電版 */}
                    <div className="d-none d-md-block">
                      <div className="table-body-scroll-container">
                        <table className="table cart-custom-table m-0">
                          <thead className="cart-custom-style">
                            <tr>
                              <th scope="col" className="cart-custom-style-th">
                                <input
                                  type="checkbox"
                                  className="checkbox-custom"
                                  onChange={handleSelectAll}
                                  checked={
                                    cartItems.length > 0 &&
                                    selectedItems.size === cartItems.length
                                  }
                                />
                              </th>
                              <th scope="col" className="cart-custom-style-th">
                                商品圖片
                              </th>
                              <th scope="col" className="cart-custom-style-th">
                                商品名稱
                              </th>
                              <th scope="col" className="cart-custom-style-th">
                                單價
                              </th>
                              <th scope="col" className="cart-custom-style-th">
                                數量
                              </th>
                              <th scope="col" className="cart-custom-style-th">
                                小計
                              </th>
                              <th
                                scope="col"
                                className="cart-custom-style-th"
                              ></th>
                            </tr>
                          </thead>
                          <tbody className="cart-custom-tbody">
                            {cartItems.map((item) => (
                              <tr key={item.product.id}>
                                <th
                                  scope="row"
                                  className="cart-custom-tbody-th"
                                >
                                  <input
                                    type="checkbox"
                                    className="checkbox-custom"
                                    checked={selectedItems.has(item.product.id)}
                                    onChange={() =>
                                      handleSelectItem(item.product.id)
                                    }
                                  />
                                </th>
                                <td className="cart-custom-tbody-td cart-product">
                                  <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="cart-product-img"
                                  />
                                </td>
                                <td className="cart-custom-tbody-td product-name">
                                  {item.product.name}
                                </td>
                                <td className="cart-custom-tbody-td">
                                  <p className="box-currency m-0">
                                    NTD$ <span>{item.product.price}</span>
                                  </p>
                                </td>
                                <td className="cart-custom-tbody-td">
                                  {/* 增減數量 */}
                                  <div className="order-options">
                                    <div className="order-options-quantity">
                                      <button
                                        type="button"
                                        className="quantity-decrease"
                                        onClick={() => handleDecrease(item)}
                                      >
                                        <div className="decrease-icon">
                                          <img
                                            src={images.productDecrease}
                                            alt="product-decrease"
                                            className="decrease-detail"
                                          />
                                        </div>
                                      </button>
                                      <div className="quantity-value">
                                        <input
                                          type="number"
                                          className="value-input border-0"
                                          value={item.quantity}
                                          onChange={(e) =>
                                            handleChange(e, item)
                                          }
                                          min={minValue}
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        className="quantity-increase"
                                        onClick={() => handleIncrease(item)}
                                      >
                                        <div className="increase-icon">
                                          <img
                                            src={images.productIncrease}
                                            alt="product-increase"
                                            className="increase-detail"
                                          />
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="cart-custom-tbody-td">
                                  <p className="box-currency m-0">
                                    NTD${' '}
                                    <span>
                                      {item.product.price * item.quantity}
                                    </span>
                                  </p>
                                </td>
                                <td className="cart-custom-tbody-td">
                                  <div
                                    className="del-icon"
                                    onClick={() => removeItem(item.product.id)}
                                  >
                                    <img
                                      src={images.delIcon}
                                      alt="delete icon-detail"
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <table className="table cart-custom-table m-0 ">
                    <thead className="cart-custom-style">
                      <tr>
                        <th scope="col" className="cart-custom-style-th">
                          <input type="checkbox" className="checkbox-custom" />
                        </th>
                        <th scope="col" className="cart-custom-style-th">
                          商品圖片
                        </th>
                        <th scope="col" className="cart-custom-style-th">
                          商品名稱
                        </th>
                        <th scope="col" className="cart-custom-style-th">
                          單價
                        </th>
                        <th scope="col" className="cart-custom-style-th">
                          數量
                        </th>
                        <th scope="col" className="cart-custom-style-th">
                          小計
                        </th>
                        <th scope="col" className="cart-custom-style-th"></th>
                      </tr>
                    </thead>
                    <tbody className="cart-custom-tbody">
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          您的購物車是空的
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* 結算區域 */}
            <div className="cart-total">
              <div className="cart-total-custom">
                <div className="coupon-section">
                  <p className="coupon-title m-0">優惠券</p>
                  <div className="coupon-input">
                    <input
                      type="text"
                      placeholder="請輸入優惠序號"
                      maxLength={10}
                      value={couponCode}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 10);
                        setCouponCode(value);
                        setCouponError('');
                        setCouponSuccess('');

                        if (value.trim().length === 0) {
                          setDiscountAmount(0); //使用者清空優惠碼時，自動歸零折扣金額
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={`coupon-btn border-0 ${couponCode ? 'active' : ''}`}
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                    >
                      <p className="m-0">套用</p>
                    </button>
                  </div>

                  {/* 成功訊息 */}
                  {couponSuccess && (
                    <p className="coupon-title text-success mt-1">
                      {couponSuccess}
                    </p>
                  )}

                  {/* 錯誤訊息 */}
                  {couponError && (
                    <p className="coupon-title text-danger mt-1">
                      {couponError}
                    </p>
                  )}
                </div>

                <div className="price-detail">
                  <p className="product-title m-0">商品金額</p>
                  <div className="price-box">
                    <p className="product-price m-0">NTD$</p>
                    <p className="product-price m-0">
                      {total.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="price-detail">
                  <p className="account-title m-0">折扣金額</p>
                  <div className="price-box">
                    <p className="account-price m-0">NTD$</p>
                    <p className="account-price m-0">
                      {discountAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <span className="total-line"></span>

                <div className="price-detail">
                  <p className="total-title m-0">金額總計</p>
                  <div className="price-box">
                    <p className="total-price m-0">NTD$</p>
                    <p className="total-price m-0">
                      {Math.max(total - discountAmount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="coupon-check">
                  <button
                    type="button"
                    className="coupon-check-continue"
                    onClick={() => navigate('/products')}
                  >
                    繼續選購
                  </button>
                  <button
                    type="button"
                    className="coupon-check-proceed border-0"
                    onClick={handleGoToCheckout}
                    disabled={total === 0}
                    style={{
                      cursor: total === 0 ? 'not-allowed' : 'pointer',
                      opacity: total === 0 ? 0.5 : 1,
                    }}
                  >
                    前往結帳
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 推薦 */}
          <div className="recommend-custom">
            <button
              type="button"
              className="recommend-custom-btn border-0"
              onClick={handleRecommendPrev}
            >
              <div className="arrow-icon">
                <img
                  src={images.reviewArrowL}
                  alt="recommend-arrow-left"
                  className="icon-detail"
                />
              </div>
            </button>

            <div className="recommend-card">
              <div className="recommend-header">
                <h5 className="recommend-title m-0">本期推薦</h5>
              </div>

              <div
                className="card-group"
                onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  const touchEnd = e.changedTouches[0].clientX;
                  const distance = touchStart - touchEnd;
                  const threshold = 50; // 滑動門檻

                  if (distance > threshold) {
                    handleRecommendNext();
                  } else if (distance < -threshold) {
                    handleRecommendPrev();
                  }
                }}
              >
                {currentRecommendList.map((item) => {
                  const isSoldOut = item.stock === 0;
                  return (
                    <Link
                      to={`/products/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card recommend-card-style m-0 rounded-0 border-0"
                      key={item.id}
                    >
                      <img
                        src={item.image_url}
                        className="card-img-top card-img rounded-0"
                        alt={item.name}
                      />
                      <div className="recommend-card-content">
                        <div className="recommend-card-body">
                          <h5 className="card-title recommend-card-body-title m-0">
                            {item.name}
                          </h5>
                          <div className="recommend-card-body-title-icon">
                            <img
                              src={images.unlikeIcon}
                              alt="unlike icon"
                              className="icon-detail"
                            />
                          </div>
                        </div>
                        <div className="recommend-card-body-text">
                          <p className="text-content m-0">
                            {item.feature ||
                              item.description ||
                              '無商品特色描述'}
                          </p>
                        </div>
                        <div className="recommend-card-bottom">
                          <div className="recommend-price-box">
                            <p className="recommend-price m-0">NTD$</p>
                            <p className="recommend-price m-0">{item.price}</p>
                          </div>
                        </div>
                        <button
                          className={`btn recommend-card-btn rounded-0 ${isSoldOut ? 'sold-out' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleAddToCart(item.id);
                          }}
                          disabled={addingId === item.id || isSoldOut}
                        >
                          {isSoldOut
                            ? '已售罄'
                            : addingId === item.id
                              ? '加入中...'
                              : '加入購物車'}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* 輪播「點點頁碼」指示器 */}
              <div className="recommend-dots">
                {Array.from({ length: totalRecommendPages }).map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === recommendPage ? 'active' : ''}`}
                    onClick={() => setRecommendPage(i)}
                  ></span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="recommend-custom-btn border-0"
              onClick={handleRecommendNext}
            >
              <div className="arrow-icon">
                <img
                  src={images.reviewArrowR}
                  alt="recommend-arrow-right"
                  className="icon-detail"
                />
              </div>
            </button>
          </div>
        </div>
        <div></div>
      </div>
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
                  onClick={() => {
                    setIsOpen(false);
                    if (modalMsg === '請先登入會員') {
                      navigate('/login');
                    }
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

export default CartList;
