<script lang="ts">
	import "$lib/styles.scss";
	import { page } from '$app/stores';
	import { Sidebar } from '$lib/ui/kit';
	import { Toaster } from 'svelte-french-toast';
</script>

<div class="app">
	<Sidebar />
	<div class="viewport l-ui" class:bgm={$page.url.pathname.startsWith("/auth") || $page.url.pathname.startsWith("/become-partner/registration")}>
		<slot />
		<Toaster />
	</div>
</div>

<!--suppress CssUnusedSymbol -->
<style lang="postcss">
	.app{overflow:hidden}
  .viewport{width:100vw;min-height:100vh;background:#f9f9f9}
	@media (min-width:900px){.viewport{padding:var(--card) var(--card) var(--card) calc(var(--sidebar) + var(--card))}}
	@media (orientation:landscape) and (max-width:900px){.viewport{padding:var(--card) var(--card) var(--card) calc(var(--sidebar) + var(--card))}}
	@media (orientation:portrait) and (max-width:900px){
			.viewport{padding:var(--card) var(--card) calc(var(--sidebar) + var(--card))}
			.bgm{background: white}
	}
</style>