import React, { useState, useEffect } from "react";
import WaterProgress from "./WaterProgress";
import { Button } from "./Button";
import api from "../services/api";

interface LogEntry {
  _id: string;
  amount: number;
  createdAt: string;
}

const WaterModule = () => {
  const [totalIngerido, setTotalIngerido] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(2000);
  const [inputValue, setInputValue] = useState("");

  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Cálculo da porcentagem para o componente visual
  const percentage = Math.min((totalIngerido / metaDiaria) * 100, 100);

  // Função para buscar peso, calcular meta diária e buscar consumo do dia
  const loadWaterModuleData = async () => {
    try {
      const userResponse = await api.get("/users/me");
      const peso = userResponse.data.peso;
      setMetaDiaria(peso ? peso * 35 : 2000);

      const todayDate = new Date().toISOString().split("T")[0];
      const waterResponse = await api.get(`/water?date=${todayDate}`);

      setTotalIngerido(waterResponse.data.totalMl || 0);
      setLogs(waterResponse.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    loadWaterModuleData();
  }, []);

  // Função para salvar o volume consumido no DB
  const handleAddWater = async () => {
    const volume = Number(inputValue);
    if (volume > 0 && !isNaN(volume)) {
      try {
        await api.post("/water", { amount: volume });

        await loadWaterModuleData();

        setInputValue("");
      } catch (error) {
        alert("Erro ao salvar no servidor.");
      }
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
      <Button className="my-4" onClick={handleAddWater}>
        Registrar Valor
      </Button>
      <div className="border rounded w-96 h-20 overflow-y-scroll text-sm px-3 py-1">
        {logs.length > 0 ? (
          logs.map((log) => (
            <p key={log._id}>
              <span>
                💧 {log.amount}ml ingerido às{" "}
                {new Date(log.createdAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                h
              </span>
            </p>
          ))
        ) : (
          <p>Nenhum registro hoje</p>
        )}
      </div>
    </div>
  );
};

export default WaterModule;
