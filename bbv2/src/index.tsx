import React from 'react';
import ReactDOM from 'react-dom/client';
import { useContext } from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import HandleBackToTitle from './App';
import * as sm from './StatManagement';

import { PlayerAttack } from './PlayerActions';
import { BossArea } from './MainPage';
import { BossContext, BossContextProvider, TurnNumberContextProvider } from './Context';
import { PlayerMenu } from './MainPage';
import { BossHpBar } from './MainPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BossContextProvider>
        <TurnNumberContextProvider>
          <App />
        </TurnNumberContextProvider>
      </BossContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
