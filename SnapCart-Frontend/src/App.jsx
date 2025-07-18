import { useCallback, useLayoutEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./Components/Layout/MainLayout";
import NavBar from "./Components/Navigation/NavBar";
import OAuthSuccess from "./Components/OAuthSuccess";
import PrivateRoute from "./Components/PrivateRoute";
import ProductManagement from "./Components/Products/ProductManagement";
import ProtectedRoute from "./Components/ProtectedRoute";
import Registration from "./Components/Registration";
import About from "./Pages/About";
import AdminDashboard from "./Pages/AdminDashboard";
import BecomeSeller from "./Pages/BecomeSeller";
import Cart from "./Pages/Cart";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Profile from "./Pages/Profile";
import WishList from "./Pages/WishList";
import useUserContext from "./context/User/useUserContext";

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme === "dark") {
    return true;
  } else if (storedTheme === "light") {
    return false;
  } else {
    return prefersDark;
  }
};

const App = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);
  const { isLoggedIn } = useUserContext();

  // Update theme in localStorage and document class
  useLayoutEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const toastClassName = () =>
    "relative min-h-16 px-8 py-6 flex items-center justify-between rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm font-medium transition-all duration-300 cursor-pointer";

  const bodyClassName = () => "flex-1";
  const progressClassName = () =>
    "Toastify__progress-bar Toastify__progress-bar--animated Toastify__progress-bar--default h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500";

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-900 dark:text-white transition-colors duration-300">
      <NavBar isDark={isDark} toggleDarkMode={toggleDarkMode} />
      <MainLayout>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/become-seller"
              element={
                <BecomeSeller isDark={isDark} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["PlatformAdmin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Seller Dashboard Route */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Seller"]}>
                  <ProductManagement
                    isDark={isDark}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />

            {/* Private routes starts here! */}
            <Route element={<PrivateRoute isAuthenticated={isLoggedIn} />}>
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<WishList />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            closeButton
            draggable
            pauseOnFocusLoss
            pauseOnHover={false}
            theme={
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            }
            transition={Zoom}
            toastClassName={toastClassName}
            bodyClassName={bodyClassName}
            progressClassName={progressClassName}
            limit={3}
          />
        </main>
      </MainLayout>
    </div>
  );
};

export default App;
