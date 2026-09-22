import { AppRouter } from './routes/AppRouter';
import { AuthProvider } from './features/auth/context/AuthContext';
import './style.css'; 

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
