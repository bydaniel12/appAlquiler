import { Outlet } from "react-router";
import { Menu } from "../components/Menu";
import { Footer } from "../components/Footer";

export const PublicLayout = () => {
  return (
    <div>
      <header>
        <Menu />
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
