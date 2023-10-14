import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { store } from './app/store/store'
import { Provider } from 'react-redux'
import { StyledEngineProvider } from '@mui/material'

import App from './app/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <Provider store={store}>
                <StyledEngineProvider injectFirst>
                    <App/>
                </StyledEngineProvider>
            </Provider>
        </HashRouter>
    </React.StrictMode>
)