import axios, { AxiosRequestConfig } from 'axios';

// Configuração da instância do Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todos os pedidos
api.interceptors.request.use(
  (config: AxiosRequestConfig<any>) => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const token = JSON.parse(userSession); // Extraia o token armazenado
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tipagem para o relatório
export interface ReportData {
  tipoRelatorio: string;
  clienteId: number | null;
  dataInicio: string;
  dataFim: string;
}

// Funções de API

// Obtém os dados das parcelas
export const getParcelasData = async () => {
  const response = await api.get('/parcelas');
  return response.data; // Retorna os dados recebidos
};

// Obtém a lista de relatórios
export const getRelatoriosLista = async () => {
  const response = await api.get('/relatorios/lista');
  return response.data; // Retorna os dados recebidos
};

// Envia dados de relatórios
export const postRelatoriosData = async (reportData: ReportData) => {
  const response = await api.post('/relatorios/parcelas', reportData, {
    responseType: 'blob', // Altera para arraybuffer para manipulação correta do PDF
  });
  return response.data; // Retorna os dados recebidos
};

// Requisição de Login
export const login = async (cpf: string, senha: string) => {
  const response = await api.post('/login', { cpf, senha });
  return response.data; // Retorna os dados recebidos (incluindo primeiroAcesso)
};

// Requisição de Alteração de Senha no primeiro acesso
export const alterarSenhaPrimeiroAcesso = async (
  cpf: string,
  senhaAtual: string,
  novaSenha: string
) => {
  const response = await api.put('/alterar-senha-primeiro-acesso', {
    cpf,
    senhaAtual,
    novaSenha,
  });
  return response.status; // Retorna o status da resposta (200 se sucesso)
};

// Requisição de Alteração de Senha
export const alterarSenha = async (
  cpf: string,
  senhaAtual: string,
  novaSenha: string
) => {
  const response = await api.put('/alterar-senha', {
    cpf,
    senhaAtual,
    novaSenha,
  });
  return response.status; // Retorna o status da resposta (200 se sucesso)
};

// Função de Recuperação de Senha
export const recuperarSenha = async (cpf: string) => {
  const response = await api.post('/recuperar-senha', { cpf }); // Altere para a rota correta
  return response.data; // Retorna os dados recebidos
};

// Nova função para download de recibo
export const downloadRecibo = async (fileName: string) => {
  const response = await api.get(`files/download/${fileName}`, {
    responseType: 'blob', // Isso é importante para downloads de arquivos
  });
  return response.data; // Retorna o blob do arquivo
};

export default api;
