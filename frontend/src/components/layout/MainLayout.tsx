import type { ReactNode } from "react";
import Navigation from "./Navigation";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="page-background-main">
      <Navigation />
      <div className="pt-8 md:pt-12">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;