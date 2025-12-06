<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StudiesStore } from '$lib/store.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { marked } from 'marked';
	import katex from 'marked-katex-extension';
	import 'katex/dist/katex.min.css';

	marked.use(katex({
		throwOnError: false,
		displayMode: true,
		leqno: false,
		fleqn: false,
		macros: {},
		colorIsTextColor: false,
		strict: false
	}));
    import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	let studyId = $page.params.id;
	let pathId = $page.params.pathId;
	let study = $derived($StudiesStore.find(s => s.id === studyId));
	let path = $derived(study ? study.paths[parseInt(pathId)] : null);
	
    console.log("Loaded path:", path);
	let notes = $state('');
	let quizAnswers = $state({});
	let generatingPrework = $state(false);
	let hasGeneratedPrework = $state(false);
	let generatingQuiz = $state(false);
	let hasGeneratedQuiz = $state(false);
	let activeTab = $state('prework');
	let quizScore = $state(0);
	let isGraded = $state(false);
	
	async function generatePrework() {
		if (!path || path.prework?.md_content || generatingPrework) return;
		
		generatingPrework = true;
		try {
			const res = await fetch('/private/dash/api/generate-prework/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					studyId,
					pathId,
					pathName: path.name,
					pathDescription: path.description
				})
			});
			
			const data = await res.json();
			if (data.mdContent) {
				// Update the store
				const updatedStudies = $StudiesStore.map(s => 
					s.id === studyId 
						? { ...s, paths: s.paths.map((p, i) => 
							i === parseInt(pathId) 
								? { ...p, prework: { ...p.prework, md_content: data.mdContent } }
								: p
						)}
						: s
				);
				StudiesStore.set(updatedStudies);
                console.log("Updated path with prework:", data.mdContent);
			}
		} catch (error) {
			console.error('Error generating prework:', error);
		} finally {
			generatingPrework = false;
		}
	}
	
	async function generateQuiz() {
		if (!path || (path.quiz?.questions && path.quiz.questions.length > 0) || generatingQuiz || hasGeneratedQuiz) return;
		
		generatingQuiz = true;
		try {
			const res = await fetch('/private/dash/api/generate-quiz/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					studyId,
					pathId,
					pathName: path.name,
					pathDescription: path.description,
					preworkMd: path.prework?.md_content || ''
				})
			});
			
			const data = await res.json();
			if (data.questions && data.questions.length > 0) {
				// Update the store
				const updatedStudies = $StudiesStore.map(s => 
					s.id === studyId 
						? { ...s, paths: s.paths.map((p, i) => 
							i === parseInt(pathId) 
								? { ...p, quiz: { title: data.title || 'Quiz', questions: data.questions, done: false } }
								: p
						)}
						: s
				);
				StudiesStore.set(updatedStudies);
				hasGeneratedQuiz = true;
			}
		} catch (error) {
			console.error('Error generating quiz:', error);
		} finally {
			generatingQuiz = false;
		}
	}
	
	$effect(() => {
		if (path && !path.prework?.md_content && !hasGeneratedPrework) {
			generatePrework();
		}
	});
	
	$effect(() => {
		if (activeTab === 'quiz' && path && (!path.quiz || !path.quiz.questions || path.quiz.questions.length === 0) && !hasGeneratedQuiz) {
			generateQuiz();
		}
	});
	
	$effect(() => {
		if (path && path.quiz && path.quiz.done) {
			isGraded = true;
			quizScore = path.quiz.score || 0;
		}
	});
	
	function markDone() {
		// TODO: update the store
		const updatedStudies = $StudiesStore.map(s => 
			s.id === studyId 
				? { ...s, paths: s.paths.map((p, i) => 
					i === parseInt(pathId) 
						? { ...p, done: true }
						: p
				)}
				: s
		);
		StudiesStore.set(updatedStudies);
	}
	
	function goBack() {
		goto(`/private/dash/study/${studyId}`);
	}
	
	function gradeQuiz() {
		if (!path.quiz || !path.quiz.questions || path.quiz.done) return;
		
		let score = 0;
		let wrongTags = [];
		let wrongQuestions = [];
		path.quiz.questions.forEach((question, index) => {
			if (quizAnswers[index] === question.answer) {
				score += question.grade;
			} else {
				wrongTags.push(question.tag);
				wrongQuestions.push(index + 1); // 1-based
			}
		});
		quizScore = score;
		
		// Mark quiz as done
		const updatedStudies = $StudiesStore.map(s => 
			s.id === studyId 
				? (() => {
					let newStats = { ...(s.stats || {}) };
					wrongTags.forEach(tag => {
						newStats[tag] = (newStats[tag] || 0) + 1;
					});
					return { ...s, paths: s.paths.map((p, i) => 
						i === parseInt(pathId) 
							? { ...p, quiz: { ...p.quiz, done: true, score, wrongTags, wrongQuestions, questions: p.quiz.questions.map((q, idx) => ({...q, grade: quizAnswers[idx] === q.answer ? 'correct' : 'incorrect'})) } }
							: p
					), stats: newStats };
				})()
				: s
		);
		StudiesStore.set(updatedStudies);
		
		// Console log the updated stats
		const updatedStudy = updatedStudies.find(s => s.id === studyId);
		if (updatedStudy) {
			const tagsWithWrongs = Object.entries(updatedStudy.stats).filter(([tag, count]) => count > 0);
			console.log('Tags with wrong answers:', tagsWithWrongs);
		}
	}
