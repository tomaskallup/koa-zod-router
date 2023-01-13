import Koa from 'koa';
import { z } from 'zod';
import zodRouter from '../src/zod-router';

const app = new Koa();

const router = zodRouter({ zodRouterOpts: { exposeRequestErrors: true, exposeResponseErrors: true } });

router.post(
  '/hello/:id',
  async (ctx, next) => {
    const { foo } = ctx.request.body;
    const { id } = ctx.request.params;
    ctx.body = id;
    await next();
  },
  {
    body: z.object({ foo: z.number() }),
    params: z.object({ id: z.string() }),
  },
);

router.register({
  method: 'post',
  path: '/post',
  pre: async (ctx, next) => {
    //... pre-handler
    await next();
  },
  handlers: [
    async (ctx, next) => {
      const { foo } = ctx.request.body;
      ctx.body = { success: true, second: 'fdsafasd' };
      await next();
    },
  ],
  validate: {
    body: z.object({ foo: z.number() }),
    query: z.object({ bar: z.string() }),
    headers: z.object({ 'x-test-header': z.string() }),
    response: z.object({ success: z.boolean() }).or(z.object({ second: z.string() })),
  },
});

app.use(router.routes());

app.listen(3000, () => {
  console.log('app listening on http://localhost:3000');
});