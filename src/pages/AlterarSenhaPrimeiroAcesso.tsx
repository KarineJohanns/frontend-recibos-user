import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alterarSenhaPrimeiroAcesso } from '../api'; // Função de alteração de senha
import MessageModal from '../components/MessageModal'; // Importando o MessageModal
import { formatarCPF } from '../utils';

const AlterarSenhaPrimeiroAcessoPage = () => {
  const [cpf, setCpf] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repetirNovaSenha, setRepetirNovaSenha] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal
  const [modalMessage, setModalMessage] = useState(''); // Mensagem do modal
  const navigate = useNavigate();

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== repetirNovaSenha) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const status = await alterarSenhaPrimeiroAcesso(cpf, senhaAtual, novaSenha);
      if (status === 200) {
        setModalMessage('Senha atualizada com sucesso!'); // Define a mensagem do modal
        setIsModalOpen(true); // Abre o modal
      } else {
        setError('Erro ao alterar senha'); // Adiciona mensagem de erro para outros status
      }
    } catch (error) {
      setError('Erro ao alterar senha');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Fecha o modal
    navigate('/login'); // Redireciona para a tela de login após fechar o modal
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfFormatado = formatarCPF(e.target.value); // Formata o CPF
    setCpf(cpfFormatado); // Atualiza o estado com o CPF formatado
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-center text-2xl mb-4">Alterar Senha</h2>
        <form onSubmit={handleAlterarSenha}>
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={handleCpfChange}
            className="block w-full mb-4 p-2 border rounded"
            required
            autoComplete="off"
            name="cpfField"
          />
          <input
            type="password"
            placeholder="Senha Atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            required
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Repetir Nova Senha"
            value={repetirNovaSenha}
            onChange={(e) => setRepetirNovaSenha(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Alterar Senha
          </button>
        </form>
        <a href="/login" className="text-blue-500 text-center block mt-4">Voltar para Login</a>
      </div>

      {/* Implementando o MessageModal */}
      <MessageModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AlterarSenhaPrimeiroAcessoPage;
