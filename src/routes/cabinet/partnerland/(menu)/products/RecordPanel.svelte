<!--suppress TypeScriptUnresolvedFunction -->
<script lang="ts">
	import { Link, Cube, Loader, Rocket, Close, Edit } from '$lib/ui/icons';
	import { err, save, toastOptions } from '$lib/internal/toasts';
	import { transliterate } from '$lib/internal/helpers';
	import { invalidateAll } from '$app/navigation';
	import { tick } from 'svelte';
	import { getProductsAvatarURL } from '$lib/internal/files';
	import { fly, fade } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import toast from 'svelte-french-toast';
	import CategoryTree from '$lib/ui/components/CategoryTree.svelte';
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	export let categories = [];
	export let selectedCategories = [];

	let productData = {
		id: "",
		name: "",
		slug: "",
		desc: "",
		width: "",
		length: "",
		height: "",
		weight: ""
	}
	let showPanel = false;
	let loading = false;
	let add = true;

	let avatarMain;
	let avatarMainInput: HTMLInputElement;
	let croppingMainImage: HTMLImageElement;
	let cropper: Cropper | null = null;

	$: disabled = !(productData.name !== "");
	$: transliterateName = transliterate(productData.name ? productData.name : "Букет «Весна»");

	export function newRecord() {
		add = true;
		showPanel = true;
		productData = {id: "", name: "", slug: "", desc: "", width: "", length: "", height: "", weight: ""};
		selectedCategories = [];
		cropper?.destroy();
		cropper = null;
		avatarMain = "";
	}
	export function open(product, selected, avatarMainData) {
		add = false;
		showPanel = true;
		productData = product;
		selectedCategories = selected;
		cropper?.destroy();
		cropper = null;
		avatarMain = avatarMainData !== "" ? getProductsAvatarURL(productData.id, avatarMainData) : "";
	}

	const categoriesTree = buildCategoryTree(categories);
	function buildCategoryTree(categories, parentId = "") {
		return categories
			.filter((category) => category.parent === parentId)
			.map((category) => {
				return {
					...category,
					children: buildCategoryTree(categories, category.id),
				};
			});
	}
	function onSelectCategory(category) {
		if (category.children.length === 0) {
			selectedCategories = [];
			let currentCategory = category;
			while (currentCategory) {
				selectedCategories.unshift(currentCategory.id);
				currentCategory = categories.find(
					(cat) => cat.id === currentCategory.parent
				);
			}
		}
	}
	const createCropper = () => {
		cropper?.destroy();
		cropper = new Cropper(croppingMainImage, { aspectRatio: 1, viewMode: 1, autoCropArea: 1 });
	};
	const handleAvatarMainChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				avatarMain = e.target.result as string;
				await tick();
				createCropper();
			};
			reader.readAsDataURL(file);
		}
	};

	import { writable } from 'svelte/store';

	// Старые изображения
	const initialAvatars = writable([
		{src:"http://127.0.0.1:8090/api/files/_pb_users_auth_/snwhdq21mb5wght/avatarsnwhdq21mb5wght_WJBBHmqhne.png", canReplace: true},
		{src: "https://dadata.ru/static/i/dadata-logo.svg", canReplace: true}
	]);

	let editedAvatars = [];
	let deletedAvatars = [];
	let croppers = [];
	let croppingImages = [];
	let idCounter = 0;
	const createCropperAvatars = (avatarId: number) => {
		if (croppingImages[avatarId]) {
			croppers[avatarId]?.destroy();
			croppers[avatarId] = new Cropper(croppingImages[avatarId], { aspectRatio: 1, viewMode: 1, autoCropArea: 1 });
		}
	};

	const processFile = (file: Blob) => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const imageSrc = e.target.result as string;
				const isDuplicate = editedAvatars.some(({ src }) => src === imageSrc) || $initialAvatars.some(({ src }) => src === imageSrc);
				if (!isDuplicate) {
					const newAvatar = { id: idCounter++, src: imageSrc };
					editedAvatars = [...editedAvatars, newAvatar];
					await tick();
					createCropperAvatars(newAvatar.id);
				}
				resolve(true);
			};
			reader.readAsDataURL(file);
		});
	};

	const handleAvatarChange = async (e) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			for (const file of files) {
				// Если уже добавлено 4 изображений, прерываем цикл
				if ($initialAvatars.length + editedAvatars.length >= 4) break;
				await processFile(file);
			}
		}
	};

	const replaceAvatar = async (index: number, e: Event) => {
		const file = (e.target as HTMLInputElement)?.files[0];
		if (file) {
			await processFile(file);
			deleteAvatar(index, true);
		}
	};

	const deleteAvatar = (index: number, fromInitial: boolean) => {
		if (fromInitial) {
			deletedAvatars = [...deletedAvatars, $initialAvatars[index]];
			initialAvatars.update((avatars) => avatars.filter((_, i) => i !== index));
		} else {
			const avatar = editedAvatars[index];
			croppers[avatar.id]?.destroy();
			croppers[avatar.id] = null;
			deletedAvatars = [...deletedAvatars, avatar.src];
			editedAvatars = [...editedAvatars.slice(0, index), ...editedAvatars.slice(index + 1)];
		}
	};
	const send = async () => {
		loading = true;
		if (disabled) err();
		else {
			let url: string;
			const formData = new FormData();
			formData.append('name', productData.name);
			formData.append('slug', productData.slug);
			formData.append('desc', productData.desc);
			formData.append('width', productData.width);
			formData.append('length', productData.length);
			formData.append('height', productData.height);
			formData.append('weight', productData.weight);
			formData.append('categories', JSON.stringify(selectedCategories));
			if (cropper) await new Promise((resolve) => {
				cropper.getCroppedCanvas().toBlob((blob) => {
					formData.append('avatarMain', blob, `avatarMain${productData.slug}.png`);
					resolve();
				});
			});
			editedAvatars.forEach((avatar, index) => {
				if (avatar) {
					const blob = croppers[index]?.getCroppedCanvas()?.toDataURL('image/jpeg');
					if (blob) {
						fetch(blob)
							.then((res) => res.blob())
							.then((blobFile) => formData.append(`avatar-${index}`, blobFile, `avatar-${index}.jpeg`));
					}
				}
			});
			formData.append('deletedAvatars', JSON.stringify(deletedAvatars));

			if (add) url = "/api/vendor/products/add";
			else {
				url = "/api/vendor/products/update";
				formData.append('id', productData.id);
			}

			const response = await fetch(url, { method: 'POST', body: formData });
			if (response.ok) {
				await invalidateAll();
				showPanel = false;
				save();
			}
			else {const result = await response.json(); toast.error(result.message, toastOptions)}
		}
		loading = false;
	}
