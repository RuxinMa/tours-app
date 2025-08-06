import { useParams } from "react-router-dom";

const TourDetailPage = () => {
  const { slug } = useParams();

  return (
    <div className="page-background-main">
      <h1>Tour Detail: {slug}</h1>
    </div>
  );
}

export default TourDetailPage;