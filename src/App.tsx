import { StrictMode } from "react";
import { Routes, Route } from "react-router-dom";
import ProvidersLayout from "@/components/layouts/ProvidersLayout";
import { routes } from "@/config/routes";

const App = () => {
  return (
    <StrictMode>
      <ProvidersLayout>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </ProvidersLayout>
    </StrictMode>
  );
};

export default App;