<script lang='ts'>
	import AvatarDefault from "../icons/AvatarDefault.svelte";
	export let src: string | undefined;
	export let size = 30;
</script>

{#if src !== undefined}
	{#if src !== ""}
		<div class='fcc f-s0'>
			<img class='rounded-xl' {src} alt="Аватар" width="{size}" height="{size}" />
		</div>
	{:else}
			<AvatarDefault size="{size}" />
	{/if}
{:else}
	<div class='rounded-xl animate-pulse rounded-md bg-slate-200' style={`width: ${size}px; height: ${size}px`}></div>
{/if}