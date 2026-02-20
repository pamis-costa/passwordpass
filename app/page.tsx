"use client";

import { useState, ReactNode } from "react";
import { Copy, ShieldCheck, Smartphone, Landmark, Tv, Check } from "lucide-react";

interface SenhaGerada {
  senha: string;
  explicacao: string;
  recomendacao: {
    local: string;
    icone: ReactNode;
    cor: string;
    borda: string;
  };
}

export default function GeradorSenhas() {
  const [interesses, setInteresses] = useState<string>("");
  const [tamanho, setTamanho] = useState<number>(16);
  const [senhasGeradas, setSenhasGeradas] = useState<SenhaGerada[]>([]);
  const [copiadoIndex, setCopiadoIndex] = useState<number | null>(null);

  const sugerirUso = (tamanhoSenha: number) => {
    if (tamanhoSenha >= 20) {
      return { local: "Bancos / Contas Master", icone: <Landmark size={18} />, cor: "text-red-500", borda: "border-red-500/30" };
    } else if (tamanhoSenha >= 14) {
      return { local: "Redes Sociais (Instagram, X)", icone: <Smartphone size={18} />, cor: "text-blue-400", borda: "border-blue-500/30" };
    } else {
      return { local: "Fóruns / Streaming", icone: <Tv size={18} />, cor: "text-green-400", borda: "border-green-500/30" };
    }
  };

  const ofuscarPalavra = (palavra: string) => {
    const substituicoes: { [key: string]: string } = { a: "@", e: "3", i: "1", o: "0", s: "$", t: "7" };
    return palavra.toLowerCase().split("").map((l: string) => substituicoes[l] || l).join("");
  };

  const gerarLista = () => {
    let arrayInteresses = interesses.split(",").map((i) => i.trim()).filter(Boolean);
    if (arrayInteresses.length === 0) arrayInteresses = ["cyber", "tecnologia", "codigo"];

    const novasSenhas: SenhaGerada[] = [];
    const caracteresEspeciais = "!@#$%&*_-+=";
    const numeros = "0123456789";
    const letrasMaiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
    const todosCaracteres = letrasMinusculas + letrasMaiusculas + numeros + caracteresEspeciais;

    for (let i = 0; i < 10; i++) {
      const base = arrayInteresses[Math.floor(Math.random() * arrayInteresses.length)];
      let senhaParcial = ofuscarPalavra(base.replace(/\s+/g, ""));

      senhaParcial += letrasMaiusculas[Math.floor(Math.random() * letrasMaiusculas.length)];
      senhaParcial += numeros[Math.floor(Math.random() * numeros.length)];
      senhaParcial += caracteresEspeciais[Math.floor(Math.random() * caracteresEspeciais.length)];

      while (senhaParcial.length < tamanho) {
        senhaParcial += todosCaracteres[Math.floor(Math.random() * todosCaracteres.length)];
      }

      const senhaFinal = senhaParcial.substring(0, tamanho).split("").sort(() => 0.5 - Math.random()).join("");
      const recomendacao = sugerirUso(tamanho);

      novasSenhas.push({
        senha: senhaFinal,
        explicacao: `Baseada em "${base}" + entropia.`,
        recomendacao
      });
    }

    setSenhasGeradas(novasSenhas);
  };

  const copiarTexto = (texto: string, index: number) => {
    navigator.clipboard.writeText(texto);
    setCopiadoIndex(index);
    setTimeout(() => setCopiadoIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <ShieldCheck size={48} className="text-red-600" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">PassWord<span className="text-red-600">Pass</span></h1>
          <p className="text-gray-400">Um gerador de senhas com base nas coisas que você gosta.</p>
        </header>

        {/* Painel de Controle */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Variáveis de base (separadas por vírgula):</label>
              <input 
                type="text" 
                value={interesses}
                onChange={(e) => setInteresses(e.target.value)}
                placeholder="Ex: programação, rock, vermelho..." 
                className="w-full bg-[#1a1a1a] border border-gray-800 text-white rounded-lg p-4 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-semibold text-gray-400 mb-2">
                <span>Comprimento do vetor (Tamanho):</span>
                <span className="text-red-500 font-bold text-lg">{tamanho}</span>
              </label>
              <input 
                type="range" min="8" max="32" value={tamanho} 
                onChange={(e) => setTamanho(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <button 
              onClick={gerarLista}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              Executar Geração
            </button>
          </div>
        </div>

        {/* Lista de Resultados */}
        {senhasGeradas.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Resultados da Análise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {senhasGeradas.map((item, index) => (
                <div key={index} className={`bg-[#111] rounded-xl p-5 border ${item.recomendacao.borda} flex flex-col justify-between group hover:bg-[#151515] transition`}>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2 bg-[#1a1a1a] px-3 py-1 rounded-full border border-gray-800">
                      <span className={item.recomendacao.cor}>{item.recomendacao.icone}</span>
                      <span className="text-xs font-medium text-gray-300">{item.recomendacao.local}</span>
                    </div>
                    <button 
                      onClick={() => copiarTexto(item.senha, index)}
                      className="text-gray-500 hover:text-white transition p-2 bg-[#1a1a1a] rounded-lg border border-gray-800"
                      title="Copiar para a área de transferência"
                    >
                      {copiadoIndex === index ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>

                  <div>
                    <div className="text-xl font-mono text-gray-100 tracking-widest break-all mb-2">
                      {item.senha}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.explicacao}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}