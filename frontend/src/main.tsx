import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { Provider } from "react-redux";
import { store } from "@/store"; // adjust path
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Redux Provider */}
    <Provider store={store}>
      {/* React Query Provider */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
