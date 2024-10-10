// src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation  } from "react-router-dom";
import Layout from "./components/Layout";
import Parcelas from "./pages/Parcelas";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import AlterarSenhaPrimeiroAcessoPage from "./pages/AlterarSenhaPrimeiroAcesso";
import RecuperarSenha from "./pages/RecuperarSenha";
import PrivateRoute from "./PrivateRoute";
import ParcelaDetails from "./pages/ParcelaDetails";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const userSession = localStorage.getItem("userSession");
    
    // Verifica se a rota atual não é a de recuperação de senha ou a de alterar senha no primeiro acesso
    if (!userSession && location.pathname !== "/recuperar-senha" && location.pathname !== "/alterar-senha-primeiro-acesso") {
      navigate("/login"); // Redireciona para a tela de login se não houver sessão e a rota não for uma das duas
    }
  }, [navigate, location.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/alterar-senha-primeiro-acesso" element={<AlterarSenhaPrimeiroAcessoPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Parcelas />
            </PrivateRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          }
        />
        <Route
          path="/parcelas"
          element={
            <PrivateRoute>
              <Parcelas />
            </PrivateRoute>
          }
        />
        <Route
          path="/parcelas/:id"
          element={
            <PrivateRoute>
              <ParcelaDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
