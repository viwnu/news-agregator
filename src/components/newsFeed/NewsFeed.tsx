const newsArray = [
    {
        title: 'Title',
        article: 'Article',
    },
    {
        title: 'Title1',
        article: 'Article1',
    },
    {
        title: 'Title2',
        article: 'Article2',
    }
]
export default function NewsFeed() {
    return (
        <section>
            <ul>
                {newsArray.map((item, index) => {
                    return (
                        <li key={index}>
                            <h3> { item.title } </h3>
                            <p> { item.article } </p>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}