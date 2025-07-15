import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth, logout } from '../../store/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

import MemberSidebar from '../../components/MemberSidebar/MemberSidebar';
import Footer from '../../components/Footer/Footer';

const OrderDetail = () => {
  const dispatch = useDispatch();
  const { token, isAuthChecked } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { order_id } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthChecked && !token) {
      dispatch(logout());
      navigate('/login');
    }
  }, [isAuthChecked, token, dispatch, navigate]);

  // 取得單一訂單
  useEffect(() => {
    if (!isAuthChecked || !token) return;
    const route = `${apiUrl}/api/v1/users/membership/${order_id}`;

    axios
      .get(route, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrder(res.data.data);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || '發生錯誤';
        setErrorMsg(msg);
        setModalMsg(msg);
        setIsOpen(true);
      });
  }, [isAuthChecked, token, order_id]);

  // 重新一鍵下單
  const handleReorder = async (order) => {
    if (!token) {
      setModalMsg('尚未登入，請先登入會員');
      setIsOpen(true);
      return;
    }

    try {
      for (const item of order.order_details) {
        await axios.post(
          `${apiUrl}/api/v1/users/membership/cart`,
          {
            product_id: item.product_id,
            quantity: item.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      toast.success('已加入購物車');
      navigate('/cart');
    } catch (error) {
      const msg = error.response?.data?.message || '加入失敗，請稍後再操作';
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <MemberSidebar>
            <div className="container sidebar-container-custom w-100">
              <h4 className="content-title m-0">訂單詳細資訊</h4>

              {errorMsg && <p className="text-danger mt-3">{errorMsg}</p>}

              {order && (
                <>
                  <div className="order-summary-header">
                    <div className="order-summary-header-info-status">
                      <div
                        className={
                          order.is_paid ? 'status-success' : 'status-failed'
                        }
                      >
                        {order.is_paid ? '已付款' : '未付款'}
                      </div>
                      <div
                        className={
                          order.is_ship ? 'status-success' : 'status-failed'
                        }
                      >
                        {order.is_ship ? '已出貨' : '未出貨'}
                      </div>
                    </div>
                    <div className="order-summary-header-info">
                      <p className="m-0 order-summary-header-title">訂單編號</p>
                      <p className="m-0 order-summary-header-number">
                        {order.display_id}
                      </p>
                      <p className="m-0 order-summary-header-number">
                        {order.created_day}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="orders-custom">
                {/* 訂單詳情 */}
                {order && (
                  <>
                    {/* 手機版 */}
                    <div className="d-block d-md-none orders-custom-mobile">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div className="order-card" key={index}>
                            <div className="text-group">
                              <p className="m-0 text-group-title">購買品項</p>
                              <p className="m-0 text-group-text">{item.name}</p>
                            </div>
                            <div className="text-group">
                              <p className="m-0 text-group-title">單價</p>
                              <p className="m-0 text-group-text">
                                NTD${' '}
                                <span className="text-group-text">
                                  {item.price.toLocaleString()}
                                </span>
                              </p>
                            </div>
                            <div className="text-group">
                              <p className="m-0 text-group-title">數量</p>
                              <p className="m-0 text-group-text">
                                {item.quantity}
                              </p>
                            </div>
                            <div className="text-group">
                              <p className="m-0 text-group-title">總金額</p>
                              <p className="m-0 text-group-text">
                                NTD${' '}
                                <span className="text-group-text">
                                  {item.subtotal.toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center no-orders">無訂單品項資料</p>
                      )}
                    </div>

                    {/* 桌機版 */}
                    <table className="d-none d-md-table table orders-custom-table m-0 ">
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
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <tr key={index}>
                              <th
                                scope="row"
                                className="orders-custom-tbody-th"
                              >
                                {item.name}
                              </th>
                              <td className="orders-custom-tbody-td price-box">
                                <p className="box-currency m-0">NTD$</p>
                                <p className="box-price m-0">
                                  {item.price.toLocaleString()}
                                </p>
                              </td>
                              <td className="orders-custom-tbody-td">
                                {item.quantity}
                              </td>
                              <td className="orders-custom-tbody-td price-box">
                                <p className="box-currency m-0">NTD$</p>
                                <p className="box-price m-0">
                                  {item.subtotal.toLocaleString()}
                                </p>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="no-orders">
                              無訂單品項資料
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>

              {/* 收件資訊 & 合計 */}
              {order && (
                <div className="orders-info">
                  <div className="orders-info-receiver">
                    <p className="orders-info-title">收件資料</p>

                    <div className="orders-info-receiver-content">
                      <p className="receiver-title m-0">收件人姓名</p>
                      <p className="receiver-text m-0">
                        {order.receiver?.name || '-'}
                      </p>
                    </div>
                    <div className="orders-info-receiver-content">
                      <p className="receiver-title m-0">連絡電話</p>
                      <p className="receiver-text m-0">
                        {order.receiver?.phone || '-'}
                      </p>
                    </div>
                    <div className="orders-info-receiver-content">
                      <p className="receiver-title m-0">郵遞區號</p>
                      <p className="receiver-text m-0">
                        {order.receiver?.post_code || '-'}
                      </p>
                    </div>
                    <div className="orders-info-receiver-content">
                      <p className="receiver-title m-0">收件地址</p>
                      <p className="receiver-text m-0">
                        {order.receiver?.address || '-'}
                      </p>
                    </div>
                  </div>

                  {/* 合計 */}
                  <div className="orders-info-total">
                    <div className="orders-info-total-content">
                      <p className="total-title m-0">優惠碼</p>
                      <p className="total-text m-0">
                        {order.summary.discount_kol || '尚無使用'}
                      </p>
                    </div>
                    <div className="orders-info-total-content">
                      <p className="total-title m-0">商品金額</p>
                      <div className="price-box m-0">
                        <p className="box-currency m-0">NTD$</p>
                        <p className="box-price m-0">
                          {order.summary.product_total}
                        </p>
                      </div>
                    </div>
                    <div className="orders-info-total-content">
                      <p className="total-title m-0">運費</p>
                      <div className="price-box m-0">
                        <p className="box-currency m-0">NTD$</p>
                        <p className="box-price m-0">
                          {order.summary.shipping_fee}
                        </p>
                      </div>
                    </div>
                    <div className="orders-info-total-content">
                      <p className="total-title m-0">小計</p>
                      <div className="price-box m-0">
                        <p className="box-currency m-0">NTD$</p>
                        <p className="box-price m-0">
                          {order.summary.subtotal}
                        </p>
                      </div>
                    </div>
                    <div className="orders-info-total-content">
                      <p className="total-title m-0">優惠折扣</p>
                      <div className="price-box-discount m-0">
                        <p className="box-currency m-0">NTD$</p>
                        <p className="box-price m-0">
                          {order.summary.discount}
                        </p>
                      </div>
                    </div>

                    <div className="orders-info-total-amount">
                      <p className="amount-title m-0">合計</p>
                      <div className="price-box m-0">
                        <p className="amount-currency m-0">NTD$</p>
                        <p className="amount-price m-0">
                          {order.summary?.grand_total?.toLocaleString?.() ??
                            '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 返回 & 付款或重訂 */}
              {order && (
                <div className="back-btn">
                  {order.is_paid ? (
                    <button
                      className="border-0 rounded-0 back-btn-custom back-btn-custom-checkout"
                      onClick={() => handleReorder(order)}
                    >
                      重新訂購
                    </button>
                  ) : (
                    <Link
                      to={`/checkout?order_id=${order.id}`}
                      className="border-0 rounded-0 back-btn-custom back-btn-custom-checkout"
                    >
                      重新付款
                    </Link>
                  )}

                  <button
                    className="border-0 rounded-0 back-btn-custom"
                    onClick={() => navigate('/member/orders')}
                  >
                    返回訂單總覽
                  </button>
                </div>
              )}
            </div>
          </MemberSidebar>
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
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/member/orders');
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
                      setIsOpen(false);
                      navigate('/members/orders');
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
      </div>
    </>
  );
};

export default OrderDetail;
