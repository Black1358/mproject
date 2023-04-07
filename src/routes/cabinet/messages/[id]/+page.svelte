<script lang="ts">
	import moment from 'moment';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { afterUpdate, beforeUpdate, onDestroy, onMount, tick } from 'svelte';
	import PocketBase from 'pocketbase';
	import FilePreview from '$lib/ui/components/FilePreview.svelte';
	import HeaderChat from "$lib/ui/kit/cabinet/messenger/Header.svelte";
	import MessagesChat from "$lib/ui/kit/cabinet/messenger/Messages.svelte";

	const pb = new PocketBase('http://127.0.0.1:8090');
	let duration = $page.data.animation || 330;
	let chatId, user, chat, div, autoscroll;
	$: chat;
	let startURL = $page.url.pathname;
	let attachedFiles: Array<{ file: File; preview: string; isImage: boolean }> = [];
	let newMessage = '';
	let textarea: HTMLTextAreaElement;
	let fil: HTMLInputElement;
	const handleFiles = (event: Event) => {
		const files = Array.from((event.target as HTMLInputElement).files);

		files.forEach((file) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				attachedFiles = [
					...attachedFiles,
					{
						file,
						preview: e.target.result as string,
						isImage: file.type.startsWith('image/'),
					},
				];
			};

			reader.readAsDataURL(file);
		});
	};
	function createDataTransfer(files: File[]) {
		const dataTransfer = new DataTransfer();
		for (const file of files) {
			dataTransfer.items.add(file);
		}
		return dataTransfer;
	}

	const removeFile = (event: CustomEvent) => {
		// Удаляем файл из массива attachedFiles
		attachedFiles.splice(event.detail.index, 1);
		attachedFiles = [...attachedFiles];

		// Создаем новый объект DataTransfer с обновленным списком файлов
		const newDataTransfer = createDataTransfer(attachedFiles.map(({ file }) => file));

		// Обновляем файлы в поле выбора файлов
		fil.files = newDataTransfer.files;
	};

	let messages = [];
	$: messages;
		$: user = JSON.parse($page.data.user) || "";
	$: chatId = $page.data.chatId || "";
	$: if (startURL !== $page.url.pathname) {
		newMessage = "";
		startURL = $page.url.pathname;
		loadChat();
	}

	onMount(async () => {await loadChat()})
	onDestroy(async () => {await pb.collection('chats').unsubscribe()})
	async function send() {
		const formData = new FormData();
		formData.append('chat', chatId);
		formData.append('text', newMessage);
		formData.append('author', user.id);
		for (let file of fil.files) {
			formData.append('files', file);
		}
		await pb.collection('messages').create(formData);
		newMessage = '';
		fil.value = "";
		attachedFiles = [];
		await tick();
		const lineHeight = parseInt(window.getComputedStyle(textarea).getPropertyValue('line-height'));
		textarea.style.height = 'auto';
		textarea.style.height = `${Math.min(textarea.scrollHeight, lineHeight * 2)}px`;
	}
	async function loadChat() {
		chat = await pb.collection('chats').getOne(chatId);
		messages = await pb.collection("messages").getFullList({sort: 'created', filter: 'chat ="'+ chatId + '"'});
		await pb.collection('chats').subscribe(chatId, async ({action, record}) => {
			chat = record;
			if (action === 'update') messages = await pb.collection("messages").getFullList({sort: 'created', filter: 'chat ="'+ chatId + '"'});
		})
	}

	$: if (newMessage) {
		const lineHeight = parseInt(window.getComputedStyle(textarea).getPropertyValue('line-height'));
		textarea.style.height = 'auto';
		textarea.style.height = `${Math.min(textarea.scrollHeight, lineHeight * 2)}px`;
	}

	const isCloseInTime = (message1, message2) => moment(message1.created).diff(moment(message2.created)) > 60000;
</script>

