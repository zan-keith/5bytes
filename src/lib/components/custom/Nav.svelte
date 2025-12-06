<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Home, Lock, LogIn, ExternalLink, Menu, X } from 'lucide-svelte';

	let isOpen = $state(false);
</script>

<nav class="flex items-center justify-between p-4 border-b bg-background">
	<div class="flex items-center space-x-2">
		<a href="/" class="text-xl font-bold">5bytes</a>
	</div>

	<!-- Desktop Menu -->
	<div class="hidden md:flex items-center space-x-2">
		<Button variant="ghost" href="/" class="flex items-center space-x-2">
			<Home class="w-4 h-4" />
			<span>Home</span>
		</Button>
		<Button variant="ghost" href="/private/dash" class="flex items-center space-x-2">
			<Lock class="w-4 h-4" />
			<span>Private</span>
		</Button>
		<Button variant="ghost" href="/auth" class="flex items-center space-x-2">
			<LogIn class="w-4 h-4" />
			<span>Login</span>
		</Button>
		<Button variant="outline" href="https://premkumarr.app.n8n.cloud/form/326c8989-efda-4910-a571-bffa1e28c07c" target="_blank" class="flex items-center space-x-2">
			<ExternalLink class="w-4 h-4" />
			<span>Create Alerts</span>
		</Button>
	</div>

	<!-- Mobile Menu Button -->
	<Button variant="ghost" size="icon" class="md:hidden" onclick={() => isOpen = !isOpen}>
		{#if isOpen}
			<X class="w-4 h-4" />
		{:else}
			<Menu class="w-4 h-4" />
		{/if}
	</Button>
</nav>

<!-- Mobile Menu -->
{#if isOpen}
	<div class="md:hidden flex flex-col space-y-2 p-4 border-b bg-background">
		<Button variant="ghost" href="/" class="flex items-center space-x-2 justify-start" onclick={() => isOpen = false}>
			<Home class="w-4 h-4" />
			<span>Home</span>
		</Button>
		<Button variant="ghost" href="/private/dash" class="flex items-center space-x-2 justify-start" onclick={() => isOpen = false}>
			<Lock class="w-4 h-4" />
			<span>Private</span>
		</Button>
		<Button variant="ghost" href="/auth" class="flex items-center space-x-2 justify-start" onclick={() => isOpen = false}>
			<LogIn class="w-4 h-4" />
			<span>Login</span>
		</Button>
		<Button variant="outline" href="https://premkumarr.app.n8n.cloud/form/326c8989-efda-4910-a571-bffa1e28c07c" target="_blank" class="flex items-center space-x-2 justify-start" onclick={() => isOpen = false}>
			<ExternalLink class="w-4 h-4" />
			<span>Create Alerts</span>
		</Button>
	</div>
{/if}