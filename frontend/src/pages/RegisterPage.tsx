import api from "../services/api";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import logoImg from "../assets/logotipo.jpg";
import { Input } from "../components/Inputs";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usuario: "",
    senha: "",
    idade: "",
    peso: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.usuario || !form.senha || !form.idade || !form.peso) {
      alert("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/register", form);

      console.log("Resposta do Servidor:", response.data.message);
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.request) {
        alert("Erro: O servidor não está respondendo.");
      } else {
        alert("Erro ao processar o cadastro.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex h-screen justify-center items-center bg-brand-blueargb">
      <main className="w-125 h-125 bg-brand-blue flex flex-col items-center p-10 rounded-2xl gap-4">
        <img src={logoImg} alt="LogFit" className="w-[200px] shrink-0 mb-6" />
        <p className="text-white">Para começar, informe seus dados:</p>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <Input
            placeholder="Seu Usuário"
            name="usuario"
            onChange={handleChange}
            value={form.usuario}
            required
          ></Input>
          <Input
            placeholder="Sua Senha:"
            name="senha"
            type="password"
            onChange={handleChange}
            value={form.senha}
            required
          ></Input>
          <Input
            placeholder="Sua Idade:"
            min="1"
            name="idade"
            onChange={handleChange}
            value={form.idade}
            required
          ></Input>
          <Input
            placeholder="Seu Peso:"
            min="1"
            name="peso"
            onChange={handleChange}
            value={form.peso}
            required
          ></Input>

          <p className="text-white text-center">
            Já tem uma conta?{" "}
            <span className="text-brand-lgblue hover:underline cursor-pointer">
              Faça login
            </span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-mdblue text-white rounded-lg transition-all active:scale-95 cursor-pointer p-3 w-full hover:bg-brand-lgblue font-medium"
          >
            {loading ? "Cadastrando" : "Cadastrar"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;
