import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getParcelasData, downloadRecibo } from "../api";
import Loading from "../components/Loading";

const ParcelaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [parcela, setParcela] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false); // Novo estado para controle de download

  useEffect(() => {
    const fetchParcela = async () => {
      try {
        const response = await getParcelasData();
        const parcela = response.find((p: any) => p.parcelaId === Number(id));
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

  if (loading || error) {
    return <Loading loading={loading} error={error} />;
  }

  if (!parcela) return <p>Parcela não encontrada.</p>;

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
      setDownloading(true); // Inicia o carregamento
      const filePath = uri.split("download/")[1];

      if (!filePath) {
        throw new Error("Caminho do recibo inválido");
      }

      const blob = await downloadRecibo(filePath);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recibo_${filePath}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar recibo:", error);
      alert("Erro ao baixar o recibo.");
    } finally {
      setDownloading(false); // Finaliza o carregamento
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
          downloading ? ( // Mostra o spinner enquanto o recibo está sendo baixado
            <Loading loading={true} />
          ) : (
            <button
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
                !parcela.recibo || !parcela.recibo.uri
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={() => {
                if (parcela.recibo && parcela.recibo.uri) {
                  handleBaixarRecibo(parcela.recibo.uri);
                }
              }}
              disabled={!parcela.recibo || !parcela.recibo.uri}
            >
              Baixar Recibo
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ParcelaDetails;
