import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const TourDetailPage = () => {
  const { slug } = useParams();

  return (
    <MainLayout>
      <h1>Tour Detail: {slug}</h1>
    </MainLayout>
  );
}

export default TourDetailPage;