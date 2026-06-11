import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Wine, Cake, MessageSquare, Gift, Heart, Smile, Send, Check, X } from 'lucide-react';

// 自定义图标组件，用于模拟图片中的手绘风格图标
const CustomIcon = ({ icon: Icon, color = "currentColor", size = 24 }) => (
  <Icon color={color} size={size} strokeWidth={1.5} />
);

// 首页组件
const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center p-6 text-center font-serif text-[#5c4b51] bg-[#fcf3e1]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")', backgroundSize: 'cover' }}>
      {/* 顶部装饰 */}
      <div className="mb-4">
        <CustomIcon icon={Gift} color="#89a9c9" size={64} />
      </div>
      <h1 className="text-4xl font-cursive text-[#89a9c9] mb-2" style={{ fontFamily: '"Dancing Script", cursive' }}>Save The Date</h1>
      <h2 className="text-3xl font-cursive text-[#89a9c9] mb-6" style={{ fontFamily: '"Dancing Script", cursive' }}>Whimsy Feast</h2>

      {/* 照片区 */}
      <div className="relative mb-8 p-2 bg-white shadow-md rounded-sm transform rotate-[-2deg]">
        <div className="w-64 h-80 bg-gray-200 flex items-center justify-center text-gray-400">
          {/* 替换为新人照片 */}
          <img src="https://placehold.co/400x500?text=新人照片" alt="新人照片" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 邀请文字 */}
      <p className="text-lg mb-2">诚挚的邀请</p>
      <p className="text-lg mb-4">您来见证我们的重要时刻</p>
      <p className="text-2xl font-bold mb-8">张志明 & 余春娇</p>

      {/* 底部插图 */}
      <div className="mb-8">
        <CustomIcon icon={Cake} color="#a8cba8" size={48} />
        <p className="text-sm mt-2 text-[#a8cba8]">甜蜜的盛宴</p>
      </div>

      {/* 时间地点 */}
      <div className="w-full max-w-md text-left bg-white bg-opacity-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
          <CustomIcon icon={Calendar} color="#a8cba8" size={24} />
          <div className="ml-4">
            <p className="text-sm font-bold">婚礼时间 TIME</p>
            <p className="text-base">2025年12月28日</p>
            <p className="text-sm text-gray-600">乙巳年十一月廿六 周四</p>
          </div>
        </div>
        <div className="flex items-center">
          <CustomIcon icon={MapPin} color="#a8cba8" size={24} />
          <div className="ml-4">
            <p className="text-sm font-bold">婚礼地点 ADDRESS</p>
            <p className="text-base">广州瑰丽酒店·宴会厅</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 日程页组件
