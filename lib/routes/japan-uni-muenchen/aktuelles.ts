import { Route } from '@/types';
import ofetch from '@/utils/ofetch'; // Unified request library used
import { parseDate } from '@/utils/parse-date'; // Tool function for parsing dates
import { load } from 'cheerio'; // An HTML parser with an API similar to jQuery
import cache from '@/utils/cache';

export const route: Route = {
    path: '/aktuelles/index.html',
    categories: ['programming'],
    example: '/aktuelles/index.html',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'LMU Japan Zentrum Aktuelles',
    maintainers: [],
    handler: async (ctx) => {
        const baseUrl = 'https://www.japan.uni-muenchen.de/aktuelles';
        const response = await ofetch( `https://www.japan.uni-muenchen.de/aktuelles/index.html`);
        const $ = load(response);
        const list = $('li.meldung')
            // We use the `toArray()` method to retrieve all the DOM elements selected as an array.
            .toArray()
            // We use the `map()` method to traverse the array and parse the data we need from each element.
            .map((item) => {
                item = $(item);
                const a = item.find('a').first();
                return {
                    title: a.text(),
                    // We need an absolute URL for `link`, but `a.attr('href')` returns a relative URL.
                    link: `${baseUrl}/${a.attr('href')}`,
                    pubDate: parseDate(item.find('p.datum').text(), 'DD.MM.YYYY'),
                    image: 'https:' + item.find('img').attr('src'),
                };
            });
          const items = await Promise.all(
            list.map((item) =>
                cache.tryGet(item.link, async () => {
                    const response = await ofetch(item.link);
                    const $ = load(response);

                    // Select the first element with the class name 'comment-body'
                    item.description = $('.hauptinhalt').first().html();

                    // Every property of a list item defined above is reused here
                    // and we add a new property 'description'
                    return item;
                })
            )
        );
        return {
            // channel title
            title: `LMU Japan Zentrum - Aktuelles`,
            // channel link
            link: `https://www.japan.uni-muenchen.de/aktuelles/index.html`,
            // each feed item
            item: items,
        };
    },
};
