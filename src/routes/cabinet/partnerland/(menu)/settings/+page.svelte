<!--suppress TypeScriptUnresolvedFunction -->
<script lang="ts">
	import { Link, Rocket, Loader } from '$lib/ui/icons';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { getVendorAvatarURL } from '$lib/internal/files'
	import defaultAvatar from "$lib/resources/icons/user.svg";
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import { save, toastOptions } from '$lib/internal/toasts';
	import { invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { transliterate } from '$lib/internal/helpers';


	let vendor = JSON.parse($page.data.vendor);

	let name = vendor.name;
	let slug = vendor.slug;
	let type = vendor.type;
	let desc = vendor.desc || "";
	let metaDesc = vendor.metaDesc || "";
	let avatar = vendor.avatar ? `${getVendorAvatarURL(vendor.id, vendor.avatar)}` : defaultAvatar;

	$: transliterateName = transliterate(name ? name : "Мистерия");
	$: disabled = ((
		avatar === (vendor.avatar ? `${getVendorAvatarURL(vendor.id, vendor.avatar)}` : defaultAvatar) &&
		desc === vendor.desc &&
		name === vendor.name &&
		slug === vendor.slug &&
		metaDesc === vendor.metaDesc) || slug === "" ||
		name === ""
	);

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
		formData.append('name', name);
		formData.append('slug', slug);
		if (cropper) await new Promise((resolve) => {
			cropper.getCroppedCanvas().toBlob((blob) => {
				formData.append('avatar', blob, `avatar${vendor.id}.png`);
				resolve();
			});
		});
		const response = await fetch("/api/vendor/settings/update", { method: 'POST', body: formData });

		if (response.ok) {
			await invalidateAll();
			vendor = JSON.parse($page.data.vendor);
			await handleReset();
			save();
		}
		else {const result = await response.json(); toast.error(result.message, toastOptions)}
		loading = false;
	}

	const resetFields = () => {
		avatar = vendor.avatar ? `${getVendorAvatarURL(vendor.id, vendor.avatar)}` : defaultAvatar;
		[desc, metaDesc] = [vendor?.desc, vendor?.metaDesc];
	}
	const handleReset = async () => {
		resetFields();
		if (cropper) {cropper.destroy();cropper = null;avatarInput.value = ''}
	}
</script>

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
	<div class='w-full md:w-9/12 form-item'>
		<div class="input-icon column">
			<div class='label-container fsbc gap-1.5'>
				<div class='f-s0'><label for="name">Название:</label> <span class="text-red-500 font-bold">∗</span></div>
				<div class='italic t-cut'> {#if type === "shop"}Магазин {:else}Мастерская {/if}«{name ? name : "..."}»</div>
			</div>
			<div class='relative'>
				<div class="icon-container fcc">
					<Rocket />
				</div>
				<input type="text" class="input-custom" id="name" placeholder="Например, Мистерия" bind:value={name} on:input={() => slug = transliterate(name)}/>
			</div>
		</div>
	</div>
	<div class='w-full md:w-9/12 form-item mb-2'>
		<div class="input-icon column">
			<div class='label-container fsbc gap-1.5'>
				<div class='f-s0'><label for="slug">Cсылка:</label> <span class="text-red-500 font-bold">∗</span></div>
				<div class='italic t-cut'>mpodarkov.com/partner/{slug ? slug : "..."}»</div>
			</div>
			<div class='relative'>
				<div class="icon-container fcc">
					<Link />
				</div>
				<input type="text" class="input-custom" id="slug" placeholder={transliterateName} bind:value={slug}/>
			</div>
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
	<div class='w-full form-item flex'>
		<button type="submit" class="btn btn-secondary fcc gap-2" {disabled} on:click={send}>{#if loading}<Loader />Обработка...{:else}Сохранить{/if}</button>
		{#if !disabled}<button type="button" class="reset-btn" on:click={handleReset}>Отмена</button>{/if}
	</div>
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