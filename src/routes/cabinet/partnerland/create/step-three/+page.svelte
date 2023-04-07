<!--suppress TypeScriptUnresolvedFunction -->
<script lang="ts">
	import { Loader } from '$lib/ui/icons';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { getVendorAvatarURL } from '$lib/internal/files'
	import defaultAvatar from "$lib/resources/icons/user.svg";
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import { save, toastOptions } from '$lib/internal/toasts';
	import { goto, invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';

	const vendor = JSON.parse($page.data.vendor);

	let desc = vendor.desc || "";
	let metaDesc = vendor.metaDesc || "";
	let avatar = vendor.avatar ? `${getVendorAvatarURL(vendor.id, vendor.avatar)}` : defaultAvatar;
	let avatarInput: HTMLInputElement;
	let croppingImage: HTMLImageElement;
	let cropper: Cropper | null = null;
	let loading = false;

	const createCropper = () => {
		cropper?.destroy();
		cropper = new Cropper(croppingImage, { aspectRatio: 1, viewMode: 1, autoCropArea: 1 });
	};
	const handleAvatarChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				avatar = e.target.result as string;
				await tick();
				createCropper();
			};
			reader.readAsDataURL(file);
		}
	};

	const send = async () => {
		loading = true;
		const formData = new FormData();
		formData.append('desc', desc);
		formData.append('metaDesc', metaDesc);
		if (cropper) await new Promise((resolve) => {
			cropper.getCroppedCanvas().toBlob((blob) => {
				formData.append('avatar', blob, `avatar${vendor.id}.png`);
				resolve();
			});
		});
		const response = await fetch("/api/vendor/create/step-three", { method: 'POST', body: formData });
		if (response.ok) {
			await invalidateAll();
			await goto("/cabinet/partnerland");
			save();
		}
		else {const result = await response.json(); toast.error(result.message, toastOptions)}
		loading = false;
	}
</script>

<h1>Добро пожаловать!</h1>
<p>{#if (vendor.type === "shop")}Ваш магазин «{vendor.name}» создан!{:else}Ваша мастерская «{vendor.name}» создана!{/if} Расскажите клиентам о себе! Эту информацию можно изменить в любой момент, если сейчас вы не совсем готовы.</p>

<form class='column gap-4' >
	<div class="avatar-container form-item">
		<div class="avatar-edit">
			{#if avatar}
				<img
					class="avatar-image"
					src="{avatar}"
					alt="Аватар"
					bind:this="{croppingImage}"
				/>
			{/if}
		</div>
		<div class="avatar-change">
			<label for="avatar" class="avatar-label">Изменить аватар</label>
			<input
				type="file"
				id="avatar"
				class="avatar-input"
				accept="image/*"
				on:change="{handleAvatarChange}"
				bind:this="{avatarInput}"
			/>
		</div>
	</div>
	<div class="column gap-2">
		<label for='desc' class="cursor-pointer"><span class="label-text">Краткое описание, чем вы занимаетесь (будет видно на вашей странице)</span></label>
		<textarea id='desc' bind:value={desc} cols='30' rows='5'></textarea>
	</div>
	<div class="column gap-2">
		<label for='desc' class="cursor-pointer"><span class="label-text">Метаописание, чем вы занимаетесь (это описание для поисковиков)</span></label>
		<textarea id='metaDesc' bind:value={metaDesc} cols='30' rows='5'></textarea>
	</div>
	<button type='submit' class='btn btn-secondary w-11/12 font-bold fcc gap-2' on:click={send}>
		{#if loading}<Loader />Обработка...{:else}Продолжить{/if}
	</button>
</form>

<style lang='postcss'>
    .form-item +.form-item{margin-top:calc(var(--pd) * 1.2)}
    .avatar-container {@apply flex flex-col items-center}
    .avatar-edit {@apply relative w-48 h-48}
    .avatar-image {@apply w-full h-full object-cover}
    .avatar-change {@apply mt-4}
    .avatar-input {@apply hidden}
    .avatar-label {@apply inline-block px-4 py-2 bg-blue-500 text-white cursor-pointer rounded}
    .avatar-label:hover {@apply bg-blue-700}

    @screen md {
        .avatar-container {@apply flex-row;}
        .avatar-change {@apply ml-4 mt-0}
    }
</style>