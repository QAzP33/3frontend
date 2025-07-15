import React from 'react';
import bannerImg from '../../assets/Images/banner-image.jpg';
import './Banner.scss';

const HomeBanner = () => {
  return (
    <>
      <div className="col-12 banner">
        <img src={bannerImg} alt="SiteBanner" />
      </div>
      <div className="banner-text homeTitle">
        <h1>築一個屬於你的咖啡故事 </h1>
        <p>「為夢想而品味，為品質而築造。」</p>
      </div>
    </>
  );
};
export default HomeBanner;