const SchedulePage = () => {
  return (
    <div className="relative flex flex-col items-center p-6 text-center font-serif text-[#5c4b51] bg-[#fcf3e1]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")', backgroundSize: 'cover' }}>
      {/* 顶部插图 */}
      <div className="mb-8">
        <CustomIcon icon={Wine} color="#d9a7c7" size={48} />
      </div>

      {/* 时间表 */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between py-2 border-b border-[#d9a7c7] border-dashed">
          <div className="flex items-center">
            <CustomIcon icon={Wine} color="#d9a7c7" size={24} />
            <span className="ml-4 text-lg">迎宾互动</span>
          </div>
          <span className="text-lg font-bold">17:00</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-[#d9a7c7] border-dashed">
          <div className="flex items-center">
            <CustomIcon icon={Heart} color="#d9a7c7" size={24} />
            <span className="ml-4 text-lg">婚礼仪式</span>
          </div>
          <span className="text-lg font-bold">18:18</span>
        </div>
      </div>

      {/* 提示信息 */}
      <p className="text-base mb-8">
        (仪式前我们准备了甜品区互动游戏打卡区)
        <br />
        希望您可以尽情参与 玩得开心
      </p>

      {/* 中部插图 */}
      <div className="mb-8">
        <CustomIcon icon={Smile} color="#a8cba8" size={64} />
      </div>

      {/* 诗句 */}
      <p className="text-lg font-bold mb-2">阳光之外,亲吻之外,原野的香气之外</p>
      <p className="text-lg font-bold mb-4">一切对我们来说都微不足道</p>
      <p className="text-sm italic text-[#a8cba8]">
        Beyond the sun, kisses, and the scent of fields
        <br />
        everything else seems insignificant to us
      </p>

      {/* 底部插图 */}
      <div className="mt-8">
        <CustomIcon icon={Wine} color="#d9a7c7" size={64} />
      </div>
    </div>
  );
};

// 回执页组件
const RSVPPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    attending: 'yes',
    guests: 1,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="relative flex flex-col items-center p-6 text-center font-serif text-[#5c4b51] bg-[#fcf3e1]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")', backgroundSize: 'cover' }}>
      {/* 顶部插图 */}
      <div className="mb-8">
        <CustomIcon icon={Heart} color="#d9a7c7" size={48} />
      </div>

      {/* 承诺文字 */}
      <p className="text-base mb-2">就像小王子对他的玫瑰</p>
      <p className="text-base mb-2">我们也因时间与爱浇灌彼此</p>
      <p className="text-base mb-2">让这一天成为最特别的时刻</p>
      <p className="text-base mb-2">这不仅仅是一场婚礼</p>
      <p className="text-base mb-2">更是我们的承诺</p>
      <p className="text-base mb-2">期待您与我们共同见证</p>
      <p className="text-base mb-8">珍藏这份意义非凡的回忆</p>

      {/* 中部插图 */}
      <div className="mb-8">
        <CustomIcon icon={Gift} color="#89a9c9" size={64} />
      </div>

      {/* 期待相见 */}
      <p className="text-xl font-bold mb-8">期待 · 婚礼相见！</p>

      {/* 回执表单 */}
      <div className="w-full max-w-md bg-white bg-opacity-50 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <CustomIcon icon={MessageSquare} color="#d9a7c7" size={32} />
          <h3 className="text-2xl font-bold ml-2">宾客回执</h3>
        </div>
        <p className="text-sm mb-6">请填写宾客信息<br />Please fill in guest information</p>

        {submitted ? (
          <div className="text-center">
            <CustomIcon icon={Check} color="#a8cba8" size={64} className="mx-auto mb-4" />
            <p className="text-xl font-bold">提交成功！</p>
            <p className="text-base">感谢您的回复，期待您的到来！</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-left">
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                1. 姓名* <span className="text-xs font-normal">Your full name</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#d9a7c7]"
                required
              />
            </div>

            <div className="mb-4 text-left">
              <label className="block text-sm font-bold mb-2">
                2. 您是否有空参加我们的婚礼？* <span className="text-xs font-normal">Are you available to attend our wedding?</span>
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === 'yes'}
                    onChange={handleChange}
                    className="form-radio text-[#d9a7c7] focus:ring-[#d9a7c7]"
                  />
                  <span className="ml-2">是 Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={handleChange}
                    className="form-radio text-[#d9a7c7] focus:ring-[#d9a7c7]"
                  />
                  <span className="ml-2">否 No</span>
                </label>
              </div>
            </div>

            <div className="mb-4 text-left">
              <label htmlFor="guests" className="block text-sm font-bold mb-2">
                3. 出席人数* <span className="text-xs font-normal">Attendance</span>
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#d9a7c7]"
                required
              />
            </div>

            <div className="mb-6 text-left">
              <label htmlFor="message" className="block text-sm font-bold mb-2">
                4. 欢迎留言* <span className="text-xs font-normal">Message blessings</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#d9a7c7]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2b9eb3] text-white font-bold py-2 px-4 rounded-md hover:bg-[#238a9d] transition duration-300 flex items-center justify-center"
            >
              <CustomIcon icon={Send} color="white" size={20} className="mr-2" />
              提交 submit
            </button>
          </form>
        )}
      </div>

      {/* 底部感谢 */}
      <div className="mt-8">
        <h3 className="text-3xl font-cursive text-[#c94c4c]" style={{ fontFamily: '"Dancing Script", cursive' }}>thank you</h3>
      </div>
    </div>
  );
};

// 主应用组件
const App = () => {
  return (
    <div className="w-full max-w-md mx-auto overflow-hidden">
      {/* 引入 Google Fonts 用于艺术字 */}
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />
      
      <HomePage />
      <SchedulePage />
      <RSVPPage />
    </div>
  );
};

export default App;