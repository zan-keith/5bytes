<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StudiesStore } from '$lib/store.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { marked } from 'marked';
    import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	let Studies = $StudiesStore;
	let studyId = $page.params.id;
	let pathId = $page.params.pathId;
	let study = $derived(Studies.find(s => s.id === studyId));
	let path = $derived(study ? study.paths[parseInt(pathId)] : null);
	
    console.log("Loaded path:", path);
	let notes = $state('');
	let quizAnswers = $state({});
	let generatingPrework = $state(false);
	
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
				const updatedStudies = Studies.map(s => 
					s.id === studyId 
						? { ...s, paths: s.paths.map((p, i) => 
							i === parseInt(pathId) 
								? { ...p, prework: { ...p.prework, md_content: data.mdContent } }
								: p
						)}
						: s
				);
				StudiesStore.set(updatedStudies);
			}
		} catch (error) {
			console.error('Error generating prework:', error);
		} finally {
			generatingPrework = false;
		}
	}
	
	$effect(() => {
		if (path && !path.prework?.md_content && !generatingPrework) {
			generatePrework();
		}
	});
	
	function markDone() {
		// TODO: update the store
		path.done = true;
		StudiesStore.set(Studies);
	}
	
	function goBack() {
		goto(`/private/dash/study/${studyId}`);
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
	
	<Tabs.Root value="prework" class="w-full">
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
			{#if path.quiz && path.quiz.questions && path.quiz.questions.length > 0}
				<h3 class="text-xl font-semibold mb-4">{path.quiz.title}</h3>
				{#each path.quiz.questions as question, qIndex}
					<div class="mb-6">
						<p class="font-medium mb-2">{question.question}</p>
						{#if question.type === 'multiple-choice' && question.options}
							<div class="space-y-2">
								{#each question.options as option, oIndex}
									<label class="flex items-center">
										<input 
											type="radio" 
											name="q{qIndex}" 
											value={option} 
											bind:group={quizAnswers[qIndex]}
											class="mr-2"
										/>
										{option}
									</label>
								{/each}
							</div>
						{:else if question.type === 'true-false'}
							<div class="space-y-2">
								<label class="flex items-center">
									<input type="radio" name="q{qIndex}" value="true" bind:group={quizAnswers[qIndex]} class="mr-2" />
									True
								</label>
								<label class="flex items-center">
									<input type="radio" name="q{qIndex}" value="false" bind:group={quizAnswers[qIndex]} class="mr-2" />
									False
								</label>
							</div>
						{:else}
							<Textarea 
								placeholder="Your answer..." 
								bind:value={quizAnswers[qIndex]} 
								class="w-full"
							/>
						{/if}
						{#if quizAnswers[qIndex]}
							<p class="text-sm text-gray-600 mt-2">
								Correct answer: {question.answer} (Grade: {question.grade})
							</p>
						{/if}
					</div>
				{/each}
			{:else}
				<p>No quiz available for this path.</p>
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</div>
{:else}
<p>Path not found.</p>
{/if}