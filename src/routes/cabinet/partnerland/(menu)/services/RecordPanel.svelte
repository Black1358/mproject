<script lang="ts">
	let showPanel = false;

	export function newRecord() {
		showPanel = true;
	}
</script>

{#if showPanel}
	<button on:click={() => showPanel = false}>Закрыть</button>
	Панелька
{/if}