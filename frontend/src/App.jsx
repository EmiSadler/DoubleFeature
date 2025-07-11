import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";

import GamePage from "./pages/game/Game";
import { HomePage } from "./pages/home/HomePage";
import { SignUp } from "./pages/authentication/SignUp";
import { Login } from "./pages/authentication/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/SignUp",
    element: <SignUp />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/game",
    element: <GamePage />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
