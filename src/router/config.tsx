
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Properties from "../pages/properties/page";
import PropertyDetail from "../pages/property-detail/page";
import Areas from "../pages/areas/page";
import About from "../pages/about/page";
import AdminDashboard from "../pages/admin/page";
import AdminLogin from "../pages/admin/login/page";
import BlogsPage from "../pages/blogs/page";
import BlogDetailPage from "../pages/blog-detail/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/property/:id",
    element: <PropertyDetail />,
  },
  {
    path: "/areas",
    element: <Areas />,
  },
  {
    path: "/blogs",
    element: <BlogsPage />,
  },
  {
    path: "/blog/:slug",
    element: <BlogDetailPage />, 
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