<div class="column h-full w-full">
	<HeaderChat chat={chat} />
	<MessagesChat userCount={chat?.users.length} userId={user.id} messages={messages}/>

	<div class='attached flex gap-2'>
		{#each attachedFiles as filePreview, index}
			<FilePreview {filePreview} {index} on:remove={removeFile} />
		{/each}
	</div>
	<div class='chat-footer bgw bor p-1.5 gap-1.5 fcc' in:fly={{ y: 150, duration, easing: backOut }}>
		<input id='file-input' type="file" multiple on:change={handleFiles} bind:this={fil}>
		<label class="btn-icon" for="file-input" tabindex='0'>
			<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="m16.872 8.16-6.96 7.092a1.255 1.255 0 0 0-.375.891 1.274 1.274 0 0 0 .36.898 1.231 1.231 0 0 0 .881.367 1.211 1.211 0 0 0 .874-.383l6.962-7.09a3.798 3.798 0 0 0 1.081-2.66c0-.998-.389-1.955-1.081-2.66a3.658 3.658 0 0 0-2.61-1.102c-.98 0-1.92.396-2.612 1.101l-6.96 7.093a6.273 6.273 0 0 0-1.367 2.034 6.37 6.37 0 0 0-.03 4.835c.31.768.765 1.465 1.341 2.052a6.146 6.146 0 0 0 2.015 1.366 6.054 6.054 0 0 0 4.745-.03 6.15 6.15 0 0 0 1.997-1.393l6.96-7.091 1.74 1.772-6.96 7.093a8.608 8.608 0 0 1-2.795 1.902 8.475 8.475 0 0 1-6.593 0 8.607 8.607 0 0 1-2.795-1.902 8.79 8.79 0 0 1-1.867-2.848 8.92 8.92 0 0 1 0-6.717A8.79 8.79 0 0 1 4.69 9.933l6.962-7.091a6.092 6.092 0 0 1 4.328-1.76 6.097 6.097 0 0 1 4.297 1.836 6.328 6.328 0 0 1 1.802 4.378 6.332 6.332 0 0 1-1.727 4.41l-6.96 7.095c-.342.349-.75.626-1.197.815a3.633 3.633 0 0 1-2.827 0 3.688 3.688 0 0 1-1.197-.816 3.767 3.767 0 0 1-.8-1.22 3.824 3.824 0 0 1 0-2.88c.185-.456.457-.871.8-1.22l6.962-7.093 1.74 1.773Z" fill="currentColor"/>
			</svg>
		</label>
		<div class='sender f-g1 column g-center s-stretch rounded-lg'>
			<textarea class="block px-2" bind:this={textarea} bind:value={newMessage} rows="1" placeholder="Напишите сообщение..."></textarea>
		</div>
		<button class='btn-icon' on:click={send}>
			<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M2.125 2.612c-.288-.545-.063-.771.525-.492l20.907 9.905c.58.275.587.745.043 1.038L3.54 23.867c-.555.3-.821.076-.596-.496l3.638-9.196 11.467-1.624-11.482-1.52-4.442-8.419Z" fill="currentColor"/>
			</svg>
		</button>
	</div>
</div>

<style lang='postcss'>

  textarea{background:transparent;overflow:hidden;resize:none}
  textarea:focus-visible{outline:none}
  @media (orientation:portrait) and (max-width: 685px){.chat-footer{margin-bottom: -8px;border:unset}}
	.chat{padding-top:2px;padding-bottom:3px}
  .chat-bubble{color:black;white-space: pre-wrap;word-wrap: break-word;}
	.chat.grouped .chat-bubble::before{display:none}
	.chat.grouped .chat-bubble{border-radius:8px}
	.chat.chat-start .chat-bubble{background:#f9f0eb}
	.chat.chat-end .chat-bubble{background:#f0f4fe}

  #file-input{display:none}
  .sender{background:#f0f4fe}
	.chat-footer, .attached{max-width: 750px; width:100%; align-self: center}
	.attached{border-top:1px #eee solid}
    .avatar-container {
        @apply relative;
    }

    .avatar-image {
        @apply w-full h-full;
    }
    .avatar-change {
        @apply mt-2;
    }
    .avatar-label {
        @apply cursor-pointer text-blue-600;
    }
    .avatar-input {
        @apply hidden;
    }
</style>
