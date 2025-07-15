import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import '../../pages/Home/Home.scss';
import Footer from '../../components/Footer/Footer';
import HomeBanner from '../../components/Banner/HomeBanner';
import About from '../../components/Abouts/About';
import Carousel from '../../components/Carousel/Carousel';
import HomeCard from '../../components/ProductCard/HomeCard';
import { images } from '../../constants/image';
import { HomeImg } from '../../constants/HomeImg';

const Home = () => {
  const navigate = useNavigate();
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [equipmentProducts, setEquipmentProducts] = useState([]);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const hotRoute = `${apiUrl}/api/v1/products/bestSeller`;
  const equipmentRoute = `${apiUrl}/api/v1/products/extras`;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // top 按鈕
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //取得熱門商品
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(hotRoute);

        if (response.status === 200 && response.data.data) {
          const apiData = response.data.data.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image_url,
            origin: [item.origin],
            feature: item.feature,
            description: item.description,
          }));

          setBestSellerProducts(apiData);
        }
      } catch (error) {
        console.error('取得熱門商品失敗:', error);
        console.log('hotRoute:', hotRoute);
      }
    };

    fetchBestSellers();
  }, []); // 空陣列代表只在首次渲染時執行一次

  //取得咖啡用具及其他
  useEffect(() => {
    const fetchEquipmentProducts = async () => {
      try {
        const response = await axios.get(equipmentRoute);

        if (response.status === 200 && response.data.data) {
          const apiData = response.data.data.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image_url,
            description: item.description,
          }));

          setEquipmentProducts(apiData);
        }
      } catch (error) {
        console.error('取得相關用品及其他商品失敗:', error);
        console.log('equipmentRoute:', equipmentRoute);
      }
    };

    fetchEquipmentProducts();
  }, []); // 空陣列代表只在首次渲染時執行一次

  return (
    <>
      <Header />

      <div className="banner-container p-0 ">
        <HomeBanner />
      </div>

      {/* 熱賣商品區塊 */}
      {bestSellerProducts.length > 0 && (
        <section
          className="bestSellerSection"
          style={{ backgroundColor: '#FFF7F7' }}
        >
          <div className="container p-md-0">
            <div className="text-center cardTitle">
              <h1 className="m-0">熱賣商品</h1>
              <hr className="cardLine mx-auto my-0" />
              <p className="cardEngTitle my-0">Best seller</p>
            </div>

            <HomeCard
              product={bestSellerProducts[0]}
              clickable
              isLarge={true}
            />

            <div className="bestSellerCardList">
              {bestSellerProducts.slice(1).map((product) => (
                <div key={product.id} className={`bestseller-card`}>
                  <HomeCard product={product} clickable />
                </div>
              ))}
            </div>

            {/* 查看更多按鈕 */}
            <button
              className="btn btn-outline-coffee-primary-400 btn-lg text-coffee-primary-600 rounded-0 moreBtn d-block mx-auto"
              onClick={() => navigate('/products')}
            >
              瀏覽更多
            </button>
          </div>
        </section>
      )}

      {/* 輪播圖 */}
      <div>
        <Carousel autoPlay={true} interval={15000} />
      </div>

      {/* 咖啡用品區 */}
      {equipmentProducts.length > 0 && (
        <section
          className="equipmentSection"
          style={{ backgroundColor: '#FFF7F7' }}
        >
          <div className="container p-md-0">
            <div className="text-center cardTitle">
              <h1 className="m-0">相關用品及其他</h1>
              <hr className="cardLine mx-auto my-0" />
              <p className="cardEngTitle my-0">Related Equipment & Extras</p>
            </div>
            <div className="equipmentCardList">
              {equipmentProducts.map((product) => (
                <div key={product.id}>
                  <HomeCard product={product} clickable />
                </div>
              ))}
            </div>

            {/* 手機版：橫向滑動 */}
            <div className="equipmentCard-scroll">
              {equipmentProducts.map((product) => (
                <div
                  key={product.id}
                  className="equipmentCard equipmentCard-mobile m-0"
                >
                  <HomeCard product={product} clickable />
                </div>
              ))}
            </div>

            {/* 查看更多按鈕 */}

            <button
              className="btn btn-outline-coffee-primary-400 btn-lg text-coffee-primary-600 rounded-0 moreBtn d-block mx-auto"
              onClick={() => navigate('/products')}
            >
              瀏覽更多
            </button>
          </div>
        </section>
      )}

      {/* 賽事認證 */}
      <section
        className="certificationSection "
        style={{ backgroundColor: '#f8f6f3' }}
      >
        <div className="container p-md-0">
          <div className="text-center certificationTitle">
            <h1 className="m-0 fw-bold ">榮獲國內外賽事及評鑒的得獎咖啡豆</h1>
          </div>

          {/* logo */}
          <div className=" d-flex desk-certification">
            {HomeImg.logos.map((logo, index) => (
              <div key={index} className="desk-certificationLogo">
                <img src={logo} alt={`logo-${index}`} className="img-fluid" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <About />

      {showTopBtn && (
        <button className="back-to-top" onClick={scrollToTop}>
          <img src={images.topBtn} alt="back to top btn" />
        </button>
      )}
      <Footer />
    </>
  );
};

export default Home;
