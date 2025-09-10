import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useTours } from '../hooks/useTours';
// Components
import MainLayout from "../components/layout/MainLayout";
import TourHeader from "../components/tour/TourHeader";
import TourOverview from "../components/tour/TourOverview";
import TourGallery from "../components/tour/ui/TourGallery";
import TourReviews from "../components/tour/TourReviews";
import TourBooking from "../components/tour/TourBooking";
import TourDetailError from "../components/tour/ui/TourDetailError";
import TourDetailSkeleton from "../components/tour/ui/TourDetailSkeleton";

const TourMap = lazy(() => import('../components/tour/TourMap'));

const TourDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Lazy load map only when needed
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapTriggerRef = useRef(null);

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
      setIsInitialLoading(true); 
       loadTourDetail(slug).finally(() => {
        setIsInitialLoading(false);
      });
    }
    // Cleanup when component unmounts
    return () => {
      clearTourDetail();
    };
  }, [slug, loadTourDetail, clearTourDetail]);

  // Set up Intersection Observer to lazy load the map
  useEffect(() => {
    if (!selectedTour) return; // Wait until tour is loaded

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadMap(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (mapTriggerRef.current) {
      observer.observe(mapTriggerRef.current);
    }
    return () => observer.disconnect();
  }, [selectedTour]);

  // Handle go back
  const handleGoBack = () => {
    clearError(); // Clear any existing error state
    navigate('/');
  };

  // Loading state
  if (isInitialLoading || isLoading) {
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
      <TourGallery tour={selectedTour} />

      <div ref={mapTriggerRef}>
        {shouldLoadMap ? (
          <Suspense fallback={<div className="h-96 bg-gray-200 flex items-center justify-center">Loading map...</div>}>
            <TourMap tour={selectedTour} />
          </Suspense>
        ) : (
          <div className="h-96 bg-gray-200 flex items-center justify-center">
            <p>Scroll down to load map</p>
          </div>
        )}
      </div>

      {selectedTour.reviews && <TourReviews tour={selectedTour} />}
      <TourBooking tour={selectedTour} />
    </MainLayout>
  );
}

export default TourDetailPage;