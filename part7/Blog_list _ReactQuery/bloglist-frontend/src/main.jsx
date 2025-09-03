import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "./hooks/notificationContext";
import { UserProvider } from "./hooks/userContext";


import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
        <NotificationContextProvider>
            <Router>
                <App />
            </Router>
        </NotificationContextProvider>
    </UserProvider>
  </QueryClientProvider>
);
