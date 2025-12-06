<script>
    import StudyTile from "$lib/components/custom/StudyTile.svelte";
    import { Brain } from 'lucide-svelte';
    import * as Item from "$lib/components/ui/item/index.js";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import { StudiesStore } from "$lib/store";

    let prompt = $state("");
    let files = $state();
    let loading = $state(false);

    async function handleSubmit() {
        loading = true;
        console.log("Prompt:", prompt);
        console.log("Files:", files);

        
        let res = await fetch("/private/dash/api/study_init/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
            })
        });

        let data = await res.json();
        console.log("Response:", data.data);

        let studies_local = $StudiesStore;
        StudiesStore.set([...studies_local, data.data]);

        loading = false;
    }
</script>

<div class="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30">
  
  <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-lg">
          <Brain size={20} class="text-white" />
        </div>
        <span class="text-xl font-bold tracking-tight">5bytes</span>
      </div>

      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <a href="/" class="hover:text-white transition-colors">Home</a>
        <a href="#studies" class="hover:text-white transition-colors">Studies</a>
      </div>

      <div class="flex items-center gap-4">
        <button class="px-4 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-zinc-200 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  </nav>

  <section class="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="relative max-w-4xl mx-auto text-center z-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
        <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
        <span class="text-xs font-medium text-purple-300">AI-Powered Study Platform</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
        Welcome to Your <br />
        <span class="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </span>
      </h1>

      <p class="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        Create personalized study plans and track your progress with AI-powered learning.
      </p>

      <form class="flex flex-col space-y-4 w-full max-w-md mx-auto" on:submit|preventDefault={handleSubmit}>
        <textarea
          placeholder="Type your prompt here..."
          class="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none resize-none"
          rows="4"
          bind:value={prompt}
        ></textarea>
        <input
          type="file"
          multiple
          class="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white file:bg-purple-600 file:text-white file:border-none file:rounded file:px-3 file:py-1 file:mr-3 hover:file:bg-purple-700"
          bind:files={files}
        />
        <button
          type="submit"
          class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
        >
          Create Study Plan
        </button>
      </form>
    </div>
  </section>

  <section id="studies" class="py-24 px-6 bg-[#0a0a0c]">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Your Studies</h2>
        <p class="text-zinc-400">Track your progress and continue learning</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each $StudiesStore.filter(s => s && s.id) as study}
          <StudyTile {study} />
        {/each}
      </div>
    </div>
  </section>

  {#if loading}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
        <Item.Root variant="muted">
          <Item.Media>
            <Spinner />
          </Item.Media>
          <Item.Content>
            <Item.Title class="line-clamp-1">Creating Your Personalized Study Plan</Item.Title>
          </Item.Content>
        </Item.Root>
      </div>
    </div>
  {/if}

  <footer class="py-8 border-t border-white/5 text-center text-zinc-600 text-sm">
    <div class="flex items-center justify-center gap-2 mb-4">
      <div class="p-1 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-lg">
        <Brain size={14} class="text-white" />
      </div>
      <span class="text-zinc-200 font-bold">5bytes</span>
    </div>
    <p>&copy; 2024 5bytes. All rights reserved.</p>
  </footer>
</div>