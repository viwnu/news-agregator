import Container from '../components/container/Container'
import Header from '../components/header/Header'
import NewsFeed from '../components/newsFeed/NewsFeed'

export default function App() {
    return (
        <>
            <Container>
                <h1>News Agregator</h1>
                <Header/>
                <NewsFeed/>
            </Container>
        </>
    )
}