import { Box, Button, Drawer, DrawerProps, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'

import AgregagationsList from '../agregations/AgregagationsList'

type Props = {
    handleDrawerToggle: () => void;
    mobileOpen: boolean;
    drawerWidth: number
  }



export default function SideMenu({handleDrawerToggle, mobileOpen, drawerWidth }: Props) {
    
    const mobileDrawerParams: DrawerProps = {
        variant: 'temporary',
        open: mobileOpen,
        onClose: handleDrawerToggle,
        ModalProps: {
            keepMounted: true, // Better open performance on mobile.
        }
    }

    const permanentDrawerParams: DrawerProps = {
        variant: 'permanent',
        open: true,
    }

    const theme = useTheme()
    const drawerParams = useMediaQuery(theme.breakpoints.up('sm'))
        ?permanentDrawerParams
        : mobileDrawerParams

    
    
    
    return (
        <Box
            component="nav"
            sx={{
                width: { sm: drawerWidth },
                flexShrink: { sm: 0 }
            }}
            aria-label="agregations"
        >
            
            <Drawer
                {...drawerParams}
                sx = {{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <Toolbar />
                <Box
                    sx={{
                        pt: 2    
                    }}
                >
                    <Typography variant='h5'
                        sx={{
                            pl: 2
                        }}
                    >Agregations</Typography>
                    <AgregagationsList/>
                    <Link to={'/newAgregation'}>
                        <Button 
                            size='small'
                            sx={{
                                border: 1,
                                borderRadius: 4,
                                textTransform: 'none'
                            }}
                        >Add new Agregation</Button>
                    </Link>
                </Box>
            </Drawer>
        </Box>
    )
}

