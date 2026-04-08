import React, { useState } from "react";
import logoImg from "../assets/logotipo.jpg";
import { Button } from "./Button";
import { Menu, X } from "lucide-react";
import api from "../services/api";

interface Props {}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/users/auth/logout");
    } catch (error) {
      console.error("Erro ao limpar sessão no servidor", error);
    } finally {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
    }
  };

  return (
    <header className="relative w-full h-20 flex justify-between items-center px-8">
      <div></div>
      <img
        src={logoImg}
        alt="LogFit"
        className="ml-[78px] w-[200px] shrink-0 pt-[24px]"
      />
      <Button className="hidden md:block" onClick={handleLogout}>
        Sair
      </Button>
      <button
        className="md:hidden p-2 text-white cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={42} /> : <Menu size={42} />}
      </button>
      {isMenuOpen && (
        <div className="absolute top-18 right-3 w-25 bg-white border-b border-gray-100 flex flex-col p-4 shadow-xl md:hidden z-50">
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}
    </header>
  );
};

export default Header;