</script>

{#if path}
<div class="max-w-4xl mx-auto p-6">
	<Button onclick={goBack} variant="outline" class="mb-4">← Back to Study</Button>
	<h1 class="text-3xl font-bold mb-4">{path.name}</h1>
	<p class="text-gray-700 mb-4">{path.description}</p>
	<p class="mb-4">Status: <Badge variant={path.done ? 'default' : 'outline'}>{path.done ? 'Completed' : 'Pending'}</Badge></p>
	
	{#if !path.done}
		<Button onclick={markDone} class="mb-4">Mark as Done</Button>
	{/if}
	
	<Tabs.Root bind:value={activeTab} class="w-full">
		<Tabs.List class="grid w-full grid-cols-3">
			<Tabs.Trigger value="prework">Prework</Tabs.Trigger>
			<Tabs.Trigger value="notes">Notes</Tabs.Trigger>
			<Tabs.Trigger value="quiz">Quiz</Tabs.Trigger>
		</Tabs.List>
		
		<Tabs.Content value="prework" class="mt-4">
			{#if generatingPrework}
				<div class="flex items-center justify-center p-8">
					<Spinner />
					<span class="ml-2">Generating prework content...</span>
				</div>
			{:else if path.prework?.md_content}
				<div class="prose max-w-none">{@html marked.parse(path.prework.md_content)}</div>
			{:else}
				<p>No prework available.</p>
			{/if}
		</Tabs.Content>
		
		<Tabs.Content value="notes" class="mt-4">
			<Textarea 
				placeholder="Take notes here..." 
				bind:value={notes} 
				class="w-full h-64 resize-none"
			/>
		</Tabs.Content>
		
		<Tabs.Content value="quiz" class="mt-4">
			{#if generatingQuiz}
				<div class="flex items-center justify-center p-8">
					<Spinner />
					<span class="ml-2">Generating quiz...</span>
				</div>
			{:else if path.quiz && path.quiz.questions && path.quiz.questions.length > 0}
				<h3 class="text-xl font-semibold mb-4">{path.quiz.title}</h3>
				{#if path.quiz.done}
					<p class="text-lg font-bold mb-4">Quiz Completed - Total Score: {quizScore}</p>
				{:else if !isGraded}
					<Button onclick={gradeQuiz} class="mb-4">Grade Quiz</Button>
				{:else}
					<p class="text-lg font-bold mb-4">Total Score: {quizScore}</p>
				{/if}
				{#each path.quiz.questions as question, qIndex}
					<div class="mb-6">
						<p class="font-medium mb-2">{question.question}</p>
						{#if question.tags && question.tags.length > 0}
							<div class="mb-2">
								{#each question.tags as tag}
									<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">{tag}</span>
								{/each}
							</div>
						{/if}
						{#if question.type === 'multiple-choice' && question.options}
							<div class="space-y-2">
								{#each question.options as option, oIndex}
									<label class="flex items-center p-2 rounded {isGraded && option === question.answer ? 'bg-green-100' : ''} {isGraded && option === quizAnswers[qIndex] && option !== question.answer ? 'bg-red-100' : ''}">
										<input 
											type="radio" 
											name="q{qIndex}" 
											value={option} 
											bind:group={quizAnswers[qIndex]}
											class="mr-2"
											disabled={isGraded}
										/>
										{option}
									</label>
								{/each}
							</div>
						{:else if question.type === 'true-false'}
							<div class="space-y-2">
								<label class="flex items-center p-2 rounded {isGraded && 'true' === question.answer ? 'bg-green-100' : ''} {isGraded && 'true' === quizAnswers[qIndex] && 'true' !== question.answer ? 'bg-red-100' : ''}">
									<input type="radio" name="q{qIndex}" value="true" bind:group={quizAnswers[qIndex]} class="mr-2" disabled={isGraded} />
									True
								</label>
								<label class="flex items-center p-2 rounded {isGraded && 'false' === question.answer ? 'bg-green-100' : ''} {isGraded && 'false' === quizAnswers[qIndex] && 'false' !== question.answer ? 'bg-red-100' : ''}">
									<input type="radio" name="q{qIndex}" value="false" bind:group={quizAnswers[qIndex]} class="mr-2" disabled={isGraded} />
									False
								</label>
							</div>
						{:else}
							<Textarea 
								placeholder="Your answer..." 
								bind:value={quizAnswers[qIndex]} 
								class="w-full"
								disabled={isGraded}
							/>
						{/if}
					</div>
				{/each}
				{#if isGraded && path.quiz.wrongQuestions && path.quiz.wrongQuestions.length > 0}
					<p class="mt-4 text-red-600">Wrong questions: {path.quiz.wrongQuestions.join(', ')}</p>
				{/if}
			{:else}
				<p>No quiz available for this path.</p>
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</div>
{:else}
<p>Path not found.</p>
{/if}