<script>
    import Badge from "../ui/badge/badge.svelte";
    import Button from "../ui/button/button.svelte";

	let { path, pathId, studyId } = $props();
</script>

<a href="/private/dash/study/{studyId}/path/{pathId}" class="block border rounded-lg p-4 hover:bg-gray-50 transition-colors">
	<h3 class="text-xl font-medium">{path.name}</h3>
	<p class="text-gray-700 mb-2">{path.description}</p>
	<p class="text-sm text-gray-500">Status: <Badge variant="outline">{path.done ? 'Completed' : 'Pending'}</Badge></p>
    {#if path.prework && path.prework.title}
        <p class="text-sm text-gray-500 mt-2">Prework: {path.prework.title}</p>
    {/if}
</a>