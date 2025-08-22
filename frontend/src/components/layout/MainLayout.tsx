import type { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "../common/Footer";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="page-background-main">
      <Navigation />
      <div className="mb-4">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;