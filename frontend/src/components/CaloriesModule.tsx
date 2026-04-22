import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Search } from "lucide-react";

const CaloriesModule = () => {
  const inputQuantidadeRef = useRef<HTMLInputElement>(null);

  const [metaDiaria, setMetaDiaria] = useState(2000);

  const [searchQuery, setSearchQuery] = useState("");
  const [alimentosEncontrados, setAlimentosEncontrados] = useState<any[]>([]);
  const [alimentoSelecionado, setAlimentoSelecionado] = useState<any | null>(
    null,
  );
  const [quantidade, setQuantidade] = useState<number>(0);
  const [totalConsumido, setTotalConsumido] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);

  // Equação de Katch McArdle
  function calcularTMB(peso: number, bf: number) {
    const mlg = (1 - bf / 100) * peso;
    const tmb = Math.round(370 + 21.6 * mlg);
    setMetaDiaria(tmb);
  }

  // Função para carregar a TMB
  const loadCaloriesModuleData = async () => {
    try {
      const userResponse = await api.get("/users/me");
      const peso = userResponse.data.peso;
      const bf = userResponse.data.bf;
      calcularTMB(peso, bf);
      fetchDailyLogs();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  // Função para carregar os logs do dia
  const fetchDailyLogs = async () => {
    try {
      const hoje = new Date().toISOString().split("T")[0];
      const { data } = await api.get(`/calories?date=${hoje}`);

      if (data.success) {
        setLogs(data.logs);
        setTotalConsumido(data.totalCalories);
      }
    } catch (error) {
      console.error("Erro ao buscar logs do dia:", error);
    }
  };

  useEffect(() => {
    loadCaloriesModuleData();
  }, []);

  // Função de busca no DB
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const { data } = await api.get(`/calories/search?q=${searchQuery}`);
          setAlimentosEncontrados(data.data || []);
        } catch (err) {
          console.error("Erro na busca local");
        }
      } else {
        setAlimentosEncontrados([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Função de registrar refeição
  const handleRegister = async () => {
    if (!alimentoSelecionado || quantidade <= 0) {
      alert("Selecione um alimento e digite o peso em gramas");
      return;
    }

    try {
      const response = await api.post("/calories", {
        foodName: alimentoSelecionado.description,
        kcalPer100g: alimentoSelecionado.energy_kcal,
        amount: quantidade,
      });

      if (response.data.success) {
        setSearchQuery("");
        setAlimentoSelecionado(null);
        setQuantidade(0);
        setAlimentosEncontrados([]);
        fetchDailyLogs();
        alert("Refeição Registrada!");
      }
    } catch (error: any) {
      console.error("Erro ao registrar refeição:", error);
      alert("Falha ao salvar no servidor.");
    }
  };

  return (
    <div className="bg-brand-gray py-6 rounded-xl flex flex-col items-center h-150">
      <h1 className="text-2xl font-medium text-center text-white mb-7">
        Controle de Calorias
      </h1>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-25 w-45 flex flex-col items-center justify-center gap-1.25 bg-brand-lggray border rounded-lg border-brand-border">
            <p className="text-white text-sm">Meta Diária</p>
            <span className="text-brand-green text-2xl">{metaDiaria} kcal</span>
          </div>
          <div className="h-25 w-45 flex flex-col items-center justify-center gap-1.25 bg-brand-lggray border rounded-lg border-brand-border">
            <p className="text-white text-sm">Total Consumido</p>
            <span className="text-brand-green text-2xl">
              {totalConsumido} kcal
            </span>
          </div>
        </div>

        <progress
          value={totalConsumido}
          max={metaDiaria}
          className="w-94 h-1.25 border rounded-lg [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
        ></progress>

        <div className="flex flex-col gap-2.5">
          <div className="relative w-94">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-mauve-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite o nome do alimento"
              className="bg-brand-lggray border border-brand-border rounded-lg w-full pl-8 pr-2 py-1.5 placeholder:text-xs text-mauve-300 focus:outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 w-94">
            <div className="bg-brand-lggray w-45 h-38.5 border rounded-lg border-brand-border overflow-y-scroll no-scrollbar">
              {alimentosEncontrados.map((alimento) => (
                <div
                  key={alimento._id}
                  className="p-2 hover:bg-brand-border cursor-pointer text-xs text-white"
                  onClick={() => {
                    setAlimentoSelecionado(alimento);
                    setAlimentosEncontrados([]);
                    setSearchQuery(alimento.description);
                    setTimeout(() => inputQuantidadeRef.current?.focus(), 0);
                  }}
                >
                  {alimento.description}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-mauve-400 text-xs">Peso em gramas (g):</p>
              <input
                ref={inputQuantidadeRef}
                type="number"
                value={quantidade || ""}
                placeholder="0 g"
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="text-white bg-brand-lggray border rounded-lg border-brand-border px-2 py-1 text-sm focus:outline-none placeholder:text-xs"
                min="1"
              />
              <button
                onClick={handleRegister}
                className="bg-brand-green hover:bg-green-400 cursor-pointer text-black rounded-xl py-2.5 text-sm font-medium"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Logs */}
      <div className="border bg-brand-lggray border-brand-border rounded w-94 h-20 overflow-y-scroll no-scrollbar text-sm px-2 py-1 mt-5">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log._id}
              className="flex justify-between border-b border-brand-border py-0.5 last:border-0"
            >
              <span className="text-white truncate max-w-[70%]">
                {log.foodName}
              </span>
              <span className="text-brand-green">{log.totalKcal} kcal</span>
            </div>
          ))
        ) : (
          <p className="text-mauve-400 text-center text-xs mt-2">
            Sem registros hoje.
          </p>
        )}
      </div>
    </div>
  );
};

export default CaloriesModule;
