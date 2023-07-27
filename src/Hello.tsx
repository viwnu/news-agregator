let count = 0

const user ={
    name: 'alex',
    surname: 'loh'
}

const Hello = () => {
    count++
    return (
        <>
            <h1>Hello from React with Typescript!</h1>
            <span>{count}</span>
            <br />
            <span>{`${user.name} ${user.surname}`}</span>
        </>
    )
}

export default Hello;