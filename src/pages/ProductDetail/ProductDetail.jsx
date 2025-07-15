import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import { images } from '../../constants/image';

const thumbnailUrls = [
  'https://images.unsplash.com/photo-1625021659159-f63f546d74a7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1553292218-4892c2e7e1ae?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1604838699342-2343976f84ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1590019028558-4719611156c4?q=80&w=804&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1522825180917-a355ef45e880?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const ProductDetail = () => {
  const { product_id } = useParams();
  const minValue = 1;
  const [selectedQuantity, setSelectedQuantity] = useState(minValue);
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [product, setProduct] = useState(null);

  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [showTopBtn, setShowTopBtn] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const productRoute = `${apiUrl}/api/v1/products/${product_id}`;
  const cartRoute = `${apiUrl}/api/v1/users/membership/cart`;

  const handleGoBack = () => {
    navigate(-1);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (product === null) return;
    if (!product?.id) {
      navigate('/products');
    }
  }, [product, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 評論相關
  const [touchStart, setTouchStart] = useState(0);

  const reviews = [
    {
      name: 'Soham',
      date: '2024/09/22',
      content:
        '這款豆子帶有優雅的花香與柑橘果酸，口感明亮清爽，是我每天早上最喜歡的手沖選擇，喝起來就像陽光灑進窗台的味道。沖煮時，香氣慢慢瀰漫整個空間，像是一種柔和而穩定的提醒：新的一天可以這樣溫柔開始。冷卻後的風味依然乾淨不雜，酸甜平衡，尾韻輕柔帶點蜜香，特別適合在安靜的早晨中靜靜享受，成為我日常生活中最小而確實的幸福。',
      stars: 5,
      profile: images.commentProfile[0],
    },
    {
      name: 'Ronald',
      date: '2024/08/10',
      content:
        '期待更多風味變化，但這款對我來說偏平淡，沒有預期中的層次，可能不太適合喜歡重香氣的咖啡迷。',
      stars: 2,
      profile: images.commentProfile[1],
    },
    {
      name: 'Grey',
      date: '2024/07/18',
      content:
        '香氣還不錯，但萃取時有點難掌握，不知道是不是我研磨太細。喝起來中規中矩，適合不喜歡酸感的人。',
      stars: 3,
      profile: images.commentProfile[2],
    },
    {
      name: 'Aubrey',
      date: '2024/07/18',
      content:
        '可能不是我喜歡的類型，味道偏淡，香氣也不太突出，入口後的層次感比較單一，沒有留下太深刻的印象。我原本是抱著對花果香調的期待來嘗試，但實際風味與商品描述有些落差，可能是烘焙時間或豆子保存方式影響了品質。不過包裝設計和出貨速度都很不錯，整體體驗仍算用心，也許會更適合喜歡清淡風格、低酸型豆子的朋友。',
      stars: 1,
      profile: images.commentProfile[3],
    },
    {
      name: 'Lynn',
      date: '2024/06/12',
      content:
        '入口的瞬間有微微堅果香，後段轉成溫潤的焦糖調性，很適合下午搭配甜點一起享用。口感圓潤，風味穩定，是屬於那種不會出錯的安全牌。',
      stars: 4,
      profile: images.commentProfile[4],
    },
    {
      name: 'Kyle',
      date: '2024/05/25',
      content:
        '前段果酸明亮，讓人想起紅蘋果與莓果的組合，尾韻乾淨俐落。用 V60 表現不錯，加一點悶蒸時間會更有層次，是我近期喝到最驚喜的一款。',
      stars: 5,
      profile: images.commentProfile[5],
    },
    {
      name: 'Mike',
      date: '2024/05/03',
      content:
        '喝起來比較厚實一點，整體偏苦甜調性，風味集中。不是我喜歡的清爽果酸系，但應該會很受深焙派的喜愛者喜歡。',
      stars: 3,
      profile: images.commentProfile[6],
    },
    {
      name: 'Ivy',
      date: '2024/04/16',
      content:
        '風味細緻，冷掉後還保有甜感和香氣，很適合做冷萃。前段有柑橘調，尾韻帶點白花香，連續三天都喝這款都不膩。',
      stars: 5,
      profile: images.commentProfile[7],
    },
    {
      name: 'Hana',
      date: '2024/03/28',
      content:
        '這支豆子的乾香超迷人，有點像焦糖爆米花，磨豆時就很期待。可惜實際喝起來酸感有點搶戲，適合調整水溫或濃度試試。',
      stars: 4,
      profile: images.commentProfile[8],
    },
    {
      name: 'Bob',
      date: '2024/03/05',
      content:
        '本來以為只是普通的日常豆，結果一沖就被香氣圈粉。前段有水蜜桃的果香，溫度變化後竟然出現花香尾韻，真的蠻驚喜的。',
      stars: 5,
      profile: images.commentProfile[9],
    },
    {
      name: 'Asuka',
      date: '2024/02/20',
      content:
        '個人覺得這支表現比較平，沒有太多記憶點，但整體還是順口耐喝，適合在辦公室泡一壺慢慢喝的類型。',
      stars: 2,
      profile: images.commentProfile[10],
    },
    {
      name: 'Ethan',
      date: '2024/01/30',
      content:
        '回甘很明顯，喝完口腔有點甜甜的感覺，像是紅糖的尾韻，配上剛出爐的麵包超搭。應該會回購！',
      stars: 4,
      profile: images.commentProfile[11],
    },
  ];

  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.ceil(reviews.length / perPage);

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const currentReviews = reviews.slice(
    page * perPage,
    page * perPage + perPage,
  );

  // 取單商品詳情
  useEffect(() => {
    axios
      .get(productRoute)
      .then((res) => {
        const data = res.data.data;

        if (data) {
          setProduct(data);
          const mergedImages = [
            ...(Array.isArray(data.image_urls) ? data.image_urls : []),
            ...thumbnailUrls,
          ].slice(0, 4); 

          setThumbnails(mergedImages);
          setMainImage(mergedImages[0]);
        } else {
          navigate('/products');
        }
      })
      .catch(() => {
        setProduct({});
        navigate('/products');
      });
  }, [product_id]);

  // 加入購物車
  const handleAddToCart = (productId, event) => {
    if (addingId) return;
    setAddingId(productId);

    if (!product || !product.id) {
      setModalMsg('商品資訊有誤，請稍後再試');
      setIsOpen(true);
      setAddingId(null);
      return;
    }

    if (selectedQuantity <= 0) {
      setModalMsg('數量無效，請重新輸入');
      setIsOpen(true);
      setAddingId(null);
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setModalMsg('尚未登入，請先登入會員');
      setIsOpen(true);
      setAddingId(null);
      return;
    }

    axios
      .post(
        cartRoute,
        {
          product_id: product.id,
          quantity: selectedQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        toast.success('已加入購物車', {
          autoClose: 800,
          className: 'product-toast-success',
          bodyClassName: 'product-toast-success-body',
        });
        if (event?.target) event.target.blur();
      })
      .catch((error) => {
        const msg = error.response?.data?.message || '加入失敗，請稍後再試';
        toast.error(msg, {
          autoClose: 2000,
          className: 'product-toast-error',
          bodyClassName: 'product-toast-error-body',
        });
      })
      .finally(() => {
        setTimeout(() => setAddingId(null), 800);
      });
  };

  // 數量加減事件
  const handleDecrease = () => {
    setSelectedQuantity((prevQuantity) => Math.max(prevQuantity - 1, minValue));
  };

  const handleIncrease = () => {
    setSelectedQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= minValue) {
      setSelectedQuantity(val);
    } else {
      setSelectedQuantity(minValue);
    }
  };

  if (!product) {
    return <div></div>;
  }

  const isSoldOut = product.stock === 0;

  return (
    <>
      <Header />
      <div className="bg-coffee-bg-light products-custom-style">
        <div className="container products-container p-0 ">
          {/* 分類項目 */}
          <div></div>
          <ul className="products-breadcrumb m-0 p-0">
            <li className="products-breadcrumb-item">
              <Link to="/" className="products-breadcrumb-link">
                首頁
              </Link>
            </li>
            <li className="products-breadcrumb-arrow">&gt;</li>
            <li className="products-breadcrumb-item">
              <Link to="/products" className="products-breadcrumb-link">
                商品資訊
              </Link>
            </li>
            <li className="products-breadcrumb-arrow">&gt;</li>
            <li className="products-breadcrumb-item">
              {product.classification_name ? (
                <Link
                  to={`/products?classification=${product.classification_name}&page=1`}
                  className="products-breadcrumb-link"
                >
                  {product.classification_name}
                </Link>
              ) : (
                <Link to="/products" className="products-breadcrumb-link">
                  所有商品
                </Link>
              )}
            </li>
          </ul>

          {/* 主要商品內容 */}
          <div key={product_id} className="detail-container">
            <div className="img-custom-layout">
              {/* 商品 */}
              <div className="product-main">
                {/* 商品縮圖 */}
                <div className="product-thumbnails">
                  {thumbnails.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`thumbnail-${idx}`}
                      className={`img-style ${mainImage === url ? 'selected' : ''}`}
                      onClick={() => setMainImage(url)}
                    />
                  ))}
                </div>
                <img
                  src={mainImage}
                  alt="thumbnails 1"
                  className="product-main-img"
                />

                {/* 商品內容 */}
                <div className="product-main-content">
                  <div className="product-main-content-info">
                    <div className="product-main-content-info-title">
                      <h4 className="product-name m-0">{product.name}</h4>
                      <div className="product-like-icon">
                        <img
                          src={images.unlikeIcon}
                          alt="unlike icon"
                          className="icon-detail"
                        />
                      </div>
                    </div>
                    <div className="product-main-content-origin m-0">
                      <div className="text-icon-group">
                        <div className="text-icon">
                          <img
                            src={images.originIcon}
                            alt="icon"
                            className="text-icon-detail"
                          />
                        </div>
                        <p className="text-title m-0">產地</p>
                      </div>
                      <p className="text-content">{product.origin || ' '}</p>
                    </div>
                    <div className="product-main-content-flavor m-0">
                      <div className="text-icon-group">
                        <div className="text-icon">
                          <img
                            src={images.flavorIcon}
                            alt="icon"
                            className="text-icon-detail"
                          />
                        </div>
                        <p className="text-title m-0">風味</p>
                      </div>
                      <p className="text-content">{product.flavor || ' '}</p>
                    </div>
                    <div className="product-main-content-detail m-0">
                      <div className="text-icon-group">
                        <div className="text-icon">
                          <img
                            src={images.infoIcon}
                            alt="icon"
                            className="text-icon-detail"
                          />
                        </div>
                        <p className="text-title m-0">詳細資訊</p>
                      </div>
                      <p className="text-content">
                        品種：{product.variety || ' '}
                      </p>
                      <p className="text-content">
                        處理方式：{product.process_method || ' '}
                      </p>
                      <p className="text-content">
                        酸度：{product.acidity || ' '}
                      </p>
                      <p className="text-content">
                        甜感：{product.flavor || ' '}
                      </p>
                      <p className="text-content">
                        尾顏：{product.aftertaste || ' '}
                      </p>
                    </div>

                    {/* 購買相關 */}
                    <div className="product-main-summary">
                      <div className="product-order-options">
                        {!isSoldOut && (
                          <div className="product-order-options-quantity">
                            <button
                              type="button"
                              className="quantity-decrease"
                              onClick={handleDecrease}
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
                                value={selectedQuantity}
                                onChange={handleChange}
                                min={minValue}
                                inputMode="numeric"
                              />
                            </div>
                            <button
                              type="button"
                              className="quantity-increase"
                              onClick={handleIncrease}
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
                        )}

                        <div className="product-order-options-stock">
                          <div
                            className={`product-order-options-stock ${isSoldOut ? 'sold-out-text' : ''}`}
                          >
                            {isSoldOut ? '售罄' : `庫存：${product.stock}`}
                          </div>
                        </div>
                      </div>

                      <div className="product-price">
                        NTD${product.price || 999}
                      </div>
                    </div>

                    <button
                      className={`product-main-cart border-0 ${isSoldOut ? 'sold-out' : ''}`}
                      onClick={handleAddToCart}
                      disabled={addingId || isSoldOut}
                    >
                      {isSoldOut
                        ? '加入購物車'
                        : addingId
                          ? '加入中...'
                          : '加入購物車'}
                    </button>
                  </div>

                  <div className="product-main-description">
                    <h6 className="description-title m-0">商品說明</h6>
                    <span className="description-line"></span>
                    <p className="description-content m-0">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 評論 */}
          <div className="reviews-custom">
            <button
              type="button"
              className="reviews-custom-btn border-0"
              onClick={handlePrev}
            >
              <div className="arrow-icon">
                <img
                  src={images.reviewArrowL}
                  alt="review-arrow-left"
                  className="icon-detail"
                />
              </div>
            </button>

            <div className="reviews-custom-content">
              <div className="reviews-title">
                <h5 className="title-detail m-0">客戶評論</h5>
                <span className="title-line"></span>
              </div>

              {/* 單一評論 */}
              <div
                className="reviews-select"
                onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  const touchEnd = e.changedTouches[0].clientX;
                  const distance = touchStart - touchEnd;

                  if (window.innerWidth <= 1315) {
                    if (distance > 50) handleNext();
                    if (distance < -50) handlePrev();
                  }
                }}
              >
                {currentReviews.map((r, idx) => (
                  <div className="reviews-box" key={idx}>
                    <div className="reviews-box-top">
                      <img src={r.profile} alt="customer profile" />
                      <div className="reviews-box-top-detail">
                        <div className="reviews-box-top-detail-text">
                          <p className="customer-name m-0">{r.name}</p>
                          <p className="review-time m-0">{r.date}</p>
                        </div>

                        <div className="reviews-box-top-stars">
                          {Array.from({ length: r.stars }).map((_, i) => (
                            <div className="review-starts" key={`yellow-${i}`}>
                              <img
                                src={images.starIcon[0]}
                                alt="yellow star"
                                className="starts-icon"
                              />
                            </div>
                          ))}
                          {Array.from({ length: 5 - r.stars }).map((_, i) => (
                            <div className="review-starts" key={`gray-${i}`}>
                              <img
                                src={images.starIcon[1]}
                                alt="gray star"
                                className="starts-icon"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="reviews-box-content">{r.content}</div>
                  </div>
                ))}
              </div>

              {/* 點點 */}
              <div className="reviews-dots">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === page ? 'active' : ''}`}
                    onClick={() => setPage(i)}
                  ></span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="reviews-custom-btn border-0"
              onClick={handleNext}
            >
              <div className="arrow-icon">
                <img
                  src={images.reviewArrowR}
                  alt="review-arrow-right"
                  className="icon-detail"
                />
              </div>
            </button>
          </div>
          <button onClick={handleGoBack} className="go-back-btn rounded-0">
            返回上頁
          </button>
        </div>
        <div></div>
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

      {showTopBtn && (
        <button className="back-to-top" onClick={scrollToTop}>
          <img src={images.topBtn} alt="back to top btn" className="icon" />
        </button>
      )}
      <Footer />
    </>
  );
};

export default ProductDetail;
