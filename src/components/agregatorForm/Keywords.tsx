import { Box, IconButton, Input, List, ListItem, ListSubheader, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { InputKeyboardEvent } from './useAgregationForm'

type Props = {
    keywords: string[];
    deleteKeyword: (index: number)=>void;
    onKeyDown: (e: InputKeyboardEvent)=>void;
    onKeyUp: ()=>void;
    keywordInputRef: React.RefObject<HTMLDivElement>
}


export default function Keywords({keywords, deleteKeyword, onKeyDown, onKeyUp, keywordInputRef}: Props) {
    console.log('keywords is: ', keywords)
    console.log('type: ', typeof keywords)
    keywords.map(word => console.log('word is: ', word))
    const content = keywords.length > 0
        ? keywords.map((word, index) => {
            return (
                <ListItem
                    key={index}
                    sx={{
                        width: 'min-content',
                        padding: 0,
                        pr: 1,
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
        })
        : ''
    return (
        <Box>
            <List
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: 1,
                }}
            >
                <ListSubheader color='inherit' sx={{ width: '100%', lineHeight: 1, p: 0, pb: 0.5, }} >KeyWords</ListSubheader>
                {content}
                <ListItem
                    key='enterKeyword'
                    sx={{
                        width: 'fit-content',
                        padding: 0
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
    )
}