import { Outlet, Navigate } from "react-router-dom";
import { getAuthUser } from "../Helper/Storage";
const AdminMiddleware = () => {
  const authRole = getAuthUser().data?.user?.role;
  return <>{authRole === "admin" ? <Outlet /> : <Navigate to={"/"} />}</>;
};

export default AdminMiddleware;
