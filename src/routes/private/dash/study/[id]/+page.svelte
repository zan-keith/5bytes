<script>
	import { page } from '$app/stores';
	import { StudiesStore } from './../../../../../lib/store.js';
    
	let Studies = $StudiesStore;
	let id = $page.params.id;
	let study = $derived(Studies.find(s => s.id === id));
</script>
<div class="flex justify-center">
	{#if study}
		<div class="max-w-4xl w-full p-6">
			<h1 class="text-3xl font-bold mb-4">{study.title}</h1>
			<p class="text-gray-600 mb-6">Prompt: {study.prompt}</p>
			<h2 class="text-2xl font-semibold mb-4">Learning Paths</h2>
			<div class="space-y-4">
				{#each study.paths as path, index}
					<div class="border rounded-lg p-4">
						<h3 class="text-xl font-medium">{path.name}</h3>
						<p class="text-gray-700">{path.description}</p>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<p>Study not found.</p>
	{/if}
</div>