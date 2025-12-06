<script>
    let prompt = $state("");
    let files = $state([]);
      import * as Item from "$lib/components/ui/item/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
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
    </div>
</div>