</script>

{#if showPanel}
<div class='side-container' transition:fade on:click={() => showPanel = false}>
	<div class='scroll-container flex v-start' on:click={(e) => e.stopPropagation()} in:fly={{ x: 150, duration:325, easing: backOut }} out:fly={{ x: 150, duration:275, easing: backOut }}>
		<button class='close' on:click={() => showPanel = false}><Close fill='white' /></button>
		<div class='side'>
			<div class='bgw column p-card inside'>
				<div class='w-full form-item'>
					<div class='input-icon column'>
						<div class='label-container fsbc gap-1.5'>
							<div class='f-s0'><label for='avatarMain'>Основное фото</label> <span class='text-red-500 font-bold'>∗</span></div>
						</div>
						<div class='avatar-container'>
							<div class='avatar-edit rounded-lg relative' class:avatarMain>
								{#if avatarMain}
									<img class='avatar-image mx-auto' width='235' height='235' src='{avatarMain}' alt='Главное изображение' bind:this='{croppingMainImage}' />
									<label for='avatarMain' class="icon-container fcc btn-icon ">
										<Edit fill='currentColor' />
									</label>
								{/if}
							</div>
							{#if !avatarMain}
								<div class='relative'>
									<div class="icon-container fcc">
										<Edit fill='white' />
									</div>
									<div class='input-custom-box cursor-pointer'>
										<label for='avatarMain' class='avatar-label block w-full text-center cursor-pointer font-bold'>Загрузить</label>
									</div>
								</div>
							{/if}
							<input type='file' id='avatarMain' class='avatar-input' accept='image/*' on:change='{handleAvatarMainChange}' bind:this='{avatarMainInput}' />
						</div>
					</div>
				</div>

				<div class="avatars-container flex gap-2 form-item">
					{#each $initialAvatars as avatar, index}
						<div class="avatar">
							<img class="avatar-image" src="{avatar.src}" alt="Изображение товара" data-id="{index}" bind:this="{croppingImages[index]}" width='50' height='50' />
							<div class="buttons">
								<button on:click={() => deleteAvatar(index, true)}>Удалить</button>
								{#if avatar.canReplace}
									<input type="file" id="replace-avatar-{index}" class='avatar-input' accept="image/*" on:change={(e) => replaceAvatar(index, e)} />
									<label for="replace-avatar-{index}" class="replace-avatar-label">Заменить</label>
								{/if}
							</div>
						</div>
					{/each}
					{#each editedAvatars as avatar, index (avatar.id)}
						{#if avatar.src}
							<div class="avatar-container">
								<img class="avatar-image" src="{avatar.src}" alt="Изображение товара" bind:this="{croppingImages[avatar.id]}" width='50' height='50' />
								<button on:click={() => deleteAvatar(index, false)}>Удалить</button>
							</div>
						{/if}
					{/each}
					{#if editedAvatars.length + $initialAvatars.length < 4}
						<div class="avatar-add w-3/12">
							<label for="avatar" class="avatar-label">+</label>
							<input type="file" id="avatar" class="avatar-input" accept="image/*" multiple on:change="{handleAvatarChange}" />
						</div>
					{/if}
				</div>

				<div class='w-full form-item'>
					<div class="input-icon column">
						<div class='label-container fsbc gap-1.5'>
							<div class='f-s0'><label for="name">Название</label> <span class="text-red-500 font-bold">∗</span></div>
						</div>
						<div class='relative'>
							<div class="icon-container fcc">
								<Rocket />
							</div>
							<input type="text" class="input-custom" id="name" placeholder="Букет «Весна»" bind:value={productData.name} on:input={() => productData.slug = transliterate(productData.name)}/>
						</div>
					</div>
				</div>

				<div class='w-full form-item'>
					<div class="input-icon column">
						<div class='label-container fsbc gap-1.5'>
							<div class='f-s0'><label for="slug">Cсылка:</label> <span class="text-red-500 font-bold">∗</span></div>
							<div class='italic t-cut'>/product/{productData.slug ? productData.slug : "..."}</div>
						</div>
						<div class='relative'>
							<div class="icon-container fcc">
								<Link />
							</div>
							<input type="text" class="input-custom" id="slug" placeholder={transliterateName} bind:value={productData.slug}/>
						</div>
					</div>
				</div>

				<div class='w-full form-item'>
					<div class="input-icon column">
						<div class='label-container fsbc gap-1.5'>
							<div><label for="desc">Описание</label> <span class="text-red-500 font-bold">∗</span></div>
							<div><span class="error-text"></span></div>
						</div>
						<textarea bind:value={productData.desc}  id='desc' rows='5'></textarea>
					</div>
				</div>

				<div class="input-icon column w-full form-item">
					<div class='label-container fsbc'>
						<div><label>Габариты</label> <span class="text-red-500 font-bold">∗</span></div>
					</div>
					<div class='relative'>
						<div class="icon-container fcc">
							<Cube />
						</div>
						<div class='flex gap-2 input-custom-box'>
							<input bind:value={productData.width} class='f-g1' type='number' min='1'/>
							<div>X</div>
							<input bind:value={productData.length} class='f-g1' type='number' min='1'/>
							<div>X</div>
							<input bind:value={productData.height} class='f-g1' type='number' min='1'/>
							<input bind:value={productData.weight} class='f-g1' type='number' min='1'/>
						</div>
					</div>
				</div>

				<div class='w-full form-item'>
					<h3>Выберите категорию:</h3>
					<CategoryTree categories={categoriesTree} {selectedCategories} {onSelectCategory} />
				</div>

				<button type='submit' class='btn btn-secondary w-11/12 font-bold fcc gap-2 form-item s-center' {disabled} on:click={send}>
					{#if loading}<Loader />Обработка...{:else}Сохранить{/if}
				</button>
			</div>
		</div>
	</div>
</div>
{/if}

<style lang='postcss'>
    .form-item +.form-item{margin-top:calc(var(--pd) * 1.1)}
		.avatar-input{display: none}

    .input-icon .input-custom-box {
        height: 38px;
        padding: 8px 8px 8px 38px;
        width: 100%;
        border-radius: 0.5rem;
        border-width: 1px;
        border-color: rgb(209, 213, 219);
        background-color: white;
        color: rgb(57, 68, 86);
        outline: none;
        & input {
            background: transparent;
            width: 20px;
        }
    }

		.avatar-container .input-custom-box { padding-right: 38px; background: #9ca3af; color:white}
		.avatarMain {padding: 8px;width: 100%;border-width: 1px;border-color: rgb(209,213,219)}


    textarea {
        padding: 8px;
        width: 100%;
        border-radius: 0.5rem;
        border-width: 1px;
        border-color: rgb(209, 213, 219);
        background-color: white;
        color: rgb(57, 68, 86);
        outline: none;
				resize: none;
    }
		.side-container {z-index: 50;position: fixed;right: 0;top: 0;bottom: 0;left: 0;background: rgba(0, 0, 0, 0.3);}
		.scroll-container{right: 0;top: 0;bottom: 0;height: 100vh;position:absolute;overflow:scroll}
		.close {position: sticky;top: 16px;background: #000000d9;padding: 4px 5px 4px 4px;border-radius: 10px 0 0 10px;}
		.side {width:400px;max-width:90vw;height:auto}
    @media (orientation:portrait) and (max-width:900px){.side .inside {padding-bottom: calc(var(--sidebar) + var(--pd))}}
</style>