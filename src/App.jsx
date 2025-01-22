import RootRoutes from "@/routes";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
    return (
        <Router>
            <RootRoutes />
        </Router>
    )
}

export default App;
