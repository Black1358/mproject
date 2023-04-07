<script lang="ts">
	export let value = "";
	export let id = "";
	export let labelText = "";
	export let placeholder = "";
	export let errorText: string | null = null;
	export let err = false;
	export let success = false;
	export let required = true;
	let inputElement: HTMLInputElement;
	const onInput = () => {value = inputElement.value}
</script>

<div class="input-icon column">
	<div class='label-container fsbc'>
		<div>{#if labelText}<label for={id}>{labelText}</label>{/if} {#if required}<span class="text-red-500 font-bold">∗</span>{/if}</div>
		<div>{#if errorText}<span class="error-text">{errorText}</span>{/if}</div>
	</div>
	<div class='relative'>
		<div class="icon-container fcc">
			<slot />
		</div>
		<input bind:this={inputElement} placeholder={placeholder} value={value} on:input={onInput} type="text" id={id} class="input-custom {err ? 'error' : ''} {success ? 'success' : ''}" />
	</div>
</div>