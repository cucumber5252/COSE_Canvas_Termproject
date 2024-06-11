// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Canvas from './view/Canvas';
import Toolbar from './view/Toolbar';
import './App.css';

function App() {
    return (
        <Provider store={store}>
            <header>
                <div className="logo">DHYCANVAS</div>
            </header>

            <div className="toolbar">
                <Toolbar />
            </div>
            <Canvas />
        </Provider>
    );
}

export default App;
