import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, CircularProgress, ListItem, List, FormControl, IconButton, Input, TextField, Typography } from '@mui/material'



import ClearIcon from '@mui/icons-material/Clear'

import { useAddAgregationMutation, useDeleteAgregationMutation, useGetSingleAgregationQuery, usePatchAgregationMutation } from '../../app/store/api'
import useAgregationForm from './useAgregationForm'
import { nanoid } from '@reduxjs/toolkit'

import { InputKeyboardEvent } from './useAgregationForm'

export default function AgregatorForm() {
    const {
        newAgregation, onKeyDown, onKeyUp, deleteKeyword, changeEndpoint, setNewAgreagtion
    } = useAgregationForm()

    const { agregationId } = useParams()
    console.log('Id from params', agregationId)
    const {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: agregation,
        isFetching,
        isSuccess,
        isError,
        error
    } = useGetSingleAgregationQuery(agregationId)

    useEffect(() => {
        if (isFetching) {
            console.log('agreagtion fetching')
        } else if (isSuccess) {
            console.log('agregation: ', agregation)
            setNewAgreagtion({...newAgregation, ...agregation})
        } else if (isError) {
            if ('status' in error) {
                console.log('Status: ', error.data)
                setNewAgreagtion({
                    title: '',
                    url: '',
                    urlInvalid: false,
                    keywords: [],
                    id: nanoid()
                })
            }
        }
    }, [agregation, isError])
    
    const [addAgregation, { isLoading: isAdding }] = useAddAgregationMutation()
    const [patchAgregation, { isLoading: isPatching }] = usePatchAgregationMutation()
    const [deleteAgregation, { isLoading: isDeleting }] = useDeleteAgregationMutation()

    const handleSubmit = async () => {
        try {
            if (agregationId !== undefined) {
                console.log('ready to patch')
                if(!isPatching) void await patchAgregation(newAgregation)
            } else {
                if(!isAdding) {
                    void await addAgregation(newAgregation)
                }
            }
        } catch (error) {
            console.log('cant adding then submit in CreateAgregatorForm: ', error)
        }
    }

    const handleDeleteAgregation = async () => {
        if(!isDeleting) void await deleteAgregation(newAgregation)
    }

    const nameInputRef = useRef<HTMLDivElement>(null)
    const endpointInputRef = useRef<HTMLDivElement>(null)
    const keywordInputRef = useRef<HTMLDivElement>(null)
    
    let count = 0
    count ++
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            {isFetching
                ? (<CircularProgress/>)
                : (
                    
                        <FormControl
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <TextField
                            ref={nameInputRef}
                            disabled={false}
                            label='Selection Name'
                            value={newAgregation.title}
                            onChange={e => setNewAgreagtion({...newAgregation, title: e.target.value})}
                            required
                            size='small'
                        />
                        <TextField
                            error={newAgregation.urlInvalid}
                            ref={endpointInputRef}
                            label='Endpoint'
                            value={newAgregation.url}
                            onKeyDown={(e: InputKeyboardEvent) => {if(e.key === 'Enter') keywordInputRef.current?.click()}}
                            onChange={changeEndpoint}
                            required
                            size='small'
                        />
                        <Box>
                            <List
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    padding: 1,
                                }}
                            >
                                {/* <ListSubheader>KeyWords</ListSubheader> */}
                                {newAgregation.keywords.map((word, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                width: 'min-content',
                                                padding: 1
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    backgroundColor: '#eafae8',
                                                    paddingLeft: 1,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography>{word}</Typography>
                                                <IconButton
                                                    size='small'
                                                    onClick={() => deleteKeyword(index)}
                                                ><ClearIcon/></IconButton>
                                            </Box>

                                        </ListItem>
                                    )
                                })}
                                <ListItem
                                    key='enterKeyword'
                                    sx={{
                                        width: 'fit-content',
                                        padding: 1
                                    }}
                                >
                                    <Input
                                        ref={keywordInputRef}
                                        placeholder='add keyword'
                                        onKeyDown={onKeyDown}
                                        onKeyUp={onKeyUp}
                                        required
                                        disableUnderline
                                        sx={{
                                            backgroundColor: '#e8f2fa',
                                            borderRadius: 2,
                                            paddingLeft: 1
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                        <Box
                            sx={{
                                alignSelf: 'flex-end',
                                display:'flex',
                                gap: 2
                            }}
                        >
                            {(agregationId !== undefined) &&
                                <Button
                                    size='small'
                                    variant='outlined'
                                    color='warning'
                                    sx={{
                                        width: 'min-content',
                                        borderRadius: 4,
                                        textTransform: 'none'
                                    }}
                                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                    onClick={ handleDeleteAgregation }
                                >Delete</Button>
                            }
                            <Button
                                size='small'
                                variant='outlined'
                                sx={{
                                    width: 'min-content',
                                    borderRadius: 4,
                                    textTransform: 'none'
                                }}
                                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                onClick={ handleSubmit }
                            >Save</Button>
                        </Box>
                    </FormControl>
                )
            }

            <Typography variant='overline'>Form rendered {count} times</Typography>
            
        </Box>
    )
}

