import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api'; // Importando a função de login do Axios
import MessageModal from '../components/MessageModal'; // Importando seu componente MessageModal
import { formatarCPF } from '../utils';
import showIcon from '../assets/show.png'; // Importando o ícone para mostrar a senha
import hideIcon from '../assets/hide.png'; // Importando o ícone para ocultar a senha

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [modalMessage, setModalMessage] = useState(''); // Para armazenar a mensagem do modal
  const [showModal, setShowModal] = useState(false); // Controle do estado do modal
  const [showPassword, setShowPassword] = useState(false); // Novo estado para controlar a visibilidade da senha
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(cpf, senha);
      
      // Armazena a sessão com o token JWT
      localStorage.setItem('userSession', JSON.stringify(response.token));

      // Verifica se é o primeiro acesso
      if (response.primeiroAcesso) {
        setModalMessage('É seu primeiro acesso, por favor, atualize sua senha.'); // Mensagem do backend
        setShowModal(true); // Mostra o modal
      } else {
        navigate('/'); // Redireciona para a página principal
      }

      // Lógica para expiração do token (opcional)
      setTimeout(() => {
        localStorage.removeItem('userSession'); // Remove após 1 hora
      }, 3600000); // 1 hora = 3600000 ms
      
    } catch (error) {
      setError('CPF ou senha incorretos');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Fecha o modal
    navigate('/alterar-senha-primeiro-acesso'); // Redireciona após fechar o modal
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpfFormatado = formatarCPF(e.target.value); // Formata o CPF
    setCpf(cpfFormatado); // Atualiza o estado com o CPF formatado
  };

  const handleRecuperarSenha = () => {
    navigate('/recuperar-senha'); // Redireciona para a página de recuperação de senha
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-center text-2xl mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={handleCpfChange}
            className="block w-full mb-4 p-2 border rounded"
            autoComplete="username" 
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'} // Altera entre 'text' e 'password'
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="block w-full p-2 border rounded"
              autoComplete="current-password" // Sugestão de preenchimento automático para senha
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Alterna a visibilidade da senha
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <img 
                src={showPassword ? hideIcon : showIcon} // Troca entre os ícones de mostrar/ocultar a senha
                alt={showPassword ? 'Ocultar senha' : 'Mostrar senha'} // Texto alternativo para acessibilidade
                className="h-5 w-5" // Define a altura e largura do ícone
              />
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Entrar
          </button>
        </form>
        <a 
          onClick={handleRecuperarSenha} // Modificando para usar o onClick
          className="text-blue-500 text-center block mt-4 cursor-pointer" // Adicionando cursor pointer
        >
          Esqueci a senha
        </a>
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

export default Login;
