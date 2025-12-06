import { json, type RequestHandler } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { studyId, pathId, pathName, pathDescription } = await request.json();

	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You are a helpful assistant for generating educational prework content in markdown format.' },
				{ role: 'user', content: `Generate detailed prework content in markdown format for the following learning path:
				
Path Name: ${pathName}
Description: ${pathDescription}

Provide comprehensive prework material including:
- Key concepts to review
- Recommended resources (links if possible)
- Practice exercises
- Important notes

Format the response as pure markdown text.` },
			],
			max_tokens: 1000,
		});

		const mdContent = completion.choices[0]?.message?.content?.trim() || '# No content generated';

		return json({ mdContent });
	} catch (error) {
		console.error('Error generating prework:', error);
		return json({ error: 'Failed to generate prework' }, { status: 500 });
	}
};