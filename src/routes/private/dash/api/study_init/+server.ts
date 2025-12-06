import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { json, type RequestHandler } from '@sveltejs/kit';

import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';
import type { PageServerLoad } from './$types';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

export const load: PageServerLoad = async () => {
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You are a helpful assistant for study planning.' },
				{ role: 'user', content: 'Generate a short daily study tip.' },
			],
			max_tokens: 100,
		});

		const tip = completion.choices[0]?.message?.content?.trim() || 'Keep studying regularly!';

		return {
			tip,
		};
	} catch (error) {
		console.error('Error fetching from OpenAI:', error);
		return {
			tip: 'Unable to load study tip at the moment.',
		};
	}
};

export const POST: RequestHandler = async ({ request, params ,locals}) => {

  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

      const { 
prompt,
files
    } = await request.json();



    return json({ message: 'Study initialized successfully', data: { prompt, files } });
};