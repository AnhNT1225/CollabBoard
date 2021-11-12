import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/userContext";
import { ContextProviderComposer } from "./context/ContextProviderComposer";
import { BoardProvider } from "./context/boardContext";
import { ElementProvider } from "./context/elementContext";
import { SpaceProvider } from "./context/spaceContext";
import { TeamProvider } from './context/teamContext';
import { MessageProvider } from './context/messageContext';

ReactDOM.render(
  <React.StrictMode>
    <ContextProviderComposer
			contextProviders={[
				<UserProvider key={0} />,
				<BoardProvider key={1} />,
				<SpaceProvider key={2} />,
				<ElementProvider key={3} />,
				<TeamProvider key={4}/>,
				<MessageProvider key={5} />
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
