const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

const router = new Router();

const { PassThrough } = require('stream');
const request = require('request');

const imageSrc = '/image/cross.jpg';

const news = [
  {
    text: '"После ужина с продюсером меня пригласили на главную роль" - интервью с известной актрисой',
    image: imageSrc,
    timestamp: Date.now() - 1054800000,
  },
  {
    text: '"Седой против Чужого" - майор полиции в отставке борется с инопланетными захватчиками. Скоро на экранах страны',
    image: imageSrc,
    timestamp: Date.now() - 564801000,
  },
  {
    text: '"Гарри Поттер и пробирка с ковидом" - успех или провал нового блокбастера?',
    image: imageSrc,
    timestamp: Date.now() - 367899000,
  },
  {
    text: '"Ну тогда огонь, огонь" - боевик про службу гея в спецназе США. Начало показов на будущей неделе',
    image: imageSrc,
    timestamp: Date.now() - 54545000,
  },
  {
    text: '"Восстание машин" - история одной ошибки программиста на JS. Премьера фильма',
    image: imageSrc,
    timestamp: Date.now() - 3604000,
  },
];

const getNews = () => news.filter((item, index) => index < 2 || Math.random() < 0.75);

router.get('/news/slow', async (ctx) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 5000);
  });
  ctx.response.body = getNews();
});

router.get('/news/broken', async (ctx) => {
  if (Math.random() < 0.5) {
    ctx.response.body = getNews();
  } else {
    ctx.response.status = 500;
    ctx.response.body = { status: 'Internal Error' };
  }
});

router.get(imageSrc, (ctx) => {
  const url = 'https://ahj-12-2.herokuapp.com/img/cross.jpg';
  ctx.set('Content-Type', 'image/jpeg');
  ctx.body = request(url).pipe(PassThrough());
});

router.get('/', async (ctx) => {
  ctx.response.body = 'Сервер работает';
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port);
