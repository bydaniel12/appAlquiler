import { Outlet } from "react-router";
import { Menu } from "../components/Menu";

export const PublicLayout = () => {
  return (
    <div>
      <header>
        <Menu />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>Public Footer </footer>
    </div>
  );
};
