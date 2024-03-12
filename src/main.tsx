import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./pages/home";
import Root from "./pages/root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
