import React from 'react';
import bannerImg from '../../assets/Images/banner-image.jpg'; // 檔案位置路徑
import './Banner.scss';

const Banner = () => {
  return (
    <div className="row banner">
      <img src={bannerImg} alt="SiteBanner" />
    </div>
  );
};

export default Banner;
