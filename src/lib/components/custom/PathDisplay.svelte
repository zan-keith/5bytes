<script>
    import Badge from "../ui/badge/badge.svelte";
    import Button from "../ui/button/button.svelte";
    import { StudiesStore } from "$lib/store.js";

    let { path, pathId, studyId } = $props();

    let isQuizGraded = $derived(() => {
        const doneValue = path?.quiz?.done;
        return doneValue === true || doneValue === 'true';
    });

    let incorrectTagMap = $derived(() => {
        if (!isQuizGraded) {
            return {};
        }
        const counts = {};
        if (Array.isArray(path?.quiz?.wrongTags)) {
            path.quiz.wrongTags.forEach((tag) => {
                if (!tag) return;
                counts[tag] = (counts[tag] || 0) + 1;
            });
        }
        if (Object.keys(counts).length === 0 && Array.isArray(path?.quiz?.wrongQuestions) && Array.isArray(path?.quiz?.questions)) {
            path.quiz.questions.forEach((question, idx) => {
                if (!path.quiz.wrongQuestions.includes(idx + 1)) {
                    return;
                }
                if (Array.isArray(question.tags)) {
                    question.tags.forEach((tag) => {
                        if (!tag) return;
                        counts[tag] = (counts[tag] || 0) + 1;
                    });
                } else if (question.tag) {
                    counts[question.tag] = (counts[question.tag] || 0) + 1;
                }
            });
        }
        return counts;
    });

    let hasIncorrectTags = $derived(() => isQuizGraded && Object.keys(incorrectTagMap).length > 0);

    let generatingBranches = $state(false);
    let branchError = $state('');
    let branchSuccess = $state('');

    async function generateAdaptivePaths(event) {
        event?.preventDefault();
        event?.stopPropagation();
        branchError = '';
        branchSuccess = '';
        if (generatingBranches) {
            return;
        }
        generatingBranches = true;
        try {
            const tags = hasIncorrectTags ? Object.keys(incorrectTagMap) : [];
            const response = await fetch('/private/dash/api/generate-branches/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studyId,
                    pathId: Number(pathId),
                    tags,
                    pathName: path?.name,
                    pathDescription: path?.description
                })
            });
            if (!response.ok) {
                throw new Error(`Failed to generate branches: ${response.status}`);
            }
            const data = await response.json();
            const newBranches = Array.isArray(data?.branches) ? data.branches.filter(Boolean) : [];
            if (newBranches.length === 0) {
                branchError = 'No adaptive branches returned.';
                return;
            }
            const updatedStudies = $StudiesStore.filter((s) => s && s.id).map((s) =>
                s.id === studyId
                    ? {
                        ...s,
                        paths: s.paths.map((p, idx) => {
                            if (idx === Number(pathId)) {
                                const existingBranches = Array.isArray(p.branches) ? p.branches : [];
                                return {
                                    ...p,
                                    branches: [...existingBranches, ...newBranches]
                                };
                            }
                            return p;
                        })
                    }
                    : s
            );
            StudiesStore.set(updatedStudies);
            branchSuccess = `${newBranches.length} new ${newBranches.length === 1 ? 'branch' : 'branches'} added.`;
        } catch (error) {
            console.error('Error generating branches:', error);
            branchError = 'Failed to create adaptive branch.';
        } finally {
            generatingBranches = false;
        }
    }
</script>

<a href="/private/dash/study/{studyId}/path/{pathId}" class="block border rounded-lg p-4 hover:bg-gray-50 transition-colors {path.done ? 'bg-green-50 border-green-200' : ''}">
	<h3 class="text-xl font-medium">{path.name}</h3>
	<p class="text-gray-700 mb-2">{path.description}</p>
	<p class="text-sm text-gray-500">Status: <Badge variant={path.done ? 'default' : 'outline'}>{path.done ? 'Completed' : 'Pending'}</Badge></p>

    {#if path.done}
    <Button class="mt-2 cursor-pointer" variant="secondary" onclick={generateAdaptivePaths} disabled={generatingBranches}>
        {generatingBranches ? 'Generating...' : 'Generate Adaptive Learning Paths'}
    </Button>
    <p class="text-xs">It will create personalized learning paths based on your progress and performance.</p>
    {#if branchError}
        <p class="text-xs text-red-700 mt-1">{branchError}</p>
    {/if}
    {#if branchSuccess}
        <p class="text-xs text-green-700 mt-1">{branchSuccess}</p>
    {/if}
    {/if}

</a>

{#if path.branches && path.branches.length > 0}
    <div class="mt-4 ml-4 border-l-2 border-gray-300 pl-4">
        {#each path.branches as branch, branchIndex}
            <div class="block border rounded-lg p-3 mb-2 bg-gray-50 hover:bg-gray-100 transition-colors {branch.done ? 'bg-green-50 border-green-200' : ''}">
                <h5 class="text-md font-medium">{branch.name}</h5>
                <p class="text-gray-600 text-sm mb-1">{branch.description}</p>
                <p class="text-xs text-gray-500">Status: <Badge variant={branch.done ? 'default' : 'outline'}>{branch.done ? 'Completed' : 'Pending'}</Badge></p>
                {#if branch.branches && branch.branches.length > 0}
                    <div class="mt-2 ml-4 border-l-2 border-gray-200 pl-4">
                        <h6 class="text-sm font-medium mb-1">Sub-branches:</h6>
                        {#each branch.branches as subBranch, subIndex}
                            <div class="block border rounded p-2 mb-1 bg-white hover:bg-gray-50 transition-colors {subBranch.done ? 'bg-green-50 border-green-200' : ''}">
                                <h6 class="text-sm font-medium">{subBranch.name}</h6>
                                <p class="text-gray-500 text-xs">{subBranch.description}</p>
                                <p class="text-xs text-gray-400">Status: <Badge variant={subBranch.done ? 'default' : 'outline'} size="sm">{subBranch.done ? 'Completed' : 'Pending'}</Badge></p>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{/if}