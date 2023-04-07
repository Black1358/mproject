<script lang="ts">
	import moment from "moment";
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { afterUpdate, beforeUpdate } from 'svelte';
	import FileIcon from "$lib/ui/icons/File.svelte";
	import DownloadIcon from "$lib/ui/icons/Download.svelte";
	import Avatar from "$lib/ui/components/Avatar.svelte";
	import "video.js/dist/video-js.css";
	import videojs from "video.js";


	export let messages = [];
	export let userId = "";
	let userCount = 4;
	let messagesDiv, autoscroll, duration = 300;
	$: moreThanTwoUsers = userCount > 2;


	let showModal = false;
	let selectedImage = "";
	let downloading = false;
	let downloadProgress = 0;

	function isFirstMessageOfDay(currentMessage, previousMessage) {
		if (!previousMessage) return true;

		const currentMessageDate = moment(currentMessage.created).startOf('day');
		const previousMessageDate = moment(previousMessage.created).startOf('day');

		return !currentMessageDate.isSame(previousMessageDate);
	}


	const openModal = (url) => {
		selectedImage = url;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};
	const isCloseInTime = (message1, message2) => moment(message1.created).diff(moment(message2.created)) <= 60000;
	const isGrouped = (currentMessage, previousMessage) => previousMessage && currentMessage.sender === previousMessage.sender && isCloseInTime(currentMessage, previousMessage);
	const isLastInGroup = (currentMessage, nextMessage) => !nextMessage || currentMessage.sender !== nextMessage.sender || !isCloseInTime(currentMessage, nextMessage);
	

	const isImage = (file) => /\.(jpe?g|png|gif|bmp)$/i.test(file);
	const downloadFile = (messageId, file) => `http://127.0.0.1:8090/api/files/messages/${messageId}/${file}`;
	const isVideo = (file) => /\.(mp4|webm|ogg)$/i.test(file);

	const playVideo = (videoId) => {
		const player = videojs.getPlayer(videoId);
		if (player.paused()) {
			player.play();
		} else {
			player.pause();
		}
	};
	let scrollPosition, showScrollButton = false;

	function scrollToBottom() {
		messagesDiv.scrollTo({ top: messagesDiv.scrollHeight, behavior: "smooth" });
	}
	beforeUpdate(() => {autoscroll = messagesDiv && (messagesDiv.offsetHeight + messagesDiv.scrollTop) > (messagesDiv.scrollHeight - 10)});
	afterUpdate(() => {
		if (autoscroll) {
			messagesDiv.scrollTo(0, messagesDiv.scrollHeight);
		}
	});
	$: {
		scrollPosition = messagesDiv?.scrollHeight - messagesDiv?.scrollTop - messagesDiv?.clientHeight;
		showScrollButton = scrollPosition > 450;
	}

	const download = (url) => {
		const link = document.createElement("a");
		link.href = url;
		link.download = url.split("/").pop();
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};


	function translateMonth(month) {
		const monthNames = [
			'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
			'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
		];

		return monthNames[month];
	}

	function dayWithDeclension(day) {
		const declensions = ['ое', 'ое', 'ое', 'ье', 'ое', 'ое', 'ое', 'ое', 'ое', 'ое'];
		return day + "-" + declensions[day % 10];
	}


	async function downloadImage(url) {
		downloading = true;
		downloadProgress = 0;

		try {
			await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", url, true);
				xhr.responseType = "blob";

				xhr.onload = () => {
					if (xhr.status === 200) {
						const blob = xhr.response;
						const downloadUrl = URL.createObjectURL(blob);
						const link = document.createElement("a");
						link.href = downloadUrl;
						link.download = "image.jpg"; // Вы можете установить любое имя файла
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						setTimeout(() => {
							URL.revokeObjectURL(downloadUrl);
						}, 100);
						resolve();
					} else {
						reject(new Error(`Ошибка загрузки: ${xhr.statusText}`));
					}
				};

				xhr.onerror = () => {
					reject(new Error("Ошибка сети"));
				};

				xhr.onprogress = (event) => {
					if (event.lengthComputable) {
						downloadProgress = Math.round((event.loaded / event.total) * 100);
					}
				};

				xhr.send();
			});
		} catch (error) {
			console.error("Ошибка при скачивании изображения:", error);
		} finally {
			downloading = false;
			downloadProgress = 0;
		}
	}

</script>

