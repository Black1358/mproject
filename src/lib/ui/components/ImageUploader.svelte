<!-- ImageUploader.svelte -->
<script>
	import { onMount } from 'svelte';
	import Uppy from '@uppy/core';
	import Dashboard from '@uppy/dashboard';
	import ImageEditor from '@uppy/image-editor';
	import XHRUpload from '@uppy/xhr-upload';

	import '@uppy/core/dist/style.css';
	import '@uppy/dashboard/dist/style.css';
	import '@uppy/webcam/dist/style.css';

	export let endpoint;

	let uppy;
	let container;

	onMount(() => {
		uppy = new Uppy({
			autoProceed: false,
		});

		uppy.use(Dashboard, {
			target: container,
			inline: true,
			showLinkToFileUploadResult: false,

		});

		uppy.use(ImageEditor, { quality: 0.8, target: Dashboard, });

		uppy.use(XHRUpload, {endpoint: endpoint, fieldName: 'file'});
		uppy.on('complete', (result) => {
			console.log('Upload complete:', result);
		});

		return () => {uppy.close()};
	});
</script>

<div bind:this="{container}"></div>