import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register"; // Make sure to import Register

const MainLayout = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const openLogin = () => {
    console.log("openLogin called!");
    setLoginOpen(true);
  };

  const openRegister = () => {
    console.log("openRegister called!");
    setRegisterOpen(true);
  };

  const switchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const switchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header openLogin={openLogin} />

      <main className="flex-grow">
        <Outlet context={{ openLogin, openRegister }} />
      </main>

      <Footer />

      {/* Login Modal */}
      <Login 
        isOpen={loginOpen} 
        onClose={handleLoginClose}
        onSwitchToRegister={switchToRegister}
      />

      {/* Register Modal */}
      <Register 
        isOpen={registerOpen} 
        onClose={handleRegisterClose}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};

export default MainLayout;