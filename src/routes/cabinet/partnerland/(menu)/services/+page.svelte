<script lang="ts">
	import { page } from '$app/stores';
	import RecordPanelEl from './RecordPanel.svelte';
	const services = JSON.parse($page.data.services);

	let recordPanel;
</script>

{#if services.length > 0}
	{#each services as service}
		{service.name}
	{/each}
{:else}
	Услуг нет
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