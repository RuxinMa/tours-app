import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import type { Booking } from '../../types/booking';
import { mockBookings } from '../../dev-data/mockBookings';
import { FormTitle } from '../layout/SettingsForm';
import Button from '../common/Button';

const ProfileBookings = () => {
  const navigate = useNavigate();
  const [bookings] = useState<Booking[]>(mockBookings);

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Planned';
      case 'pending-review': return 'Add Review';
      case 'reviewed': return 'Reviewed';
      default: return status;
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-500 hover:bg-blue-600';
      case 'pending-review': return 'bg-orange-500 hover:bg-orange-600';
      case 'reviewed': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  // 处理按钮点击
  const handleButtonClick = (booking: Booking) => {
    switch (booking.status) {
      case 'planned':
        navigate(`/tours/${booking.tour.id}`);
        break;
      case 'pending-review':
        // TODO: 打开评价弹窗
        console.log('Open review modal for:', booking.id);
        break;
      case 'reviewed':
        // TODO: 跳转到 my reviews，可能需要高亮对应评价
        console.log('Navigate to my reviews');
        break;
    }
  };

  // 处理卡片点击
  const handleCardClick = (tourId: string) => {
    navigate(`/tours/${tourId}`);
  };

  return (
    <div className="p-6">
      <FormTitle title="My Bookings" icon={<FiCalendar />} /> 
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiCalendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start exploring our amazing tours!</p>
          <Button
            onClick={() => navigate('/tours')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Tours
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick(booking.tour.id)}
            >
              <div className="flex flex-col md:flex-row">
                {/* 左侧图片 */}
                <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                  <img
                    src={booking.tour.imageCover}
                    alt={booking.tour.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 右侧内容 */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {booking.tour.name}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" />
                          <span>
                            {new Date(booking.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <FiMapPin className="mr-2" />
                          <span>{booking.tour.startLocation.description}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="mr-2">🕒</span>
                          <span>{booking.tour.duration} days</span>
                        </div>
                      </div>

                      <div className="text-lg font-bold text-green-600">
                        ${booking.price}
                      </div>
                    </div>

                    {/* 右侧按钮 */}
                    <div className="ml-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止卡片点击事件
                          handleButtonClick(booking);
                        }}
                        className={`${getStatusStyle(booking.status)} text-white px-4 py-2 rounded-lg text-sm`}
                      >
                        {getStatusText(booking.status)}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileBookings;