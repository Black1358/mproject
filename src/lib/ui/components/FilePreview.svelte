<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition'
	import { backOut } from 'svelte/easing'
	export let filePreview;
	export let index;

	const dispatch = createEventDispatcher();

	function removeFile() {
		dispatch('remove', { index });
	}
</script>

<div class="fccc rounded-lg p-1 my-2 relative calibri" style='background: #f9f9f9'  out:fly={{ y: 150, duration: 250, easing: backOut }}>
	{#if filePreview.isImage}
		<img src={filePreview.preview} alt="Прикрепленное изображение" style='width: 50px; height: 50px' class='object-contain' />
	{:else}
			<svg width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 2.003V2h10.998C20.55 2 21 2.455 21 2.992v18.016a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8l6-5.997ZM5.83 8H9V4.83L5.83 8ZM11 4v5a1 1 0 0 1-1 1H5v10h14V4h-8Z" fill="#07111D"/>
			</svg>
			<div class="t-cut mt-1" style='font-size:8px;max-width:45px'>{filePreview.file.name}</div>
	{/if}
	<button class="absolute right-1 top-1 bg-white rounded-full p-1" on:click={removeFile}><svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M15 4h5v2h-2v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6H0V4h5V1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3Zm1 2H4v12h12V6Zm-4.586 6 1.768 1.768-1.414 1.414L10 13.414l-1.768 1.768-1.414-1.414L8.586 12l-1.768-1.768 1.414-1.414L10 10.586l1.768-1.768 1.414 1.414L11.414 12ZM7 2v2h6V2H7Z" fill="#07111D"/>
	</svg>
	</button>
</div>
