import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/providers/AuthProvider";
import "./index.css";

import { Toaster } from "sonner";
import AppRoutes from "./router";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
