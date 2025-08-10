import type { ReactNode } from "react";
import Navigation from "./Navigation";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="page-background-main">
      <Navigation />
      <div className="pt-6 md:pt-10 mb-4">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;