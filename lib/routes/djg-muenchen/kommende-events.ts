import { Route } from '@/types';
import ofetch from '@/utils/ofetch'; // Unified request library used
import { parseDate } from '@/utils/parse-date'; // Tool function for parsing dates

export const route: Route = {
    path: '/kommende-events',
    categories: ['programming'],
    example: '/kommende-events',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'Kommende events',
    maintainers: [],
    handler: async (ctx) => {
        const jsonData = await ofetch(
            `https://calendar.apiboomtech.com/api/published_calendar?comp_id=comp-kim4cwyu&instance=VxOZDWpqNDYIOXVyQN-VaK5MXkB8Kew7qbvBJen4I3Y.eyJpbnN0YW5jZUlkIjoiNTBiNGEwN2MtZWY2OS00NWI2LTk2OWQtNzg1YTFiZGJlOTcxIiwiYXBwRGVmSWQiOiIxM2I0YTAyOC0wMGZhLTcxMzMtMjQyZi00NjI4MTA2YjhjOTEiLCJzaWduRGF0ZSI6IjIwMjQtMDYtMTNUMTY6MDY6MDIuNDg5WiIsInZlbmRvclByb2R1Y3RJZCI6InBybyIsImRlbW9Nb2RlIjpmYWxzZSwiYWlkIjoiNzEwMjk4ZGEtOTRhMy00OTgyLTk4OTQtNjc2MjE1MWRhMTQwIiwic2l0ZU93bmVySWQiOiJjYzFjNWEzMi1hODdiLTRiMGQtOTU1Mi01YTdiZDU5MzI5NTkifQ&originCompId=&time_zone=Europe%2FBerlin`
        );
        const items = jsonData.events.map((item) => ({
            // item title
            title: item.title,
            // item link
            link: 'https://www.djg-muenchen.de/kommende-events',
            // item description
            description: item.desc,
            // item publish date or time
            pubDate: parseDate(item.created_at),
            image: item.image,
        }));
        return {
            // channel title
            title: `Kommende events | DJG Muenchen`,
            // channel link
            link: `https://www.djg-muenchen.de/kommende-events`,
            // each feed item
            item: items,
        };
    },
};
