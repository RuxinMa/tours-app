import { useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useTours } from '../hooks/useTours';

import MainLayout from "../components/layout/MainLayout";
import TourHeader from "../components/tour/TourHeader";
import TourDetailError from "../components/tour/TourDetailError";
import TourDetailSkeleton from "../components/tour/TourDetailSkeleton";

const TourDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { 
    selectedTour, 
    isLoading, 
    error, 
    loadTourDetail, 
    clearError,
    clearTourDetail 
  } = useTours();

  // Load tour data when component mounts or slug changes
  useEffect(() => {
    if (slug) {
      console.log(`🔄 TourDetailPage: Loading tour with slug: ${slug}`);
      loadTourDetail(slug);
    }
    
    // Cleanup when component unmounts
    return () => {
      clearTourDetail();
    };
  }, [slug, loadTourDetail, clearTourDetail]);

  // Handle retry
  const handleRetry = () => {
    if (slug) {
      clearError();
      loadTourDetail(slug);
    }
  };

  // Handle go back
  const handleGoBack = () => {
    clearError(); 
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <TourDetailSkeleton />
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <TourDetailError 
          error={error} 
          onRetry={handleRetry}
          onGoBack={handleGoBack}
        />
      </MainLayout>
    );
  }

  // Tour not found (no error but no tour data)
  if (!selectedTour) {
    return (
      <TourDetailError 
        error="The tour you're looking for doesn't exist or has been removed."
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <MainLayout>
      <TourHeader tour={selectedTour} />
    </MainLayout>
  );
}

export default TourDetailPage;