import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div align="center" style={{backgroundColor: 'rgb(249, 249, 249)'}}>
      <App />

    </div>
  </React.StrictMode>
);

reportWebVitals();
