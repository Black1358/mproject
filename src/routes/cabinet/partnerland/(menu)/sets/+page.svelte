<script lang="ts">
	import { page } from '$app/stores';
	import RecordPanelEl from './RecordPanel.svelte';
	const sets = JSON.parse($page.data.sets);

	let recordPanel;
</script>

{#if sets.length > 0}
	{#each sets as set}
		{set.name}
	{/each}
{:else}
	Наборов нет
{/if}

<button class='add-product rounded-lg' on:click={() => recordPanel.newRecord()}>
	Добавить
</button>

<RecordPanelEl bind:this={recordPanel} />

<style>
    .add-product {
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 40px;
        height: 40px;
        background: #8B5D42;
    }
</style>