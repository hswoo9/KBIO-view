import RootRoutes from "@/routes";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

function App() {

    useEffect(() => {
        console.log(
            "%c DEV-JITSU ",
            "font-size: 28px; font-weight: bold; color: white; background: linear-gradient(45deg, #ff416c, #ff4b2b); padding: 12px 32px; border-radius: 10px; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3); box-shadow: 0 4px 10px rgba(255, 75, 43, 0.6); font-family: 'Arial', sans-serif;"
        );
    }, []);

    return (
        <Router>
            <RootRoutes />
        </Router>
    )
}

export default App;
