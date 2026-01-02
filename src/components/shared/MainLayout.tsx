/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "./Footer";
import Header from "./Header";


const Layout = ({ children } : {children: any }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        { children }
      </main>
      <Footer />
    </div>
  );
};

export default Layout;