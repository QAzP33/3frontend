import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth, logout } from '../../store/authSlice';
import axios from 'axios';

import MemberSidebar from '../../components/MemberSidebar/MemberSidebar';
import Footer from '../../components/Footer/Footer';

const OrderList = () => {
  const dispatch = useDispatch();
  const { token, isAuthChecked } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [_, setErrorMsg] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get('page')) || 1;

  const apiUrl = import.meta.env.VITE_API_URL;
  const route = `${apiUrl}/api/v1/users/membership/orders`;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthChecked && !token) {
      dispatch(logout());
      navigate('/login');
    }
  }, [isAuthChecked, token, dispatch, navigate]);

  // 取得訂單
  useEffect(() => {
    if (!isAuthChecked || !token) return;

    axios
      .get(`${route}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setErrorMsg('');
      })
      .catch((err) => {
        const msg = err.response?.data?.message || '發生錯誤';
        setErrorMsg(msg);
        setOrders([]);
        setModalMsg(msg);
        setIsOpen(true);
      });
  }, [isAuthChecked, token, page]);

  // 重新一鍵下單
  const handleReorder = async (order) => {
    if (!token) {
      setModalMsg('尚未登入，請先登入會員');
      setIsOpen(true);
      return;
    }

    if (!order?.order_details?.length) {
      toast.error('此訂單沒有商品可重新訂購');
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

      toast.success('已加入購物車', {
        autoClose: 1000,
        className: 'product-toast-success',
        bodyClassName: 'product-toast-success-body',
      });
      navigate('/cart');
    } catch (error) {
      const msg = error.response?.data?.message || '加入失敗，請稍後再試';
      toast.error(msg, {
        autoClose: 2000,
        className: 'product-toast-error',
        bodyClassName: 'product-toast-error-body',
      });
    }
  };

  const handlePageClick = (pageNum) => {
    navigate(`/member/orders?page=${pageNum}`);
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <MemberSidebar>
            <div className="container sidebar-container-custom w-100">
              <h4 className="content-title m-0">訂單總覽</h4>
              <div className="orders-custom">
                {/* 手機版 */}
                <div className="d-block d-md-none orders-custom-mobile">
                  {orders.length === 0 ? (
                    <p className="text-center no-orders">查無訂單資料</p>
                  ) : (
                    orders.map((order) => (
                      <Link
                        to={`/member/orders/${order.id}`}
                        key={order.display_id}
                        className="order-card-link"
                      >
                        <div className="order-card">
                          <div className="date-num">
                            <p className="m-0 date-num-style">
                              {order.created_at}
                            </p>
                            <p className="m-0 date-num-style">
                              {order.display_id}
                            </p>
                          </div>
                          <div className="text-group">
                            <p className="m-0 text-group-title">購買品項</p>
                            <p className="m-0 text-group-text">
                              {order.product_name}
                            </p>
                          </div>
                          <div className="text-group">
                            <p className="m-0 text-group-title">總金額</p>
                            <p className="m-0 text-group-text">
                              NTD${order.total_price}
                            </p>
                          </div>
                          <div className="text-group">
                            <p className="m-0 text-group-title">付款狀態</p>
                            <p className="m-0 text-group-text">
                              {order.is_paid ? '付款確認中' : '未付款'}
                            </p>
                          </div>
                          <div className="text-group">
                            <p className="m-0 text-group-title">出貨狀態</p>
                            <p className="m-0 text-group-text">
                              {order.is_ship ? '已出貨' : '未出貨'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* 桌電版 */}
                <table className="d-none d-md-table table orders-custom-table m-0 ">
                  <thead className="orders-custom-style">
                    <tr>
                      <th scope="col" className="orders-custom-style-th">
                        購買時間
                      </th>
                      <th scope="col" className="d-none d-xxl-table-cell orders-custom-style-th">
                        訂單編號
                      </th>
                      <th scope="col" className="orders-custom-style-th">
                        購買品項
                      </th>
                      <th scope="col" className="orders-custom-style-th">
                        總金額
                      </th>
                      <th scope="col" className="orders-custom-style-th">
                        付款狀態
                      </th>
                      <th scope="col" className="orders-custom-style-th">
                        出貨狀態
                      </th>
                      <th scope="col" className="orders-custom-style-th">
                        {' '}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="orders-custom-tbody">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.display_id}>
                          <th className="orders-custom-tbody-th table-order-text">
                            {order.created_at}
                          </th>
                          <td className="d-none d-xxl-table-cell orders-custom-tbody-td table-order-text">
                            {order.display_id}
                          </td>
                          <td className="orders-custom-tbody-td">
                            <div className="check-order">
                              <Link
                                to={`/member/orders/${order.id}`}
                                className="check-order-btn-view border-0"
                              >
                                查看訂單
                              </Link>
                              <p className="check-order-text m-0">
                                {order.product_name || '-'}
                              </p>
                            </div>
                          </td>
                          <td className="orders-custom-tbody-td">
                            NTD$ {order.total_price.toLocaleString()}
                          </td>
                          <td
                            className={
                              order.is_paid
                                ? 'orders-custom-tbody-td'
                                : 'orders-custom-tbody-td-unpaid'
                            }
                          >
                            {order.is_paid ? '付款確認中' : '未付款'}
                          </td>
                          <td
                            className={
                              order.is_ship
                                ? 'orders-custom-tbody-td'
                                : 'orders-custom-tbody-td-unshipped'
                            }
                          >
                            {order.is_ship ? '已出貨' : '未出貨'}
                          </td>
                          <td className="orders-custom-tbody-td">
                            <div className="check-order-btn">
                              {order.is_paid ? (
                                <button
                                  className="check-order-btn-reorder border-0"
                                  onClick={() => handleReorder(order)}
                                >
                                  重新訂購
                                </button>
                              ) : (
                                <Link
                                  to={`/checkout?order_id=${order.id}`}
                                  className="check-order-btn-checkout border-0"
                                >
                                  重新付款
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          查無訂單資料
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 頁碼 */}
              <nav aria-label="Page navigation">
                <ul className="pagination pagination-custom m-0">
                  {page > 1 && (
                    <li className="page-item pagination-custom-item">
                      <button
                        className="page-link pagination-custom-link"
                        onClick={() => handlePageClick(page - 1)}
                      >
                        &laquo;
                      </button>
                    </li>
                  )}

                  {(() => {
                    const maxPagesToShow = 10;
                    let startPage = Math.max(
                      1,
                      page - Math.floor(maxPagesToShow / 2),
                    );
                    let endPage = startPage + maxPagesToShow - 1;
                    if (endPage > totalPages) {
                      endPage = totalPages;
                      startPage = Math.max(1, endPage - maxPagesToShow + 1);
                    }

                    return Array.from(
                      { length: endPage - startPage + 1 },
                      (_, i) => startPage + i,
                    ).map((p) => (
                      <li
                        key={p}
                        className={`page-item pagination-custom-item ${p === page ? 'active' : ''}`}
                      >
                        <button
                          className="page-link pagination-custom-link"
                          onClick={() => handlePageClick(p)}
                        >
                          {p}
                        </button>
                      </li>
                    ));
                  })()}

                  {page < totalPages && (
                    <li className="page-item pagination-custom-item">
                      <button
                        className="page-link pagination-custom-link"
                        onClick={() => handlePageClick(page + 1)}
                      >
                        &raquo;
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
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

export default OrderList;
