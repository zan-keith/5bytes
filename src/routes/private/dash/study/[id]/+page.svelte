<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StudiesStore } from './../../../../../lib/store.js';
	import PathDisplay from '$lib/components/custom/PathDisplay.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
    
	let Studies = $StudiesStore;
	let id = $page.params.id;
	let study = $derived(Studies.find(s => s.id === id));
	
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
		</div>
	{:else}
		<p>Study not found.</p>
	{/if}
</div>