import * as cheerio from 'cheerio';

//ts-ignores because cheerio is shitty and typed in weird way :))))
export const readlyParser = html => {
  const $ = cheerio.load(html);
  const title = $('a', '.blvi__title').text();
  const authors = [];
  const genres = [];
  let year = '';
  const description = $('.book--desc').text();
  const imgTemp = $('a', '.blvi__image').children()[0].attribs.src.split('');
  imgTemp.splice(-9, 2, '2', '0');
  const img = 'https://readly.ru' + imgTemp.join('');
  $('*', '.blvi__book_info').each((i, el) => {
    //@ts-ignore
    if (el.name === 'a') {
      //@ts-ignore
      if (el.attribs.href.includes('genre'))
        //@ts-ignore
        genres.push(el.children[0].data);
      //@ts-ignore
      else authors.push(el.children[0].data);
    }
    if (el.next.type === 'text') {
      //@ts-ignore
      if (el.next.data.match(/[0-9]/)) {
        //@ts-ignore
        let temp = el.next.data
          .split('')
          .filter(sym => sym.match(/[0-9]/))
          .join('');
        year = temp;
      }
    }
  });

  return {
    title: title,
    authors: authors,
    genres: genres,
    year: year,
    description: description,
    cover: img,
  };
};
