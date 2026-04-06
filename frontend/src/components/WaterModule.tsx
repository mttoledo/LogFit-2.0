import React, { useState, useEffect } from "react";
import WaterProgress from "./WaterProgress";
import { Button } from "./Button";
import api from "../services/api";

const WaterModule = () => {
  const [totalIngerido, setTotalIngerido] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(2000);
  const [inputValue, setInputValue] = useState("");

  // Cálculo da porcentagem para o componente visual
  const percentage = Math.min((totalIngerido / metaDiaria) * 100, 100);

  // Função para buscar peso, calcular meta diária e buscar consumo do dia
  useEffect(() => {
    const loadWaterModuleData = async () => {
      try {
        const userResponse = await api.get("/users/me");
        const peso = userResponse.data.peso;

        if (peso) {
          setMetaDiaria(peso * 35);
        } else {
          setMetaDiaria(2000);
        }
      } catch (error: any) {
        console.error("Erro ao buscar peso do usuário", error);
        setMetaDiaria(2000);
      }

      try {
        const todayDate = new Date().toISOString().split("T")[0];

        const waterResponse = await api.get(`/water?date=${todayDate}`);

        setTotalIngerido(waterResponse.data.totalMl || 0);
      } catch (error: any) {
        console.error("Erro ao buscar consumo de água de hoje:", error);
      }
    };

    loadWaterModuleData();
  }, []);

  // Função para adicionar água
  const handleAddWater = () => {
    const volume = Number(inputValue);
    if (volume > 0 && !isNaN(volume)) {
      setTotalIngerido((prev) => prev + volume);
      setInputValue("");
    }
  };

  return (
    <div className="bg-white py-6 rounded-xl flex flex-col items-center h-150">
      <h1 className="text-2xl font-semibold text-center">Controle de Água</h1>
      <div className="my-8 flex flex-row items-center gap-22">
        <WaterProgress percentage={percentage} />
        <div>
          <div>
            <h2 className="text-lg font-medium">Total Ingerido:</h2>
            <p className="text-brand-mdblue text-2xl font-bold">
              {totalIngerido}ml
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium">Meta Diária:</h2>
            <p className="text-brand-mdblue text-2xl font-bold">
              {metaDiaria}ml
            </p>
          </div>
        </div>
      </div>
      <label className="flex flex-col text-xs w-96">
        Volume (ml):
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-1 rounded"
        />
      </label>
      <Button className="mt-4" onClick={handleAddWater}>
        Registrar Valor
      </Button>
    </div>
  );
};

export default WaterModule;
