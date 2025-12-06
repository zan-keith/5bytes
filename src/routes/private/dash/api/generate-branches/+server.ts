import { json, type RequestHandler } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

const generate_branches = async ({ tags, pathName, pathDescription }) => {
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You are a helpful assistant for study planning. Generate detailed sub-paths for specific topics in JSON format.' },
				{ role: 'user', content: `The user struggled with the following tags in a quiz: ${tags.join(', ')}.
For the path "${pathName}" with description "${pathDescription}", generate additional sub-paths to help master these weak areas.
Generate an array of sub-paths, each with:
- name: string (very specific step to address the tag)
- description: string (brief explanation)
- branches: optional array of even finer sub-paths
- done: boolean (set to false)
- prework: object (title: "", links: [], md_content: "")
- quiz: object (title: "", questions: [])

Focus on creating targeted sub-paths for the weak tags.

Respond in JSON format with key: "branches" as array.` },
			],
			max_tokens: 1500,
		});

		const content = completion.choices[0]?.message?.content?.trim() || '{"branches": []}';
		let parsed;
		try {
			parsed = JSON.parse(content);
		} catch (e) {
			console.error('Failed to parse AI response as JSON:', content);
			parsed = { branches: [] };
		}

		return parsed.branches || [];
	} catch (error) {
		console.error('Error fetching from OpenAI:', error);
		return [];
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { studyId, pathId, tags, pathName, pathDescription } = await request.json();

	const branches = await generate_branches({ tags, pathName, pathDescription });

	return json({ branches });
};