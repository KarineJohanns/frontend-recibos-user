// src/pages/ParcelaDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Importar useNavigate para navegação
import { getParcelasData, downloadRecibo  } from "../api"; // Importar patchEstornar

const ParcelaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtém o id da URL

  const [parcela, setParcela] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParcela = async () => {
      try {
        const response = await getParcelasData();
        
        const parcela = response.find((p: any) => p.parcelaId === Number(id));
        console.log("Dados recebidos do backend:", parcela);
        if (parcela) {
          setParcela(parcela);
        } else {
          setError("Parcela não encontrada");
        }
      } catch (err) {
        setError("Erro ao buscar a parcela");
      } finally {
        setLoading(false);
      }
    };

    fetchParcela();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!parcela) return <p>Parcela não encontrada.</p>;

  // Formatadores de data e valores
  const formatarValor = (valor: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor / 100);
  };

  const getStatusText = (paga: boolean): string => {
    return paga ? "Paga" : "Pendente";
  };

  const formatarData = (data: string): string => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
  };

  const handleBaixarRecibo = async (uri: string): Promise<void> => {
    try {
      // Remover a parte inicial da URI (http://localhost:8080/api/files/)
      const filePath = uri.split("download/")[1]; // Isso irá obter apenas o trecho após "download/"
      
      // Caso o caminho não exista, lançar um erro
      if (!filePath) {
        throw new Error("Caminho do recibo inválido");
      }
  
      const blob = await downloadRecibo(filePath); // Chama a função de download com o caminho correto
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo_${filePath}`; // Nome do arquivo
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Libera a URL após o download
    } catch (error) {
      console.error("Erro ao gerar recibo:", error);
      alert("Erro ao baixar o recibo.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="ml-12 md:ml-0">
        <h1 className="text-2xl font-bold mb-4 text-right md:text-left">
          {parcela.documento}
        </h1>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Informações do Cliente</h2>
        <p>
          <span className="font-semibold">Nome:</span>{" "}
          {parcela.cliente.clienteNome}
        </p>
        <p>
          <span className="font-semibold">CPF:</span>{" "}
          {parcela.cliente.clienteCpf}
        </p>
        <p>
          <span className="font-semibold">Telefone:</span>{" "}
          {parcela.cliente.clienteTelefone}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Detalhes da Parcela</h2>
        <p>
          <span className="font-semibold">Número de Parcelas:</span>{" "}
          {parcela.numeroParcelas}
        </p>
        <p>
          <span className="font-semibold">Valor da Parcela:</span>{" "}
          {formatarValor(parcela.valorParcela)}
        </p>
        <p>
          <span className="font-semibold">Valor Pago:</span>{" "}
          {formatarValor(parcela.valorPago)}
        </p>
        <p>
          <span className="font-semibold">Desconto Aplicado:</span>{" "}
          {formatarValor(parcela.descontoAplicado)}
        </p>
        <p>
          <span className="font-semibold">Número da Parcela:</span>{" "}
          {parcela.numeroParcela}
        </p>
        <p>
          <span className="font-semibold">Intervalo:</span> {parcela.intervalo}
        </p>
        <p>
          <span className="font-semibold">Data de Vencimento:</span>{" "}
          {formatarData(parcela.dataVencimento)}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          {getStatusText(parcela.paga)}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Produto</h2>
        <p>
          <span className="font-semibold">Nome:</span>{" "}
          {parcela.produto.produtoNome}
        </p>
        <p>
          <span className="font-semibold">Descrição:</span>{" "}
          {parcela.produto.produtoDescricao}
        </p>
        <p>
          <span className="font-semibold">Valor Total:</span>{" "}
          {formatarValor(parcela.produto.produtoValorTotal)}
        </p>
      </div>

      <div className="flex justify-between mt-4">
      {parcela.paga ? (
  <button
    className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
      !parcela.recibo || !parcela.recibo.uri ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    onClick={() => {
      if (parcela.recibo && parcela.recibo.uri) {
        handleBaixarRecibo(parcela.recibo.uri); // Usando parcelaId como solicitado
      }
    }}
    disabled={!parcela.recibo || !parcela.recibo.uri} // Desabilita o botão se não houver URI
  >
    Baixar Recibo
  </button>
) : null}
</div>
    </div>
  );
};

export default ParcelaDetails;
