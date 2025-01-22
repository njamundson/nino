import { Route } from "react-router-dom";

export const adminRoutes = [];

export const AdminRoutes = () => {
  return (
    <>
      {adminRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
};

export default AdminRoutes;