import { useState } from 'react'
// import { nanoid } from '@reduxjs/toolkit'

export type InputKeyboardEvent = React.KeyboardEvent<HTMLInputElement> &
    {
        target: HTMLInputElement;
    }

// import { Agregation } from '../../app/types/redux'

export default function useAgregationForm() {
    const [newAgregation, setNewAgreagtion] = useState({
        id: '',
        title: '',
        url: '',
        baseUrl: '',
        selector: '',
        keywords: [] as string[],
    })

    const [urlInvalid, setUrlvalidity] = useState(false)

    const [isKeyReleased, setIsKeyReleased] = useState(false)

    const onKeyDown = (e: InputKeyboardEvent) => {
        const { key } = e
        const input = e.target.value
        const trimmedInput = input.trim()

        const re = /^[A-Za-zА-Яа-я0-9]+$/i
      
        if ((key === ',' || key === 'Enter') && (trimmedInput.length !== 0) && !newAgregation.keywords.includes(trimmedInput) && re.test(e.target.value)) {
          e.preventDefault()
          setNewAgreagtion({...newAgregation, keywords: [...newAgregation.keywords, trimmedInput]})
          e.target.value = ''
        }
      
        if (key === 'Backspace' && (input.length === 0) && (newAgregation.keywords.length > 0) && (Boolean(isKeyReleased))) {
          const keywordsCopy = [...newAgregation.keywords]
          const poppedTag = keywordsCopy.pop()
          e.preventDefault()
          setNewAgreagtion({...newAgregation, keywords: keywordsCopy})
          e.target.value = poppedTag!
        }
      
        setIsKeyReleased(false)
    }
      
    const onKeyUp = () => {
        setIsKeyReleased(true)
    }

    const deleteKeyword = (index: number) => {
        const keywordsCopy = [...newAgregation.keywords]
        keywordsCopy.splice(index, 1)
        setNewAgreagtion({...newAgregation, keywords: keywordsCopy})
    }

    const changeEndpoint = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // eslint-disable-next-line no-useless-escape
        const re = /^(https?:\/\/.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/gm
        setNewAgreagtion({...newAgregation, url: e.target.value})
        re.test(e.target.value)
            ? setUrlvalidity(false)
            : setUrlvalidity(true)
    }

    

    return {newAgregation, urlInvalid, onKeyDown, onKeyUp, deleteKeyword, changeEndpoint, setNewAgreagtion}

}