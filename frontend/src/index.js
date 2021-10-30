import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/userContext";
import { SocketProvider } from "./context/socketContext";
import { ContextProviderComposer } from "./context/ContextProviderComposer";
import { BoardProvider } from "./context/boardContext";
import { ElementProvider } from "./context/elementContext";
import { SpaceProvider } from "./context/spaceContext";
import { TeamProvider } from './context/teamContext';

ReactDOM.render(
  <React.StrictMode>
    <ContextProviderComposer
			contextProviders={[
				<UserProvider key={0} />,
				<SocketProvider key={1} />,
				<BoardProvider key={2} />,
				<SpaceProvider key={3} />,
				<ElementProvider key={4} />,
				<TeamProvider key={5}/>
			]}
		>
			<App />
		</ContextProviderComposer>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
