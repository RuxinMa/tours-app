// src/components/ToursTest.tsx
import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { useToursSync } from '../../hooks/useToursSync';
import type { Difficulty } from '../../types/tour.types';

export const ToursTest: React.FC = () => {
  const { tours, isLoading, error, pagination, filters } = useAppSelector(state => ({
    tours: state.tours.data.tours,
    isLoading: state.tours.ui.isLoading,
    error: state.tours.ui.error,
    pagination: state.tours.data.pagination,
    filters: state.tours.data.filters,
  }));
  
  const { handleSearch, handlePagination } = useToursSync();

  const handleDifficultyChange = (difficulty: Difficulty) => {
    handleSearch({ difficulty });
  };

  const handlePriceFilter = () => {
    handleSearch({ 
      price: { gte: 100, lte: 800 } 
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tours 测试页面</h1>
      
      {/* 调试信息 */}
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h3 className="font-semibold">调试信息：</h3>
        <p>isLoading: {JSON.stringify(isLoading)}</p>
        <p>Error: {error || 'None'}</p>
        <p>Current Page: {pagination.currentPage}</p>
        <p>Total Pages: {pagination.totalPages}</p>
        <p>Filters: {JSON.stringify(filters)}</p>
      </div>
      
      {/* 测试按钮 */}
      <div className="space-x-2 mb-4">
        <button 
          onClick={() => handleDifficultyChange('easy')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          筛选：简单
        </button>
        <button 
          onClick={() => handleDifficultyChange('medium')}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          筛选：中等
        </button>
        <button 
          onClick={handlePriceFilter}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          价格：100-800
        </button>
        <button 
          onClick={() => handlePagination(2)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          第二页
        </button>
      </div>
      
      {/* Tours 列表 */}
      {isLoading.initial && (
        <div>🔄 初始加载中...</div>
      )}
      
      {isLoading.search && (
        <div>🔍 搜索中...</div>
      )}
      
      {isLoading.pagination && (
        <div>📄 加载分页中...</div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          错误：{error}
        </div>
      )}
      
      {tours.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tours.map(tour => (
            <div key={tour.id} className="border p-4 rounded">
              <h3 className="font-semibold">{tour.name}</h3>
              <p>价格：${tour.price}</p>
              <p>难度：{tour.difficulty}</p>
              <p>时长：{tour.duration}天</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};