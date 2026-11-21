import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FeedbackToast } from './common/components/FeedbackToast';
import { ToastProvider } from './common/useToast';
import { ROUTES } from './constants/routes';
import { AuthProvider, LoginForm, RegisterForm, useAuth } from './features/auth';
import { RoutineWorkspace } from './features/routines';

function AppRoutes() {
  const { user, isInitializing, logout } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB]">
        <span className="loading loading-spinner loading-lg text-emerald-700" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={user ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginForm />}
      />
      <Route
        path={ROUTES.REGISTER}
        element={user ? <Navigate to={ROUTES.DASHBOARD} replace /> : <RegisterForm />}
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          user ? (
            <RoutineWorkspace user={user} onLogout={logout} view="dashboard" />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />
      <Route
        path={ROUTES.REORDER}
        element={
          user ? (
            <RoutineWorkspace user={user} onLogout={logout} view="reorder" />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
          <FeedbackToast />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
