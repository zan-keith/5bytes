<script>
    import Badge from "../ui/badge/badge.svelte";
    import Button from "../ui/button/button.svelte";

	let { path, pathId, studyId } = $props();
</script>

<a href="/private/dash/study/{studyId}/path/{pathId}" class="block border rounded-lg p-4 hover:bg-gray-50 transition-colors {path.done ? 'bg-green-50 border-green-200' : ''}">
	<h3 class="text-xl font-medium">{path.name}</h3>
	<p class="text-gray-700 mb-2">{path.description}</p>
	<p class="text-sm text-gray-500">Status: <Badge variant={path.done ? 'default' : 'outline'}>{path.done ? 'Completed' : 'Pending'}</Badge></p>
    {#if path.prework && path.prework.title}
        <p class="text-sm text-gray-500 mt-2">Prework: {path.prework.title}</p>
    {/if}
    {#if path.quiz && path.quiz.done && path.quiz.wrongQuestions && path.quiz.wrongQuestions.length > 0}
        {@const tagMap = path.quiz.questions.reduce((acc, q, idx) => {
            if (path.quiz.wrongQuestions.includes(idx + 1) && q.tags) {
                q.tags.forEach(tag => acc[tag] = (acc[tag] || 0) + 1);
            }
            return acc;
        }, {})}
        {#if Object.keys(tagMap).length > 1}
        <div class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p class="text-sm font-medium text-red-800">Incorrect Tags:</p>
            <div class="flex flex-wrap gap-1 mt-1">
                {#each Object.entries(tagMap) as [tag, count]}
                    <span class="inline-block bg-red-200 text-red-900 text-xs px-2 py-1 rounded">{tag} ({count})</span>
                {/each}
            </div>
        </div>
        {/if}
    {/if}
</a>