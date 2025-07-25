import { Outlet } from "react-router";
import { Menu } from "../components/Menu.jsx";

export const AdminLayout = () => {
  return (
    <>
      <header>
        <div className="min-h-screen">
          <Menu />
        </div>
      </header>
      <main>
        <Outlet />
      </main>

      <footer>Public Footer </footer>
    </>
  );
};
