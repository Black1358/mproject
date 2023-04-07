<!--suppress TypeScriptUnresolvedFunction -->
<script lang="ts">
	import type { ValidationResult } from '$lib/internal/validation';
	import { ZodError } from 'zod';
	import { userSchema } from './validation';
	import { Tel, User, Loader } from '$lib/ui/icons';
	import { InputField } from '$lib/ui/kit';
	import { invalidateAll } from '$app/navigation';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { toastOptions, save } from '$lib/internal/toasts';
	import { getUserAvatarURL } from "$lib/internal/files";
	import defaultAvatar from "$lib/resources/icons/user.svg";
	import toast from 'svelte-french-toast';
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';

	let user = JSON.parse($page.data.user);
	let avatar = user.avatar ? `${getUserAvatarURL(user.id, user.avatar)}` : defaultAvatar;
	let userData = {surname: user.surname || "", name: user.name || "", patronymic: user.patronymic || "", phone: user.phone || "",}
	let validationResult: ValidationResult = {};
	let avatarInput: HTMLInputElement;
	let croppingImage: HTMLImageElement;
	let cropper: Cropper | null = null;
	let loading = false;

	$: disabled = (
		avatar === (user.avatar ? `${getUserAvatarURL(user.id, user.avatar)}` : defaultAvatar) &&
		userData.surname === user.surname &&
		userData.name === user.name &&
		userData.patronymic === user.patronymic &&
		userData.phone === user.phone
	);

	const resetFields = () => {
		avatar = user.avatar ? `${getUserAvatarURL(user.id, user.avatar)}` : defaultAvatar;
		[userData.surname, userData.name, userData.patronymic, userData.phone] = [user?.surname, user?.name, user?.patronymic, user?.phone];
	}
	const handleReset = async () => {
		resetFields();
		if (cropper) {cropper.destroy();cropper = null;avatarInput.value = ''}
	}
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
	const handleSubmit = async () => {
		loading = true;
		try {
			const parsedData = userSchema.parse(userData);
			validationResult = {};
			const formData = new FormData();
			formData.append('surname', parsedData.surname);
			formData.append('name', parsedData.name);
			formData.append('patronymic', parsedData.patronymic);
			formData.append('phone', parsedData.phone);
			if (cropper) await new Promise((resolve) => {
				cropper.getCroppedCanvas().toBlob((blob) => {
					formData.append('avatar', blob, `avatar${user.id}.png`);
					resolve();
				});
			});
			const response = await fetch("/api/user/update", { method: 'POST', body: formData });
			if (response.ok) {
				await invalidateAll();
				user = JSON.parse($page.data.user);
				await handleReset();
				save();
			}
			else {const result = await response.json(); toast.error(result.message, toastOptions)}
		} catch (err) {if (err instanceof ZodError) validationResult = err.errors.reduce((f, e) => { f[e.path[0]] = e.message; return f; }, {})}
		loading = false;
	}
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="mobile" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page'>
		<div class="form p-card sm:bgw sm:bor">
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
			<div class='w-full form-item'>
				<InputField id="surname" labelText="Фамилия" placeholder="Шишкин" bind:value={userData.surname} errorText={validationResult.surname} err={validationResult.surname?.length > 0}>
					<User />
				</InputField>
			</div>
			<div class='w-full form-item'>
				<InputField id="name" labelText="Имя" placeholder="Владислав" bind:value={userData.name} errorText={validationResult.name} err={validationResult.name?.length > 0}>
					<User />
				</InputField>
			</div>
			<div class='w-full form-item'>
				<InputField id="patronymic" required={false} labelText="Отчество" placeholder="Ярославович" bind:value={userData.patronymic} errorText={validationResult.patronymic} err={validationResult.patronymic?.length > 0}>
					<User />
				</InputField>
			</div>
			<div class='w-full form-item'>
				<InputField id="tel" labelText="Телефон" placeholder="+7..." bind:value={userData.phone} errorText={validationResult.phone} err={validationResult.phone?.length > 0}>
					<Tel />
				</InputField>
			</div>
			<div class='w-full form-item flex'>
				<button type="submit" class="btn btn-secondary fcc gap-2" {disabled} on:click={handleSubmit}>{#if loading}<Loader />Обработка...{:else}Сохранить{/if}</button>
				{#if !disabled}<button type="button" class="reset-btn" on:click={handleReset}>Отмена</button>{/if}
			</div>
		</div>
	</div>
</main>

<style lang='postcss'>
	.form-item +.form-item{margin-top:calc(var(--pd) * 1.2)}


	.reset-btn {@apply px-4 py-2 ml-4 bg-gray-300 text-black rounded cursor-pointer}
	.reset-btn:hover {@apply bg-gray-400}
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