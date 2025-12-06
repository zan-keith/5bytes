<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StudiesStore } from './../../../../../lib/store.js';
	import PathDisplay from '$lib/components/custom/PathDisplay.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
    
	let Studies = $StudiesStore;
	let id = $page.params.id;
	let study = $derived(Studies.filter(s => s && s.id).find(s => s.id === id));
	
	let computedStats = $derived(() => {
		if (!study) return {};
		let stats = {};
		study.paths.forEach(p => {
			if (p.quiz && p.quiz.wrongTags) {
				p.quiz.wrongTags.forEach(tag => {
					stats[tag] = (stats[tag] || 0) + 1;
				});
			}
		});
		return stats;
	});
	
	function goBack() {
		goto('/private/dash');
	}
</script>
<div class="flex justify-center">
	{#if study}
		<div class="max-w-4xl w-full p-6">
			<Button onclick={goBack} variant="outline" class="mb-4">← Back to Dashboard</Button>
			<h1 class="text-3xl font-bold mb-4">{study.title}</h1>
			<p class="text-gray-600 mb-6">Prompt: {study.prompt}</p>
			<h2 class="text-2xl font-semibold mb-4">Learning Paths</h2>
			<div class="space-y-4">
				{#each study.paths as path, index}
					<PathDisplay {path} studyId={id} pathId={index} />
				{/each}
			</div>
			<h2 class="text-2xl font-semibold mb-4 mt-8">Analytics: Tags with Wrong Answers</h2>
			{#if computedStats && Object.keys(computedStats).length > 0}
				<pre class="bg-gray-100 p-4 rounded">{JSON.stringify(computedStats, null, 2)}</pre>
			{:else}
				<p>No analytics data available yet.</p>
			{/if}
		</div>
	{:else}
		<p>Study not found.</p>
	{/if}
</div>