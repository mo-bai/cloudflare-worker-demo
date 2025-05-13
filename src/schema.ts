import { createSchema } from 'graphql-yoga';
import { Env } from './index';

export const schema = createSchema<Env>({
	typeDefs: /* GraphQL */ `
		type DeepseekResultMessage {
			role: String!
			content: String!
		}
		type DeepseekResultChoice {
			finish_reason: String!
			index: Int!
			message: DeepseekResultMessage!
		}
		type DeepseekResult {
			id: ID!
			choices: [DeepseekResultChoice!]!
		}
		input QueryMessage {
			role: String!
			content: String!
		}
		type Query {
			chat(message: [QueryMessage!]!): DeepseekResult!
		}
	`,
	resolvers: {
		Query: {
			chat: async (_parent, { message }, { DEEPSEEK_API_KEY }) => {
				try {
					const response = await fetch('https://api.deepseek.com/chat/completions', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
						},
						body: JSON.stringify({
							model: 'deepseek-chat',
							messages: message,
						}),
					});
					if (!response.ok) {
						const errorText = await response.text();
						console.error('Error fetching from Deepseek API:', errorText);
						throw new Error('Failed to fetch from Deepseek API');
					}
					const data = await response.json();
					return data;
				} catch (error) {
					console.error('Error fetching from Deepseek API:', error);
					throw new Error('Failed to fetch from Deepseek API');
				}
			},
		},
	},
});
