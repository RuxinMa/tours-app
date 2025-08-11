import { useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useTours } from '../hooks/useTours';

import MainLayout from "../components/layout/MainLayout";
import TourHeader from "../components/tour/TourHeader";
import TourOverview from "../components/tour/TourOverview";
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

  // Handle go back
  const handleGoBack = () => {
    clearError(); // Clear any existing error state
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
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <MainLayout>
      <TourHeader tour={selectedTour} />
      <TourOverview tour={selectedTour} />
      {/* Additional components like TourReviews, TourBooking, etc. can be added here */}
    </MainLayout>
  );
}

export default TourDetailPage;