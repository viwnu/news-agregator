import { ReactNode } from 'react'

interface FooProps {
  // look here 👇
  children: ReactNode
}

export default function Container({children}: FooProps) {
    return (
        <div>
            {children}
        </div>
    )
}