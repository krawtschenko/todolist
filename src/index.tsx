import React from 'react';
import {createRoot} from 'react-dom/client';
import App from "./components/app/App";
import {Provider} from "react-redux";
import {store} from "./state/store";

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
	<Provider store={store}>
		<App/>
	</Provider>
);

