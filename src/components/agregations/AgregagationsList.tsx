import { Alert, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material'
import { useGetAgregationsQuery } from '../../app/store/api'
import { Link } from 'react-router-dom'

export default function AgregagationsList() {
    const {
        data: resBody,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAgregationsQuery()

    let content

    if (isLoading) {
        content = <CircularProgress/>
    } else if (isSuccess) {
        const agregations = resBody.agregations
        console.log('agregations is: ', agregations)
        content = <List>
            {agregations.map(agregation => (
                <ListItem key = {agregation.id}>                    
                    <ListItemText primary={ agregation.title } />
                    <Link to={`/${agregation.id}`}>
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
        content = <Alert severity='error'>{JSON.stringify(error)}</Alert>
    }

    return (
        <>
            {content}
        </>
    )
}