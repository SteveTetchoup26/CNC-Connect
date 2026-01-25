/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTop from "../ScrollToTop";


const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="grow px-2 md:px-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;