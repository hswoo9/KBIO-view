import RootRoutes from './routes';
import React from 'react';

function App() {
    return (
        <RootRoutes />
    )
}




console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("process.env.REACT_APP_EGOV_CONTEXT_URL", process.env.REACT_APP_EGOV_CONTEXT_URL);

export default App;
