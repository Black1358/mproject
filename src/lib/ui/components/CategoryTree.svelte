<script>
	import { slide } from 'svelte/transition';
	export let categories;
	export let selectedCategories = [];
	export let onSelectCategory;

	let selectedAccordionCategoryId = null;
	const toggleAccordion = (category) => {
		if (selectedAccordionCategoryId === category.id) {
			selectedAccordionCategoryId = null;
		} else {
			selectedAccordionCategoryId = category.id;
		}
	};
</script>


<ul>
	{#each categories as category (category.id)}
		<li on:click={() => onSelectCategory(category)} transition:slide>
		<span
			class:selected={selectedCategories.includes(category.id)}
			class:available={!category.children || category.children.length === 0}
			class:accord={category.children && category.children.length > 0}
			class:active={selectedAccordionCategoryId === category.id}
			on:click={() => toggleAccordion(category)}
		>
			{category.name}
		</span>
			{#if category.children && (category.children.length > 0 || selectedCategories.includes(category.id)) && category.id === selectedAccordionCategoryId}
				<svelte:self categories={category.children}
										 {selectedCategories}
										 {onSelectCategory}
				/>
			{/if}
		</li>
	{/each}
</ul>


<style>
    ul {
        list-style-type: none;
        padding: 2px 5px;
    }

    li {
        margin: 2px 0;
    }

    span {
        display: inline-block;
        padding: 2px 5px;
    }

    .available {
        background-color: #f0f0f0;
    }
    .selected.available {
        background-color: #32cd32;
    }
    .selected {
        font-weight: bold;
        color: blue;
    }
    .accord {
        background-color: #7fffd4;
    }
    .accord.active {
        background-color: #de01ff;
    }
</style>