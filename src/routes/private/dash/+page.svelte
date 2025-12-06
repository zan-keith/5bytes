<script>
    import StudyTile from "$lib/components/custom/StudyTile.svelte";

    let prompt = $state("");
    let files = $state([]);
      import * as Item from "$lib/components/ui/item/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  console.log("StudiesStore:", $StudiesStore);
    import { StudiesStore } from "$lib/store";
    let loading = $state(false);
    async function handleSubmit() {
        loading = true;
        // Handle form submission logic here
        console.log("Prompt:", prompt);
        console.log("Files:", files);
        let res = await fetch("dash/api/study_init/", {
            method: "POST",
            body: JSON.stringify({ prompt, files }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        let data = await res.json();
        console.log("Response:", data.data);

        let studies_local=$StudiesStore;
        StudiesStore.set([...studies_local, data.data]);

        loading = false
    }
</script>
<div class="w-full flex justify-center h-screen">
    <div class="flex flex-col items-center justify-center space-y-4">
        <h1 class="text-2xl font-bold">
            Welcome to 5bytes Dashboard!
        </h1>

        <form class="flex flex-col space-y-4 w-full max-w-md" on:submit|preventDefault={handleSubmit}>
            <textarea
                placeholder="Type your prompt here..."
                class="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows="4"
                bind:value={prompt}
            ></textarea>
{prompt}
            <input
                type="file"
                multiple
                class="w-full p-2 border border-gray-300 rounded-md"
  
            />

            {files.length}
{JSON.stringify(files)}
            <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Submit
            </button>
        </form>

        {#if loading}
            <div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
  <Item.Root variant="muted">
    <Item.Media>
      <Spinner />
    </Item.Media>
    <Item.Content>
      <Item.Title class="line-clamp-1">Creating Your Personalized Study Plan</Item.Title>
    </Item.Content>
    <Item.Content class="flex-none justify-end">
    </Item.Content>
  </Item.Root>
</div>
        {/if}

<div class="w-full grid">

</div>
<section class="py-12 md:py-20">
  <div class="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
    <div
      class="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12"
    >
    <div
      class="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3"
    >
{#each $StudiesStore as study}
    <StudyTile {study} />
{/each}
    </div>
  </div>
</section>

    </div>


</div>