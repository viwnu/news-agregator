import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

type Props = {
    handleDrawerToggle: () => void;
    drawerWidth: number;
}

export default function Header({handleDrawerToggle, drawerWidth}: Props) {
    
    return (
        <AppBar
                    position="fixed"
                    sx={{
                    
                    ml: { sm: `${drawerWidth}px` },
                    zIndex: (theme) => theme.zIndex.drawer + 1
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                           <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            News Agregator
                        </Typography>
                    </Toolbar>
                </AppBar>
    )
}