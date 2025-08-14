import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../store/authSlice';

export const useGoogleAuth = ({
  apiUrl,
  setModalMsg,
  setIsOpen,
  failureMsg = 'Google 驗證失敗',
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        const access_token = tokenResponse.access_token;

        const res = await axios.post(`${apiUrl}/api/v1/users/google-login`, {
          credential: access_token,
        });

        const token = res.data.data.token;
        const name = res.data.data.user.name;
        const role = res.data.data.user.role;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', name);

        dispatch(setCredentials({ token, role, username: name }));
        navigate('/member/profile');
      } catch (err) {
        const msg = err.response?.data?.message || failureMsg;
        setModalMsg(msg);
        setIsOpen(true);
      }
    },
    onError: () => {
      setModalMsg(failureMsg);
      setIsOpen(true);
    },
  });
};

export default useGoogleAuth;
