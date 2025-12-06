<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import Nav from '$lib/components/custom/Nav.svelte';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>5bytes - Learn with AI-Powered Paths</title>
</svelte:head>
<Nav />
{@render children()}
