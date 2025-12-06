import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { json, type RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});



const openai_req = async ({prompt, files}) => {
	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You are a helpful assistant for study planning. Generate detailed, structured study plans in JSON format. Focus on major milestones with specific, actionable steps.' },
				{ role: 'user', content: `Based on the following prompt: "${prompt}", generate a study plan with:
- A study title
- An array of learning paths, each representing a major milestone. Each path should have:
  - name: string (specific and actionable)
  - description: string (detailed explanation of what this milestone covers)
  - branches: optional array of sub-paths (for breaking down complex milestones)
  - done: boolean (set to false)
  - prework: object with title (string), links (array of strings), md_content (string with markdown content for preparation)
  - quiz: object with title (string), questions (array of objects with question, options (array for multiple-choice), 
  answer, grade (number 1-10), type ("multiple-choice", "true-false", or "short-answer"))

Make paths very specific, with steps well broken down but only for major milestones. Ensure the plan is comprehensive yet focused on key learning objectives.

Respond in JSON format with keys: "title" and "paths".` },
			],
			max_tokens: 2000,
		});

		const content = completion.choices[0]?.message?.content?.trim() || '{}';
		let parsed;
		try {
			parsed = JSON.parse(content);
		} catch (e) {
			console.error('Failed to parse AI response as JSON:', content);
			parsed = { title: 'Study Plan', paths: [] };
		}

		return parsed;
	} catch (error) {
		console.error('Error fetching from OpenAI:', error);
		return {
			title: 'Study Plan',
			paths: [],
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

    const aiResponse = await openai_req({ prompt, files });

    console.log('AI Response:', aiResponse);

    const id = randomUUID();

    return json({ message: 'Study initialized successfully', data: { id, prompt, files, title: aiResponse.title, paths: aiResponse.paths } });
};