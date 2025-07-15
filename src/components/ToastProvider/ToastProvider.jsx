import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductToast = () => {
  const [position, setPosition] = useState('bottom-right');

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setPosition('top-center');
      } else {
        setPosition('bottom-right');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return (
    <ToastContainer
      key={position}
      position={position}
      autoClose={1000}
      hideProgressBar
      closeButton={false}
      pauseOnHover={false}
      draggable
      theme="colored"
    />
  );
};

export default ProductToast;
