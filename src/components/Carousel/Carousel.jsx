import React from 'react';
import './Carousel.scss';
import img1 from '../../assets/Images/image4.jpg';
import img2 from '../../assets/Images/image5.jpg';
import img3 from '../../assets/Images/image6.jpg';

const Carousel = () => {
  const data = [
    {
      title: '咖啡豆小知識',
      image: img3,
      contents: [
        {
          subtitle: '最佳賞味期限',
          titleText: '建議於烘焙後 14～30 天內飲用，風味最佳。',
          explain:
            '咖啡豆在烘焙後會持續釋放氣體與熟成，風味會隨時間轉變。建議避開剛烘焙完的前一週（除非是偏好高酸調性），而超過兩個月以上的豆子，香氣與風味可能開始遞減。',
        },
        {
          subtitle: '保存新鮮的方法',
          titleText: '避免受潮與氧化，是保存風味的關鍵。',
          explain:
            '建議將咖啡豆密封保存於陰涼乾燥處，避免高溫與濕氣。開封後請儘快使用完畢，並使用密封罐或夾鏈袋加強保鮮效果。',
        },
        {
          subtitle: '遠離危險地帶',
          titleText: '防潮、防曬、防高溫，咖啡豆才能維持好狀態。',
          explain:
            '請避免將咖啡豆存放於陽光直射處、潮濕高溫的環境，像是廚房爐灶旁、浴室、車內等地皆不建議，冰箱冷藏則容易因濕度與異味影響風味。',
        },
      ],
    },
    {
      title: '常見手沖咖啡器具',
      image: img2,
      contents: [
        {
          subtitle: 'V60',
          titleTxt: '（來自日本 Hario）',
          difficulty: 3,
          styles: '注水自由度高，風味層次分明，乾淨明亮',
          suitable: '喜歡細節控制、樂於嘗試不同注水變化，追求清晰風味表現的人',
        },
        {
          subtitle: 'Chemex',
          titleTxt: '（來自美國）',
          difficulty: 3,
          styles: '口感輕盈清爽，極致乾淨，風味純粹',
          suitable: '注重口感清澈、喜歡極簡設計與儀式感的手沖愛好者',
        },
        {
          subtitle: 'Kalita Wave',
          titleTxt: '（來自日本 Kalita）',
          difficulty: 3,
          styles: '萃取穩定、風味均衡，口感厚實有感',
          suitable: '偏好穩定、易上手的手沖方式，喜歡圓潤醇厚風味的人',
        },
      ],
    },
    {
      title: '三大咖啡豆處理法',
      image: img1,
      contents: [
        {
          subtitle: '水洗法 Washed',
          acidity: 3,
          sweetness: 3,
          feature: '花果香、清新、明亮',
        },
        {
          subtitle: '蜜處理法 Honey',
          acidity: 3,
          sweetness: 3,
          feature: '果香、甜感、酒香',
        },
        {
          subtitle: '日曬法 Natural',
          acidity: 3,
          sweetness: 3,
          feature: '果香、酒香、發酵風味',
        },
      ],
    },
  ];

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined m-0 star-icon
         ${i < count ? 'filled' : 'empty'}`}
      >
        star
      </span>
    ));
  };

  return (
    <div
      id="myCarousel"
      className="carousel slide align-content-center"
      data-bs-ride="carousel"
      data-bs-interval="8000"
    >
      {/* 左箭頭 */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </button>

      <div className="carousel-inner">
        {data.map((slide, index) => (
          <div
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
            key={index}
          >
            <div className="container">
              <div className="row">
                <div className="text-center fade-in">
                  <p className="carouselTitle">{slide.title}</p>
                  <img
                    src={slide.image}
                    className="carousel-img"
                    alt={slide.title}
                  />
                  <div className=" mt-3 d-md-flex justify-content-between carouselCard ">
                    {slide.contents.map((text, i) => (
                      <React.Fragment key={i}>
                        <div className="text-start carouselContent position-relative">
                          <div className="carouselSubtitle">
                            <div className="d-flex">
                              <h3 className="fw-bold">{text.subtitle}</h3>
                              <span>{text.titleTxt}</span>
                            </div>
                            <h4>{text.titleText}</h4>
                          </div>
                          <div className="informationText">
                            <p>{text.explain}</p>
                          </div>
                          {text.difficulty && (
                            <div className="informationText">
                              <h4 className="fw-bold">沖煮難度：</h4>
                              <p>{renderStars(text.difficulty)}</p>

                              <h4 className="fw-bold">沖煮風格：</h4>
                              <p>{text.styles}</p>

                              <h4 className="fw-bold">適合對象：</h4>
                              <p>{text.suitable}</p>
                            </div>
                          )}

                          {text.acidity && (
                            <div className="informationText">
                              <h4 className="fw-bold">酸度：</h4>
                              <p>{renderStars(text.acidity)}</p>
                              <h4 className="fw-bold">甜度：</h4>
                              <p>{renderStars(text.sweetness)}</p>
                              <h4 className="fw-bold">香氣特色：</h4>
                              <p>{text.feature}</p>
                            </div>
                          )}
                        </div>
                        {i < slide.contents.length - 1 && (
                          <div className="vertical-divider" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 右箭頭 */}
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </button>

      {/* 圓點指示器 */}
      <div className="carousel-indicators desktop-indicators">
        {data.map((_, idx) => (
          <button
            key={idx}
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to={idx}
            className={idx === 0 ? 'active' : ''}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
