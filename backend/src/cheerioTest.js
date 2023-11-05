cheerio = require('cheerio')

const $ = cheerio.load(
    `<div>
        <h3 class='hello' >
            <div>
                <a>Item1</a>
            </div>
        </h3>
        <h3 class='hello' >
            <div>
                <a>Item2</a>
            </div>
        </h3>
        <h3 class='hello' >
            <div>
                <a>Item3</a>
            </div>
        </h3>
    </div>`
  );
  
  const list = $('h3')

//   console.log(list.text())

  list.each((i, elem) => {
    console.log($(elem).find('a').text())
  })