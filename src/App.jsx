import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import { Routes, Route } from "react-router";
import { Inquilino } from "./pages/admin/Tenant.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Home } from "./pages/public/Home.jsx";
import { PublicLayout } from "./layouts/PublicLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { RootLayout } from "./layouts/RootLayout";
import { NotFound } from "./pages/public/NotFound.jsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ProtectedRouter } from "./utils/ProtectedRouter.jsx";
import { Payments } from "./pages/admin/Payments.jsx";
import { FireStoreProvider } from "./context/FireStoreProvider.jsx";
import { SearchPayment } from "./pages/admin/SearchPayment.jsx";
import { UserRegisterForm } from "./pages/auth/UserRegisterForm.jsx";
import { ProtectedAdminRouter } from "./utils/ProtectedAdminRouter.jsx";

export function App() {
  return (
    <>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
      <BrowserRouter>
        <AuthProvider>
          <FireStoreProvider>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="auth" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                </Route>

                <Route
                  element={
                    <ProtectedRouter>
                      <AdminLayout />
                    </ProtectedRouter>
                  }
                >
                  <Route path="inquilino" element={<Inquilino />} />
                  <Route path="payments/:tenantId" element={<Payments />} />
                  <Route path="search-payment" element={<SearchPayment />} />
                  <Route
                    path="register-user"
                    element={
                      <ProtectedAdminRouter>
                        <UserRegisterForm />
                      </ProtectedAdminRouter>
                    }
                  />
                </Route>
                <Route element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </FireStoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
