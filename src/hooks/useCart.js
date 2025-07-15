import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const useCart = () => {
  const [addingId, setAddingId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;


  const addToCart = async (productId, quantity = 1, onNotLogin) => {
    if (addingId) return;
    setAddingId(productId);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        if (onNotLogin) {
          onNotLogin(); // 提醒登入
        } else {
          toast.warning('請先登入會員');
        }
        return;
      }

      await axios.post(
        `${apiUrl}/api/v1/users/membership/cart`,
        { product_id: productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('已加入購物車', {
        autoClose: 1000,
        className: 'product-toast-success',
        bodyClassName: 'product-toast-success-body',
      });
    
      
    } catch (err) {
      const msg = err.response?.data?.message || '加入失敗，請稍後再試';
      toast.error(msg, {
        autoClose: 2000,
        className: 'product-toast-error',
        bodyClassName: 'product-toast-error-body',
      });
    } finally {
      setTimeout(() => setAddingId(null), 500);
    }
  };

  return { addToCart, addingId };
};

export default useCart;
