import React, { useState, type ChangeEvent } from "react";
import logoImg from "../assets/logotipo.jpg";
import { Input } from "../components/Inputs";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    usuario: "",
    senha: "",
    manterConectado: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.usuario || !form.senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/auth/login", {
        usuario: form.usuario,
        senha: form.senha,
        manterConectado: form.manterConectado,
      });

      console.log("Login bem-sucedido!", response.data);

      alert("Login realizado com sucesso!");
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/dashboard";
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.message ||
        "Erro ao fazer login. Tente novamente.";

      alert(mensagemErro);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex h-screen justify-center items-center bg-brand-blueargb">
      <main className="w-125 bg-brand-blue flex flex-col items-center p-10 rounded-xl gap-4">
        <img src={logoImg} alt="LogFit" className="w-50 shrink-0 mb-6" />
        <form
          className="w-full h-full flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Seu usuário:"
            onChange={handleChange}
            name="usuario"
            value={form.usuario}
            required
          />
          <Input
            placeholder="Sua Senha:"
            type="password"
            onChange={handleChange}
            name="senha"
            value={form.senha}
            required
          />
          <div className="flex flex-row-reverse justify-end gap-2">
            <label htmlFor="maintain-logged" className="text-white">
              Mantenha-me conectado
            </label>
            <input
              type="checkbox"
              id="maintain-logged"
              checked={form.manterConectado}
              onChange={() =>
                setForm({ ...form, manterConectado: !form.manterConectado })
              }
            />
          </div>
          <p className="text-white text-center">
            Ainda não tem uma conta?{" "}
            <Link
              to="/"
              className="text-brand-lgblue hover:underline cursor-pointer"
            >
              Cadastre-se
            </Link>
          </p>
          <button
            disabled={loading}
            className="bg-brand-mdblue text-white rounded-lg transition-all active:scale-95 cursor-pointer p-3 w-full hover:bg-brand-lgblue font-medium"
          >
            {loading ? "Carregando..." : "Logar"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
