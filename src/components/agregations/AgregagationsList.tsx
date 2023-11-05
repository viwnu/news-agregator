import { Button, CircularProgress, List, ListItem, ListItemText, Typography, Link, Box } from '@mui/material'
import { useGetAgregationsQuery } from '../../app/store/api'
import { Link as RouterLink } from 'react-router-dom'

export default function AgregagationsList() {
    const {
        data: resBody,
        isLoading,
        isSuccess,
        isError,
        // error
    } = useGetAgregationsQuery()

    let content

    if (isLoading) {
        content = <CircularProgress/>
    } else if (isSuccess) {
        const agregations = resBody.agregations
        console.log('agregations is: ', agregations)
        content = <List
            sx={{
                pl: 1,
                pr: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            {agregations.map(agregation => (
                <ListItem key = {agregation.id} 
                    sx={{
                        boxShadow: 2,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >                    
                    <Box component={RouterLink} to={`/news/${agregation.id}`}
                        sx={{
                            width: 'inherit',
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <ListItemText primary={ agregation.title } />
                    </Box>
                    <Link component={RouterLink} to={`/${agregation.id}`}>
                        <Button 
                            size='small'
                            sx={{
                                border: 1,
                                borderRadius: 4,
                                textTransform: 'none'
                            }}
                        >Details</Button>
                    </Link>
                </ListItem>
            ))}
            
        </List>
    } else if (isError) {
        // content = <Alert severity='error'>{JSON.stringify(error)}</Alert>
        content = <Typography variant='overline' >Nothing to display</Typography>
    }

    return (
        <>
            {content}
        </>
    )
}