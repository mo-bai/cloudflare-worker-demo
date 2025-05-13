/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createYoga } from 'graphql-yoga';
import { schema } from './schema';

export interface Env {
	DEEPSEEK_API_KEY: string;
	ENVIRONMENT?: 'production';
}

const yoga = createYoga<Env>({
	schema: schema,
	graphiql: (request, env) => {
		console.log('Request env:', env);
		return env.ENVIRONMENT !== 'production';
	},
});

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return yoga.fetch(request, env);
	},
};
