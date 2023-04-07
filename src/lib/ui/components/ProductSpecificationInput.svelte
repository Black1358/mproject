<script>
	export let specifications;
	export let selectedCategories;

	let inheritedSpecifications = [];

	$: if (selectedCategories && selectedCategories.length > 0) {
			inheritedSpecifications = getInheritedSpecifications(selectedCategories);
		}

	function getInheritedSpecifications(selectedCategories) {
		return specifications.filter(spec =>
			selectedCategories.some(categoryId => spec.categories.includes(categoryId))
		);
	}
</script>

<div>
	{#each inheritedSpecifications as spec (spec.id)}
		<label for="{spec.slug}">{spec.name}:</label>
		{#if spec.values}
			<select id="{spec.slug}" name="{spec.slug}">
				{#each spec.values as value (value.eng)}
					<option value="{value.eng}">{value.ru}</option>
				{/each}
			</select>
		{:else}
			<input type="text" id="{spec.slug}" name="{spec.slug}" />
		{/if}
		<br />
	{/each}
</div>