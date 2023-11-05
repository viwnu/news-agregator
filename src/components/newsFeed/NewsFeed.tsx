import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Link, List, ListItem, Typography } from '@mui/material'

import { AppDispatch } from '../../app/store/store'
import { RootState } from '../../app/store/rootReducer'
import { useAppSelector } from '../../app/hooks/reduxHooks'
import { selectSingleAgregation } from '../../app/store/api'
import { fetchNews, selectTotalNews, selectAllNews } from '../../features/news/newsSlice'


export function NewsFeed() {
    const { agregationId } = useParams()
    const agregation = useSelector((state: RootState) => selectSingleAgregation(state, agregationId!))
    console.log('in newsFeed, agregation: ', agregation)
    
    const dispatch: AppDispatch = useDispatch()
    const count = useSelector(selectTotalNews)
    const news = useAppSelector(selectAllNews)
    const newsLoading = useSelector((state: RootState) => state.news.loading)
    const newsRejected = useSelector((state: RootState) => state.news.rejected)

    useEffect(() => {
        if (agregation.url.length !== 0) {
            dispatch(fetchNews(agregation))
            .then(() => console.log('fetching sucessefuly'))
            .catch((err) => console.log(err))
        }
    }, [agregation])

    return (
        <Box>
            <Box>
                { newsRejected ?? <Typography variant='overline' >Bad URL</Typography> }
                { newsLoading && <Typography>Loading</Typography> }
                { !newsLoading && !newsRejected
                    && <>
                        <Typography variant='h5' >News:</Typography>
                        <List
                            sx={{
                                maxWidth: 'max-content',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            {news.map((item, index) => <ListItem key={index}
                                sx={{
                                    boxShadow: 2,
                                    borderRadius: 2,
                                    minHeight: '4rem',
                                }}
                            >
                                <Link href={item.url}
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >{item?.title.slice(0, 100)}...</Link>
                            </ListItem> )}
                        </List>
                    </>
                }
            </Box>
            <Box>
                <Typography variant='overline' > There are <span>{count}</span> news.{' '} </Typography>
            </Box>
        </Box>
    )
}
