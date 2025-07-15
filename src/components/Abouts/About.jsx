import React from 'react';
import aboutBgImg from '../../assets/Images/image7.jpg';
import './About.scss';

const About = ({ title = '關於築豆', subtitle = 'About Beans Atelier' }) => {
  return (
    <section className="about-section">
      <div className="about-bgImg">
        <img src={aboutBgImg} alt="關於築豆背景圖" />
      </div>

      <div className="container text-white text-center">
        <div className="titleWrapper position-relative" style={{ zIndex: 2 }}>
          <h2 className="fw-light custom-underline my-0">{title}</h2>
          <p className="aboutSub ">{subtitle}</p>
        </div>

        <div className="content text-start aboutText rounded-0">
          <p className="aboutText text-start m-0">品牌故事</p>
          <p className="fw-light lh-lg text-start contentText m-0">
            每一顆咖啡豆，都像是一個尚未實現的夢想，等待著被發掘與精心雕琢，成為一杯完整而動人的咖啡。
          </p>

          <p className="fw-light lh-lg text-start m-0">
            「築豆」，就像匠人一樣，用心築出每一杯令人眷戀的咖啡，也為每一位熱愛咖啡的人築夢。
          </p>

          <p className="fw-light lh-lg text-start m-0">
            我們相信，咖啡不僅是一種飲品，更是一種生活的態度。從選豆的每一刻起，我們便開始為每一顆豆子建構它的未來。我們從全球各大產地精選豆源，尊重自然的節奏，根據豆子的品種、產區與處理法，進行最適合的烘焙。無論是醇厚的深焙，還是清爽的淺焙，每一杯都承載著我們對風味的追求與呈現。
          </p>

          <p className="fw-light lh-lg text-start m-0">
            築豆，象徵著我們對咖啡的專注與匠心，就像築夢一樣，細細打磨每一個環節，釋放每顆豆子的潛力。我們相信，一杯用心製作的咖啡，就是一天中最溫柔的片刻，是一個人心靈微小的改變與幸福起點。
          </p>

          <p className="fw-bold aboutEnd text-start text-md-end m-0">
            築豆，為夢想而煮味，為品質而築造。
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
