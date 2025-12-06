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

	const { studyId, pathId, pathName, pathDescription, preworkMd } = await request.json();

	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'system', content: 'You are a helpful assistant for generating educational quizzes in JSON format.' },
				{ role: 'user', content: `Based on the following path details, generate a quiz with 5-10 questions. Each question must adhere exactly to the content from the description and prework.

Path Name: ${pathName}
Description: ${pathDescription}
Prework Content: ${preworkMd}

Generate questions that test understanding of the key concepts, with:
- 5 to 10 questions
- Each question: question (string), options (array of up to 4 strings for multiple-choice), answer (correct option), grade (1-10), type ("multiple-choice"), tags (array of strings with related concepts)

Respond in JSON format: {"title": "Quiz Title", "questions": [...]}` },
			],
			max_tokens: 1500,
		});

		const content = completion.choices[0]?.message?.content?.trim() || '{}';
		
		// Remove markdown if present
		let jsonContent = content;
		if (content.startsWith('```json')) {
			jsonContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
		}
		
		let parsed;
		try {
			parsed = JSON.parse(jsonContent);
		} catch (e) {
			console.error('Failed to parse quiz JSON:', jsonContent);
			parsed = { title: 'Quiz', questions: [] };
		}

		// Add graded property to questions
		if (parsed.questions) {
			parsed.questions = parsed.questions.map(q => ({ ...q, graded: false }));
		}

		return json(parsed);
	} catch (error) {
		console.error('Error generating quiz:', error);
		return json({ title: 'Quiz', questions: [] }, { status: 500 });
	}
};