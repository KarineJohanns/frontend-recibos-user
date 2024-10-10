import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recuperarSenha } from '../api'; // Função para chamar a API de recuperação de senha
import MessageModal from '../components/MessageModal'; // Componente para mostrar mensagens
import { formatarCPF } from '../utils';

const RecuperarSenha = () => {
  const [cpf, setCpf] = useState(''); // Estado para armazenar o CPF
  const [error, setError] = useState(''); // Estado para armazenar erros
  const [modalMessage, setModalMessage] = useState(''); // Mensagem do modal
  const [showModal, setShowModal] = useState(false); // Controle do estado do modal
  const navigate = useNavigate(); // Para navegar entre as páginas

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      // Chama a API para recuperar a senha
      const response = await recuperarSenha(cpf); // Remove caracteres não numéricos
      setModalMessage(response.mensagem || 'Instruções de recuperação de senha foram enviadas para seu WhatsApp.'); // Mensagem de sucesso
      setShowModal(true); // Mostra o modal
    } catch (error) {
      // Captura o erro retornado pela API
      if (error.response) {
        // Verifica se a resposta do erro está disponível
        setError(error.response.data.mensagem); // Exibe a mensagem de erro do backend
      } else {
        setError('Ocorreu um erro ao tentar recuperar a senha.'); // Mensagem de erro genérica
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Fecha o modal
    navigate('/alterar-senha-primeiro-acesso'); // Redireciona para a página principal ou outra página que você desejar
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfFormatado = formatarCPF(e.target.value); // Formata o CPF
    setCpf(cpfFormatado); // Atualiza o estado com o CPF formatado
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-center text-2xl mb-4">Recuperar Senha</h2>
        <form onSubmit={handleRecuperarSenha}>
          <input
            type="text"
            placeholder="Digite seu CPF"
            value={cpf}
            onChange={handleCpfChange}
            className="block w-full mb-4 p-2 border rounded"
            autoComplete="off"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Recuperar Senha
          </button>
        </form>
      </div>

      {/* Componente MessageModal */}
      <MessageModal 
        isOpen={showModal} 
        message={modalMessage} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default RecuperarSenha;
