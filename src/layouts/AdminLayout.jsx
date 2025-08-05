import { Outlet } from "react-router";
import { Menu } from "../components/Menu.jsx";
import { Footer } from "../components/Footer.jsx";

export const AdminLayout = () => {
  return (
    <>
      <header>
        <div className="">
          <Menu />
        </div>
      </header>
      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};
