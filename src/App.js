import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AllRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
