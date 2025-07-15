import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import './HomeCard.scss';
import defultImg from '../../assets/Images/image12.jpg';
import errorImg from '../../assets/Images/image13.jpg';

const HomeCardLarge = ({ product, clickable = false }) => {
  const navigate = useNavigate();
  const { addToCart, addingId } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    id,
    name = '未命名商品',
    price = 0,
    image = defultImg,
    description = '',
    // isFavorite = false,
    origin = [],
    feature = '',
  } = product || {};

  const handleClick = () => {
    if (clickable) {
      navigate(`/products/${id}`);
    }
  };

  const handleClick2 = (e) => {
    e.stopPropagation();
    e.target.blur();
    addToCart(product.id);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    console.log('切換收藏:', product);
    setIsFavorite((prev) => !prev);
  };

  return (
    <div
      className={`card h-100 shadow-sm home-card home-card--large`}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
      onClick={handleClick}
    >
      <div className="row">
        {/* 圖片在左 */}
        <div className="col-md-5 overflow-hidden imgContainer">
          <img
            src={image}
            alt={name}
            className="img-fluid homecardImage"
            onError={(e) => (e.target.src = errorImg)}
          />
        </div>

        {/* 文字在右 */}
        <div className="col-md-7 d-flex flex-column textContainer">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-2 homecardTitle w-75">{name}</h5>
            <button
              className="btn btn-link m-2 p-1 homecard-favorite-btn"
              onClick={toggleFavorite}
            >
              <span
                className={`material-symbols-outlined ${isFavorite ? 'heart-filled' : 'heart-outlined'}`}
              >
                favorite
              </span>
            </button>
          </div>

          {origin.length > 0 && (
            <div className="mb-1">
              {origin.map((origin, index) => (
                <span
                  key={index}
                  className="d-block d-inline-flex align-items-center"
                >
                  <i className="material-symbols-outlined me-1 text-coffee-primary-800 fw-bolder">
                    location_on
                  </i>
                  <small className="fs-3 text-coffee-primary-800 fw-bolder">
                    產地 -{' '}
                  </small>
                  <small className="fs-4 text-coffee-primary-800">
                    {origin}
                  </small>
                </span>
              ))}
            </div>
          )}

          {feature && (
            <div className="mb-3 d-inline-flex align-items-center">
              <i className="material-symbols-outlined me-1 fw-bolder text-coffee-primary-800">
                spa
              </i>
              <small className="fs-3 text-coffee-primary-800 fw-bolder">
                風味 -{' '}
              </small>
              <small className="fs-4 text-coffee-primary-800">{feature}</small>
            </div>
          )}

          {description && (
            <p className="card-text  homecardText flex-grow-1 text-coffee-grey-600">
              {description}
              {/* {description.length > 56
                ? `${description.substring(0, 56)}...`
                : description} */}
            </p>
          )}

          <div className="mt-auto">
            <p className="homecardPrice">
              NT$
              {typeof price === 'number' ? price.toLocaleString() : price}
            </p>

            <button
              className="btn w-100 homecartBtn"
              onClick={handleClick2}
              disabled={addingId === product.id}
            >
              {addingId === product.id ? '加入中…' : '加入購物車'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCardLarge;
