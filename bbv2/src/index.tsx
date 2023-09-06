import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import {
  BossContextProvider,
  TurnNumberContextProvider,
  MessageContextProvider,
  AttackShownContextProvider,
  CurrentAttackContextProvider,
  AttackMadeContextProvider,
  UltimaContextProvider,
  KnightStatusContextProvider,
  DmageStatusContextProvider,
  AssassinStatusContextProvider,
  RmageStatusContextProvider,
  KnightNameContextProvider,
  DmageNameContextProvider,
  AssassinNameContextProvider,
  RmageNameContextProvider,
  BossAttackingContextProvider,
  PrecipTypeContextProvider,
  HpMapContextProvider,
  MpMapContextProvider,
  SelectedCharacterContextProvider


}
  from './Context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BossContextProvider>
        <TurnNumberContextProvider>
          <MessageContextProvider>
            <AttackShownContextProvider>
              <CurrentAttackContextProvider>
                <AttackMadeContextProvider>
                  <UltimaContextProvider>
                    <KnightStatusContextProvider>
                      <DmageStatusContextProvider>
                        <AssassinStatusContextProvider>
                          <RmageStatusContextProvider>
                            <KnightNameContextProvider>
                              <DmageNameContextProvider>
                                <AssassinNameContextProvider>
                                  <RmageNameContextProvider>
                                    <BossAttackingContextProvider>
                                      <PrecipTypeContextProvider>
                                        <HpMapContextProvider>
                                          <MpMapContextProvider>
                                            <SelectedCharacterContextProvider>
                                              <App />
                                            </SelectedCharacterContextProvider>
                                          </MpMapContextProvider>
                                        </HpMapContextProvider>
                                      </PrecipTypeContextProvider>
                                    </BossAttackingContextProvider>
                                  </RmageNameContextProvider>
                                </AssassinNameContextProvider>
                              </DmageNameContextProvider>
                            </KnightNameContextProvider>
                          </RmageStatusContextProvider>
                        </AssassinStatusContextProvider>
                      </DmageStatusContextProvider>
                    </KnightStatusContextProvider>
                  </UltimaContextProvider>
                </AttackMadeContextProvider>
              </CurrentAttackContextProvider>
            </AttackShownContextProvider>
          </MessageContextProvider>
        </TurnNumberContextProvider>
      </BossContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
