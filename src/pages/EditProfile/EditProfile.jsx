import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import MemberSidebar from '../../components/MemberSidebar/MemberSidebar';
import Footer from '../../components/Footer/Footer';

const EditProfile = () => {
  const [userData, setUserData] = useState({
    userName: '',
    userGender: '',
    userBirth: null,
    userPhone: '',
    userAddress: '',
  });

  const [formValidated, setFormValidated] = useState(false);
  const [fieldErr, setFieldErr] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState('');
  const [modalType, setModalType] = useState('');

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = yesterday.toISOString().split('T')[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldErr((prevErr) => ({
      ...prevErr,
      [name]: '',
    }));
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    if (modalType === 'toLogin') {
      navigate('/login');
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const route = `${apiUrl}/api/v1/users/membership/profile`;

  useEffect(() => {
    if (userData.userBirth && typeof userData.userBirth === 'string') {
      setUserData((prev) => ({
        ...prev,
        userBirth: new Date(prev.userBirth),
      }));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(route, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data?.data?.user;
        setUserData({
          userName: data.name || '',
          userGender: data.gender || '',
          userBirth: data.birth_date ? new Date(data.birth_date) : null,
          userPhone: data.phone || '',
          userAddress: data.address || '',
        });
      })
      .catch(() => {
        setModalTitle('錯誤訊息');
        setModalMsg('伺服器錯誤');
        setModalType('toLogin');
        setIsOpen(true);
      });
  }, [navigate]);

  const editHandler = (e) => {
    e.preventDefault();
    let isError = false;
    const token = localStorage.getItem('token');

    // 姓名
    const namePattern = /^[\p{L}\p{N}]{2,10}$/u;
    if (userData.userName.trim() === '') {
      setFieldErr((prev) => ({
        ...prev,
        userName: '該欄位為必填欄位',
      }));
      setFormValidated(true);
      isError = true;
    } else if (!namePattern.test(userData.userName)) {
      setFieldErr((prev) => ({
        ...prev,
        userName: '姓名格式錯誤，請輸入 2 至 10 字元的姓名',
      }));
      setFormValidated(true);
      isError = true;
    }

    // 性別
    if (!userData.userGender) {
      setFieldErr((prev) => ({
        ...prev,
        userGender: '請選擇性別',
      }));
      setFormValidated(true);
      isError = true;
    }

    // 生日
    const isValidDateObject = (date) => {
      return date instanceof Date && !isNaN(date.getTime());
    };

    if (!userData.userBirth) {
      setFieldErr((prev) => ({
        ...prev,
        userBirth: '該欄位為必填欄位',
      }));
      setFormValidated(true);
      isError = true;
    } else if (!isValidDateObject(userData.userBirth)) {
      setFieldErr((prev) => ({
        ...prev,
        userBirth: '生日格式錯誤，請重新選擇日期',
      }));
      setFormValidated(true);
      isError = true;
    }

    // 手機
    const phoneRegex = /^09\d{8}$/;
    if (userData.userPhone.trim() === '') {
      setFieldErr((prev) => ({
        ...prev,
        userPhone: '該欄位為必填欄位',
      }));
      setFormValidated(true);
      isError = true;
    } else if (!phoneRegex.test(userData.userPhone)) {
      setFieldErr((prev) => ({
        ...prev,
        userPhone: '手機號碼不符合台灣格式',
      }));
      setFormValidated(true);
      isError = true;
    }

    // 地址
    const taiwanAreas = {
      台北市: [
        '中正區',
        '大同區',
        '中山區',
        '松山區',
        '大安區',
        '萬華區',
        '信義區',
        '士林區',
        '北投區',
        '內湖區',
        '南港區',
        '文山區',
      ],
      新北市: [
        '板橋區',
        '三重區',
        '中和區',
        '永和區',
        '新莊區',
        '新店區',
        '樹林區',
        '鶯歌區',
        '三峽區',
        '淡水區',
        '汐止區',
        '瑞芳區',
        '土城區',
        '蘆洲區',
        '五股區',
        '泰山區',
        '林口區',
        '深坑區',
        '石碇區',
        '坪林區',
        '三芝區',
        '石門區',
        '八里區',
        '平溪區',
        '雙溪區',
        '貢寮區',
        '金山區',
        '萬里區',
        '烏來區',
      ],
      桃園市: [
        '桃園區',
        '中壢區',
        '平鎮區',
        '八德區',
        '楊梅區',
        '蘆竹區',
        '大溪區',
        '龍潭區',
        '龜山區',
        '大園區',
        '觀音區',
        '新屋區',
        '復興區',
      ],
      台中市: [
        '中區',
        '東區',
        '南區',
        '西區',
        '北區',
        '北屯區',
        '西屯區',
        '南屯區',
        '太平區',
        '大里區',
        '霧峰區',
        '烏日區',
        '豐原區',
        '后里區',
        '石岡區',
        '東勢區',
        '和平區',
        '新社區',
        '潭子區',
        '大雅區',
        '神岡區',
        '大肚區',
        '沙鹿區',
        '龍井區',
        '梧棲區',
        '清水區',
        '大甲區',
        '外埔區',
        '大安區',
      ],
      台南市: [
        '中西區',
        '東區',
        '南區',
        '北區',
        '安平區',
        '安南區',
        '永康區',
        '歸仁區',
        '新化區',
        '左鎮區',
        '玉井區',
        '楠西區',
        '南化區',
        '仁德區',
        '關廟區',
        '龍崎區',
        '官田區',
        '麻豆區',
        '佳里區',
        '西港區',
        '七股區',
        '將軍區',
        '學甲區',
        '北門區',
        '新營區',
        '後壁區',
        '白河區',
        '東山區',
        '六甲區',
        '下營區',
        '柳營區',
        '鹽水區',
        '善化區',
        '大內區',
        '山上區',
        '新市區',
        '安定區',
      ],
      高雄市: [
        '新興區',
        '前金區',
        '苓雅區',
        '鹽埕區',
        '鼓山區',
        '旗津區',
        '前鎮區',
        '三民區',
        '楠梓區',
        '小港區',
        '左營區',
        '仁武區',
        '大社區',
        '岡山區',
        '路竹區',
        '阿蓮區',
        '田寮區',
        '燕巢區',
        '橋頭區',
        '梓官區',
        '彌陀區',
        '永安區',
        '湖內區',
        '鳳山區',
        '大寮區',
        '林園區',
        '鳥松區',
        '大樹區',
        '旗山區',
        '美濃區',
        '六龜區',
        '內門區',
        '杉林區',
        '甲仙區',
        '桃源區',
        '那瑪夏區',
        '茂林區',
      ],
      基隆市: [
        '仁愛區',
        '信義區',
        '中正區',
        '中山區',
        '安樂區',
        '暖暖區',
        '七堵區',
      ],
      新竹市: ['東區', '北區', '香山區'],
      嘉義市: ['東區', '西區'],
      新竹縣: [
        '竹北市',
        '竹東鎮',
        '新埔鎮',
        '關西鎮',
        '湖口鄉',
        '新豐鄉',
        '芎林鄉',
        '橫山鄉',
        '北埔鄉',
        '寶山鄉',
        '峨眉鄉',
        '尖石鄉',
        '五峰鄉',
      ],
      苗栗縣: [
        '苗栗市',
        '頭份市',
        '苑裡鎮',
        '通霄鎮',
        '竹南鎮',
        '後龍鎮',
        '卓蘭鎮',
        '大湖鄉',
        '公館鄉',
        '銅鑼鄉',
        '南庄鄉',
        '頭屋鄉',
        '三義鄉',
        '西湖鄉',
        '造橋鄉',
        '三灣鄉',
        '獅潭鄉',
        '泰安鄉',
      ],
      彰化縣: [
        '彰化市',
        '員林市',
        '和美鎮',
        '鹿港鎮',
        '溪湖鎮',
        '二林鎮',
        '田中鎮',
        '北斗鎮',
        '花壇鄉',
        '芬園鄉',
        '大村鄉',
        '永靖鄉',
        '伸港鄉',
        '線西鄉',
        '福興鄉',
        '秀水鄉',
        '埔心鄉',
        '埔鹽鄉',
        '大城鄉',
        '芳苑鄉',
        '竹塘鄉',
        '溪州鄉',
        '社頭鄉',
        '二水鄉',
        '田尾鄉',
        '埤頭鄉',
      ],
      南投縣: [
        '南投市',
        '埔里鎮',
        '草屯鎮',
        '竹山鎮',
        '集集鎮',
        '名間鄉',
        '鹿谷鄉',
        '中寮鄉',
        '魚池鄉',
        '國姓鄉',
        '水里鄉',
        '信義鄉',
        '仁愛鄉',
      ],
      雲林縣: [
        '斗六市',
        '斗南鎮',
        '虎尾鎮',
        '西螺鎮',
        '土庫鎮',
        '北港鎮',
        '古坑鄉',
        '大埤鄉',
        '莿桐鄉',
        '林內鄉',
        '二崙鄉',
        '崙背鄉',
        '麥寮鄉',
        '東勢鄉',
        '褒忠鄉',
        '臺西鄉',
        '元長鄉',
        '四湖鄉',
        '口湖鄉',
        '水林鄉',
      ],
      嘉義縣: [
        '太保市',
        '朴子市',
        '布袋鎮',
        '大林鎮',
        '民雄鄉',
        '溪口鄉',
        '新港鄉',
        '六腳鄉',
        '東石鄉',
        '義竹鄉',
        '鹿草鄉',
        '水上鄉',
        '中埔鄉',
        '竹崎鄉',
        '梅山鄉',
        '番路鄉',
        '大埔鄉',
        '阿里山鄉',
      ],
      屏東縣: [
        '屏東市',
        '潮州鎮',
        '東港鎮',
        '恆春鎮',
        '萬丹鄉',
        '長治鄉',
        '麟洛鄉',
        '九如鄉',
        '里港鄉',
        '鹽埔鄉',
        '高樹鄉',
        '萬巒鄉',
        '內埔鄉',
        '竹田鄉',
        '新埤鄉',
        '枋寮鄉',
        '新園鄉',
        '崁頂鄉',
        '林邊鄉',
        '南州鄉',
        '佳冬鄉',
        '琉球鄉',
        '車城鄉',
        '滿州鄉',
        '枋山鄉',
        '三地門鄉',
        '霧臺鄉',
        '瑪家鄉',
        '泰武鄉',
        '來義鄉',
        '春日鄉',
        '獅子鄉',
        '牡丹鄉',
      ],
      宜蘭縣: [
        '宜蘭市',
        '羅東鎮',
        '蘇澳鎮',
        '頭城鎮',
        '礁溪鄉',
        '壯圍鄉',
        '員山鄉',
        '冬山鄉',
        '五結鄉',
        '三星鄉',
        '大同鄉',
        '南澳鄉',
      ],
      花蓮縣: [
        '花蓮市',
        '鳳林鎮',
        '玉里鎮',
        '新城鄉',
        '吉安鄉',
        '壽豐鄉',
        '光復鄉',
        '豐濱鄉',
        '瑞穗鄉',
        '富里鄉',
        '秀林鄉',
        '萬榮鄉',
        '卓溪鄉',
      ],
      台東縣: [
        '台東市',
        '成功鎮',
        '關山鎮',
        '卑南鄉',
        '大武鄉',
        '太麻里鄉',
        '東河鄉',
        '長濱鄉',
        '鹿野鄉',
        '池上鄉',
        '綠島鄉',
        '延平鄉',
        '海端鄉',
        '達仁鄉',
        '金峰鄉',
        '蘭嶼鄉',
      ],
      澎湖縣: ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'],
      金門縣: ['金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'],
      連江縣: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'],
    };

    const isValidTaiwanAddress = (address) => {
      for (const [city, districts] of Object.entries(taiwanAreas)) {
        if (address.startsWith(city)) {
          const district = address.slice(city.length, city.length + 3);
          return districts.includes(district);
        }
      }
      return false;
    };

    if (
      userData.userAddress.trim() !== '' &&
      !isValidTaiwanAddress(userData.userAddress)
    ) {
      setFieldErr((prev) => ({
        ...prev,
        userAddress: '地址無效，請重新輸入有效的台灣地址',
      }));
      setFormValidated(true);
      isError = true;
    }

    if (isError === true) {
      return;
    }

    axios
      .put(
        route,
        {
          name: userData.userName,
          gender: userData.userGender,
          birth_date: userData.userBirth.toISOString().split('T')[0],
          phone: userData.userPhone,
          address: userData.userAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        setModalTitle('更新通知');
        setModalMsg('會員資料更新成功！');
        setIsOpen(true);
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || '更新失敗';
        const errStatus = err.status;
        if (errStatus === 400) {
          switch (errMsg) {
            case '姓名格式錯誤':
              setFieldErr((prev) => ({
                ...prev,
                userName: errMsg,
              }));
              break;

            case '性別格式錯誤':
              setFieldErr((prev) => ({
                ...prev,
                userGender: errMsg,
              }));
              break;

            case '生日格式錯誤':
              setFieldErr((prev) => ({
                ...prev,
                userBirth: errMsg,
              }));
              break;

            case '手機號碼不符合規則，需為台灣手機號碼':
              setFieldErr((prev) => ({
                ...prev,
                userPhone: errMsg,
              }));
              break;

            case '地址格式錯誤，需為台灣地址':
              setFieldErr((prev) => ({
                ...prev,
                userAddress: errMsg,
              }));
              break;

            case '使用者資料未變更':
              setModalTitle('更新通知');
              setModalMsg(errMsg || '更新失敗');
              setModalType('noChange');
              setIsOpen(true);
              break;
          }
        } else if (errStatus === 401) {
          setModalTitle('載入失敗');
          setModalMsg('請先重新登入！');
          setModalType('toLogin');
          setIsOpen(true);
          return;
        } else {
          setModalTitle('更新通知');
          setModalMsg(errMsg || '更新失敗');
          setModalType('noChange');
          setIsOpen(true);
        }
      });
  };

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <MemberSidebar>
            <div className="container sidebar-container-custom w-100">
              <h4 className="content-title m-0">個人資訊</h4>
              <form className="form-custom" noValidate onSubmit={editHandler}>
                <div className="form-input-custom">
                  <label
                    htmlFor="memberName"
                    className="form-label form-label-custom text-coffee-primary-600"
                  >
                    姓名*
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-custom rounded-0 ${
                      (formValidated && userData.userName.trim() === '') ||
                      fieldErr.userName
                        ? 'is-invalid'
                        : ''
                    }`}
                    id="memberName"
                    name="userName"
                    placeholder="請輸入正確姓名"
                    value={userData.userName}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    {userData.userName.trim() === ''
                      ? '該欄位為必填欄位'
                      : fieldErr.userName}{' '}
                  </div>
                </div>
                <div className="form-input-custom">
                  <label
                    htmlFor="gender"
                    className="form-label form-label-custom text-coffee-primary-600"
                  >
                    性別
                  </label>
                  <select
                    id="gender"
                    name="userGender"
                    className="form-select form-control-custom w-100 rounded-0"
                    value={userData.userGender}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      請選擇性別
                    </option>
                    <option value="不願透露">不願透露</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                  <div className="invalid-feedback">{fieldErr.userGender}</div>
                </div>
                <div className="form-input-custom">
                  <label
                    htmlFor="birth"
                    className="form-label form-label-custom text-coffee-primary-600"
                  >
                    生日*
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="userBirth"
                    ref={inputRef}
                    className={`form-control form-control-custom rounded-0 ${formValidated && fieldErr.userBirth ? 'is-invalid' : ''}`}
                    value={
                      userData.userBirth
                        ? userData.userBirth.toISOString().split('T')[0]
                        : ''
                    }
                    onClick={() =>
                      inputRef.current?.showPicker?.() ||
                      inputRef.current?.focus()
                    }
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      setUserData((prev) => ({
                        ...prev,
                        userBirth: dateValue ? new Date(dateValue) : null,
                      }));
                      setFieldErr((prev) => ({
                        ...prev,
                        userBirth: '',
                      }));
                    }}
                    max={formattedYesterday}
                    required
                  />
                  <div className="invalid-feedback">
                    {fieldErr.userBirth ||
                      (formValidated && !userData.userBirth && '請選擇生日')}
                  </div>
                </div>
                <div className="form-input-custom">
                  <label
                    htmlFor="memberTel"
                    className="form-label form-label-custom text-coffee-primary-600"
                  >
                    手機號碼*
                  </label>
                  <input
                    type="tel"
                    className={`form-control form-control-custom rounded-0 ${
                      (formValidated && userData.userPhone.trim() === '') ||
                      fieldErr.userPhone
                        ? 'is-invalid'
                        : ''
                    }`}
                    id="memberTel"
                    name="userPhone"
                    placeholder="請輸入手機號碼"
                    maxLength="10"
                    pattern="\d*"
                    value={userData.userPhone}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="invalid-feedback">
                    {userData.userPhone.trim() === ''
                      ? '該欄位為必填欄位'
                      : fieldErr.userPhone}
                  </div>
                </div>
                <div className="form-input-custom">
                  <label
                    htmlFor="memberAddress"
                    className="form-label form-label-custom text-coffee-primary-600"
                  >
                    通訊地址
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-custom rounded-0 ${
                      fieldErr.userAddress ? 'is-invalid' : ''
                    }`}
                    id="memberAddress"
                    name="userAddress"
                    placeholder="請輸入正確地址"
                    value={userData.userAddress}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{fieldErr.userAddress}</div>
                </div>
                <p className="d-flex justify-content-end btn-cta-text m-0">
                  * 為必填選項
                </p>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-style rounded-0">
                    變更資料
                  </button>
                </div>
              </form>
            </div>
          </MemberSidebar>
        </div>

        {/* Modal */}
        {isOpen && (
          <div
            className="modal show fade d-block custom-modal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog custom-modal-dialog">
              <div className="modal-content custom-modal-content">
                <div className="modal-header custom-modal-header">
                  <h5 className="custom-modal-title">{modalTitle}</h5>
                  <button
                    type="button"
                    className="custom-modal-close"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body custom-modal-body">{modalMsg}</div>
                <div className="modal-footer custom-modal-footer">
                  <button
                    type="button"
                    className="custom-modal-btn"
                    onClick={handleCloseModal}
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default EditProfile;
