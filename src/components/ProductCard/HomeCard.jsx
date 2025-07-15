import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import './HomeCard.scss';
import HomeCardLarge from '../../components/ProductCard/HomeCardLarge';
import HomeCardDefault from '../../components/ProductCard/HomeCardDefault';

const HomeCard = ({ product, clickable = false, isLarge = false }) => {
  const isMobile = useIsMobile();

  if (isMobile === null)
    return (
      <div className="card placeholder-glow home-card-loading">
        <div
          className="placeholder col-12 mb-3"
          style={{ height: '180px', backgroundColor: '#eee' }}
        ></div>
        <div className="placeholder col-6 mb-2"></div>
        <div className="placeholder col-4 mb-2"></div>
        <div className="placeholder col-8 mb-3"></div>
        <div className="btn btn-secondary disabled placeholder col-12"></div>
      </div>
    ); // 尚未判斷視窗大小時不渲染
  const useLargeLayout = !isMobile && isLarge;

  return useLargeLayout ? (
    <HomeCardLarge product={product} clickable={clickable} isLarge={isLarge} />
  ) : (
    <HomeCardDefault product={product} clickable={clickable} />
  );
};

export default HomeCard;
