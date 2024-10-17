// src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Parcelas from "./pages/Parcelas";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import AlterarSenhaPrimeiroAcessoPage from "./pages/AlterarSenhaPrimeiroAcesso";
import RecuperarSenha from "./pages/RecuperarSenha";
import PrivateRoute from "./PrivateRoute";
import ParcelaDetails from "./pages/ParcelaDetails";
import { ParcelaProvider } from "./ParcelaContext"; // Importa o Provider para o Contexto

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const userSession = localStorage.getItem("userSession");
    
    // Verifica se a rota atual não é a de recuperação de senha ou a de alterar senha no primeiro acesso
    if (
      !userSession &&
      location.pathname !== "/recuperar-senha" &&
      location.pathname !== "/alterar-senha-primeiro-acesso" &&
      location.pathname !== "/login"
    ) {
      navigate("/login"); // Redireciona para a tela de login se não houver sessão
    }
  }, [navigate, location.pathname]);

  return (
    <ParcelaProvider> {/* Envolve a aplicação no provider para acessar o contexto */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/alterar-senha-primeiro-acesso" element={<AlterarSenhaPrimeiroAcessoPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                <Parcelas />
              </Layout>
              </PrivateRoute>
            }
          />
          <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Layout>
                <Relatorios />
              </Layout>
            </PrivateRoute>
          }
        />
          <Route
            path="/parcelas"
            element={
              <PrivateRoute>
                <Layout>
                <Parcelas />
              </Layout>
              </PrivateRoute>
            }
          />
          <Route
          path="/parcelas/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ParcelaDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        </Routes>
    </ParcelaProvider>
  );
};

export default App;
