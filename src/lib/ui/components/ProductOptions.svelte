<!-- ProductOptions.svelte -->
<script>
	let options = [];
	let newOption = {
		title: "",
		type: "text",
		price: 0,
		free: false,
		image: null,
	};

	function addOption() {
		options = [...options, { ...newOption }];
		newOption = { ...newOption, title: "", price: 0, image: null };
	}

	function removeOption(index) {
		options = options.filter((_, i) => i !== index);
	}
</script>

<style>
    /* Add your styles here */
</style>

<div>
	<h3>Добавить опцию</h3>
	<form on:submit|preventDefault="{addOption}">
		<label>
			Название:
			<input type="text" bind:value="{newOption.title}" />
		</label>
		<label>
			Тип:
			<select bind:value="{newOption.type}">
				<option value="text">Текстовое поле</option>
				<option value="checkbox">Чекбокс</option>
				<option value="radio">Радио-кнопка</option>
				<option value="image">Изображение</option>
			</select>
		</label>
		<label>
			Цена:
			<input type="number" bind:value="{newOption.price}" />
		</label>
		<label>
			Бесплатно:
			<input type="checkbox" bind:checked="{newOption.free}" />
		</label>
		{#if newOption.type === 'image'}
			<label>
				Загрузить изображение:
				<input type="file" accept="image/*" on:change="{(e) => newOption.image = e.target.files[0]}" />
			</label>
		{/if}
		<button type="submit">Добавить опцию</button>
	</form>

	<h3>Опции товара</h3>
	<ul>
		{#each options as option, index (index)}
			<li>
				{option.title} ({option.type}) - {option.free ? 'бесплатно' : `${option.price} руб.`}
				<button on:click="{() => removeOption(index)}">Удалить</button>
				{previewOption(option)}
			</li>
		{/each}
	</ul>
</div>
