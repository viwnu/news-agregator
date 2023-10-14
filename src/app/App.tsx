import { useState } from 'react'

import { Box, CssBaseline, Toolbar, Typography } from '@mui/material'

import AgregatorForm from '../components/agregatorForm/AgregatorForm'
import Header from '../components/header/Header'
// import NewsFeed from '../components/newsFeed/NewsFeed'
import SideMenu from '../components/sideMenu/SideMenu'
import { Route, Routes } from 'react-router-dom'

const drawerWidth = 240

export default function App() {
    let count = 0
    count++
    // const { window } = props

    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }
    
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Header
                    handleDrawerToggle={handleDrawerToggle}
                    drawerWidth={drawerWidth}
                />
                <SideMenu
                    handleDrawerToggle={handleDrawerToggle}
                    mobileOpen={mobileOpen}
                    drawerWidth={drawerWidth}
                />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    <Routes>
                        <Route path="/" element={<AgregatorForm/>} />
                        <Route path="/newAgregation" element={<AgregatorForm/>} />
                        {/* <Route path="/form" element={<CreateAgregatorForm/>} /> */}
                        <Route path="/:agregationId" element={<AgregatorForm/>} />
                        <Route path='/*' element={<><p>Wrong URL</p></>}/>
                        <Route element={<><p>Page Not Founf</p></>}/>
                    </Routes>
                    <Typography>App rended {count} times</Typography>
                </Box>
            </Box>
        </>
    )
}