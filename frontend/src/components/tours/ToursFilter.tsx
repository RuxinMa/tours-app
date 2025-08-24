import { useState, useEffect } from 'react';
import type { ToursFilters } from '../../types/tours-store';
import type { Difficulty } from '../../types/tour.types';
//  Components
import { FormTitle } from '../layout/SettingsForm';
import Button from '../common/Button';
import { IoSearch } from "react-icons/io5";

interface ToursFilterProps {
  currentFilters: ToursFilters;
  filterOptions: {
    difficulties: Difficulty[];
    priceRange: { min: number; max: number };
    ratingsRange: { min: number; max: number };
  };
  onApplyFilters: (filters: ToursFilters) => void;
  onClearFilters: () => void;
}

const ToursFilter = ({
  currentFilters,
  filterOptions,
  onApplyFilters,
  onClearFilters,
}: ToursFilterProps) => {
  const [draftFilters, setDraftFilters] = useState<ToursFilters>(currentFilters);

  // Sync draft with current filters when they change
  useEffect(() => {
    setDraftFilters(currentFilters);
  }, [currentFilters]);

  const handleApply = () => {
    onApplyFilters(draftFilters);
  };

  const handleClear = () => {
    setDraftFilters({});
    onClearFilters();
  };

  const hasChanges = JSON.stringify(draftFilters) !== JSON.stringify(currentFilters);
  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 md:p-6 p-4 mb-6">
      {/* Header */}
      <FormTitle
        title={`Search Tours`}
        icon={<IoSearch className='text-emerald-400' />}
      />

      {/* Filter Controls */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-2">
        {/* Difficulty Filter */}
        <div>
          <label className="filter-label">
            Difficulty
          </label>
          <select
            value={draftFilters.difficulty || ''}
            onChange={(e) => {
              const difficulty = e.target.value as Difficulty;
              setDraftFilters(prev => ({
                ...prev,
                difficulty: difficulty || undefined
              }));
            }}
            className="select-filter"
          >
            <option value="">All levels</option>
            {filterOptions.difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="filter-label">
            Sort by
          </label>
          <select
            value={draftFilters.sort || ''}
            onChange={(e) => {
              setDraftFilters(prev => ({
                ...prev,
                sort: e.target.value || undefined
              }));
            }}
            className="select-filter"
          >
            <option value="">Default</option>
            <option value="-price">Price: High to Low</option>
            <option value="price">Price: Low to High</option>
            <option value="-ratingsAverage">Best Rated</option>
            <option value="ratingsAverage">Rating: Low to High</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="col-span-2">
          <label className="filter-label">
            Price Range
          </label>
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.price?.min || ''}
              onChange={(e) => {
                const min = e.target.value ? Number(e.target.value) : undefined;
                setDraftFilters(prev => ({
                  ...prev,
                  price: { ...prev.price, min }
                }));
              }}
              className="flex-1 select-filter"
            />
            <span className="flex items-center text-gray-400 text-sm">-</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.price?.max || ''}
              onChange={(e) => {
                const max = e.target.value ? Number(e.target.value) : undefined;
                setDraftFilters(prev => ({
                  ...prev,
                  price: { ...prev.price, max }
                }));
              }}
              className="flex-1 select-filter"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            ${filterOptions.priceRange.min} - ${filterOptions.priceRange.max}
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end items-center">
        {!hasActiveFilters ? (
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!hasChanges}
          >
            Search Tours
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={handleClear}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ToursFilter;