<div class="messages  f-g1 f-s1 p-3 l-ui" bind:this="{messagesDiv}" in:fly={{ x: 150, duration, easing: backOut }}>
	{#each messages as message, index (message.id)}
		{#if !isGrouped(message, messages[index - 1])}
			<div class="message-spacing"></div>
		{/if}
		{#if isFirstMessageOfDay(message, messages[index - 1])}
			<div class="text-center text-sm text-gray-500">
				{dayWithDeclension(moment(message.created).date())} {translateMonth(moment(message.created).month())}
			</div>
		{/if}
		{#if message.sender === 'system'}
			<div class="text-center text-sm text-gray-500">
				{message.text}
			</div>
		{:else}
		{#if message.sender === userId}
			<div class={`chat chat-end ${isGrouped(message, messages[index - 1]) ? 'grouped' : ''} ${isLastInGroup(message, messages[index + 1]) ? 'last-in-group' : ''}`}>
				{isLastInGroup(message, messages[index + 1])}
				{#if message.text !== ""}
					<div class="chat-bubble">
						{message.text}
						{#if !isGrouped(message, messages[index - 1])}<time class="text-xs opacity-50">{moment(message.created).format('HH:mm')}</time>{/if}
					</div>
				{/if}
				{#if message.files.length > 0}
					{#each message.files as file}
						{#if isImage(file)}
							<img
								class="chat-file"
								src={downloadFile(message.id, file)}
								alt=""
								on:click={() => openModal(downloadFile(message.id, file))}
								on:keydown={(e) => e.key === "Enter" && openModal(downloadFile(message.id, file))}
								tabindex="0"
							/>
						{:else if isVideo(file)}
							<div
								class="relative chat-file"
							>
								<video
									id="video-{message.id}"
									class="video-js"
									controls
									preload="auto"
									width="640"
									height="264"
								>
									<source src="{downloadFile(message.id, file)}" type="video/mp4" />
								</video>

								{#if message.sender !== userId}
									<div class="absolute top-2 right-2">
										<button
											class="download-button"
											on:click|stopPropagation={() => download(downloadFile(message.id, file))}
										>
											<DownloadIcon class="w-6 h-6 text-white" />
										</button>
									</div>
								{/if}
							</div>

						{:else}
							<a href={downloadFile(message.id, file)} download class="file-link">
								<FileIcon size="24" />
								<span>{file}</span>
							</a>
						{/if}
					{/each}
				{/if}
			</div>
		{:else}
			<div class={`chat chat-start ${isGrouped(message, messages[index - 1]) ? 'grouped' : ''} ${isLastInGroup(message, messages[index + 1]) ? 'last-in-group' : ''}`}>
				{#if moreThanTwoUsers && !isGrouped(message, messages[index - 1])}
					<div class="avatar-wrapper">
						<Avatar src={message.senderAvatar} size="20" />
					</div>
				{/if}
				{#if message.text !== ""}
					<div class="chat-bubble">
						{message.text}
						{#if !isGrouped(message, messages[index - 1])}<time class="text-xs opacity-50">{moment(message.created).format('HH:mm')}</time>{/if}
					</div>
				{/if}
				{#if message.files.length > 0}
					{#each message.files as file}
						{#if isImage(file)}
							<img
								class="chat-file"
								src={downloadFile(message.id, file)}
								alt=""
								on:click={() => openModal(downloadFile(message.id, file))}
								on:keydown={(e) => e.key === "Enter" && openModal(downloadFile(message.id, file))}
								tabindex="0"
							/>
						{:else if isVideo(file)}
							<div
								class="relative chat-file"
							>
								<video
									id="video-{message.id}"
									class="video-js"
									controls
									preload="auto"
									width="640"
									height="264"
								>
									<source src="{downloadFile(message.id, file)}" type="video/mp4" />
								</video>

								{#if message.sender !== userId}
									<div class="absolute top-2 right-2">
										<button
											class="download-button"
											on:click|stopPropagation={() => download(downloadFile(message.id, file))}
										>
											<DownloadIcon class="w-6 h-6 text-white" />
										</button>
									</div>
								{/if}
							</div>

						{:else}
							<a href={downloadFile(message.id, file)} download class="file-link">
								<FileIcon size="24" />
								<span>{file}</span>
							</a>
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
		{/if}
	{/each}
</div>
<div class='relative'>
	{#if showScrollButton}
		<button
			class="absolute -top-4 right-4 p-2 bg-blue-500 text-white rounded shadow"
			on:click={scrollToBottom}
			aria-label="Скролл вниз"
		>
			⬇️
		</button>
	{/if}
</div>
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" on:click={closeModal}>
		<div class="relative max-w-full max-h-full p-4 bg-white" on:click|stopPropagation>
			<img class="w-full h-full object-contain" src="{selectedImage}" alt="" />
			<button
				class="absolute bottom-0 right-0 p-2 text-white bg-blue-500 rounded"
				on:click|stopPropagation={() => downloadImage(selectedImage)}
				disabled="{downloading}"
			>
				{#if downloading}
					Загрузка {downloadProgress}%
				{:else}
					Скачать
				{/if}
			</button>


		</div>
	</div>
{/if}

<style lang='postcss'>
    .messages{overflow:scroll;max-width: 750px; width:100%; align-self: center}
    .message-spacing {
        height: 8px;
    }

    .chat {
        padding-top: 2px;
        padding-bottom: 3px;
    }
    .chat-bubble {
        color: black;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .chat.grouped .chat-bubble::before {
        display: none;
    }
    .chat.grouped .chat-bubble {
        border-radius: 8px;
    }
    .chat.chat-start .chat-bubble {
        background: #f9f0eb;
    }
    .chat.chat-end .chat-bubble {
        background: #f0f4fe;
    }
    .avatar-wrapper {
        margin-right: 4px;
    }
    .chat-file {
        max-width: 200px;
        max-height: 200px;
        cursor: pointer;
    }
    .file-link {
        display: flex;
        align-items: center;
        gap: 4px;
        text-decoration: none;
        color: inherit;
    }
    .chat.last-in-group.chat-start .chat-bubble {

        border-bottom-right-radius: 16px;
    }

    .chat.last-in-group.chat-end .chat-bubble {
        border-bottom-left-radius: 16px;
    }

</style>