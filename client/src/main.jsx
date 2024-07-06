import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { ThirdwebProvider } from "thirdweb/react"
import { sepolia } from "thirdweb/chains";
import { StateContextProvider } from "./context"
import { BrowserRouter as Router} from 'react-router-dom'
import "./index.css"

// const clientId = "import.meta.env.VITE_CLIENT_ID";
const clientId = "9b7fbbd1d5ca77f66451371ea997c039";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider 
        activeChain={sepolia}
        clientId={clientId}
    >
        <Router>
          <StateContextProvider>
            <App />
          </StateContextProvider>
        </Router>
     
    </ThirdwebProvider>
  </React.StrictMode>
);