import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { nanoid } from '@reduxjs/toolkit'
import { Box, Button, CircularProgress, FormControl, TextField, Typography } from '@mui/material'

import {
    useAddAgregationMutation,
    useDeleteAgregationMutation,
    useGetSingleAgregationQuery,
    usePatchAgregationMutation
} from '../../app/store/api'
import useAgregationForm from './useAgregationForm'

import type { InputKeyboardEvent } from './useAgregationForm'
import Keywords from './Keywords'


export default function AgregatorForm() {
    const {
        newAgregation, urlInvalid, onKeyDown, onKeyUp, deleteKeyword, changeEndpoint, setNewAgreagtion
    } = useAgregationForm()


    const { agregationId } = useParams()
    const {
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
            console.log('isSuccess = ', isSuccess)
            console.log('agregation: ', agregation)
            setNewAgreagtion({...newAgregation, ...agregation})
        } else if (isError) {
            if ('status' in error) {
                console.log('Status: ', error.data)
                setNewAgreagtion({
                    title: '',
                    url: '',
                    baseUrl: '',
                    selector: '',
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
        console.log('handle submit have an agregation: ', agregation)
        console.log('handle submit have an new agregation: ', newAgregation)

        
        try {
            if (agregationId !== undefined) {
                console.log('ready to patch')
                if(!isPatching && !urlInvalid) void await patchAgregation(newAgregation)
            } else {
                if(!isAdding && !urlInvalid) {
                    setNewAgreagtion({...newAgregation, id: nanoid()})
                    console.log('then adding: ', newAgregation)
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
    const baseUrlInputRef = useRef<HTMLDivElement>(null)
    const selectorInputRef = useRef<HTMLDivElement>(null)
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
                            error={urlInvalid}
                            ref={endpointInputRef}
                            label='Endpoint'
                            value={newAgregation.url}
                            onKeyDown={(e: InputKeyboardEvent) => {if(e.key === 'Enter') keywordInputRef.current?.click()}}
                            onChange={changeEndpoint}
                            required
                            size='small'
                        />
                        <TextField
                            ref={baseUrlInputRef}
                            disabled={false}
                            label='Base url'
                            value={newAgregation.baseUrl}
                            onChange={e => setNewAgreagtion({...newAgregation, baseUrl: e.target.value})}
                            required
                            size='small'
                        />
                        <TextField
                            ref={selectorInputRef}
                            disabled={false}
                            label='Selector'
                            value={newAgregation.selector}
                            onChange={e => setNewAgreagtion({...newAgregation, selector: e.target.value})}
                            required
                            size='small'
                        />
                        <Keywords
                            keywords={newAgregation.keywords}
                            deleteKeyword={deleteKeyword}
                            onKeyDown={onKeyDown}
                            onKeyUp={onKeyUp}
                            keywordInputRef={keywordInputRef}
                        />
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

