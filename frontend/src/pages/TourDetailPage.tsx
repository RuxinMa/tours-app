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
  const [mapTriggered, setMapTriggered] = useState(false); // To prevent multiple triggers
  const mapTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
      setShouldLoadMap(false);
      setMapTriggered(false);
      
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
    if (!selectedTour || mapTriggered || !mapTriggerRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !mapTriggered) {
            setShouldLoadMap(true);
            setMapTriggered(true);
            // Stop observing to prevent duplicate triggers
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current = observer;
    observer.observe(mapTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [selectedTour, mapTriggered]);

  // Fallback to load map after 5 seconds if not triggered
  useEffect(() => {
    if (selectedTour && !shouldLoadMap && !mapTriggered) {
      // Fallback to load map after 5 seconds if not triggered
      const fallbackTimer = setTimeout(() => {
        setShouldLoadMap(true);
        setMapTriggered(true);
      }, 5000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [selectedTour, shouldLoadMap, mapTriggered]);

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

      <div ref={mapTriggerRef} className="min-h-[24rem]">
        {shouldLoadMap ? (
          <Suspense 
            fallback={
              <div className="h-96 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading interactive map...</p>
                </div>
              </div>
            }
          >
            <TourMap tour={selectedTour} />
          </Suspense>
        ) : (
          <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Loading interactive map...</p>
            </div>
          </div>
        )}
      </div>

      {selectedTour.reviews && <TourReviews tour={selectedTour} />}
      <TourBooking tour={selectedTour} />
    </MainLayout>
  );
}

export default TourDetailPage;