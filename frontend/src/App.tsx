import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, useAuth } from "./auth/AuthContext";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Contacts from "./pages/Contacts";
import Companies from "./pages/Companies";
import Activities from "./pages/Activities";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";



/* ---------------- Protected Route ---------------- */

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

/* ---------------- Pages ---------------- */


/* ---------------- Router ---------------- */

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <Protected>
        <Layout />
      </Protected>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "contacts", element: <Contacts /> },
      { path: "companies", element: <Companies /> },
      { path: "activities", element: <Activities /> },
      { path: "deals", element: <Deals /> },
    ],
  },
]);

/* ---------------- App ---------------- */

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
