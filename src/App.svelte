<script>
	import { onMount } from 'svelte';
	import ChatBox from './ChatBox.svelte';
  
	const ws = new WebSocket('ws://localhost:5000');
  
	let messages = [];
	let userName = '';
	let hasJoinedChat = false;
	let onlineUsers = [];
  
	ws.onmessage = (event) => {
	  const data = JSON.parse(event.data);
	  if (Array.isArray(data)) {
		messages = data;
	  } else if (data.type === 'userList') {
		onlineUsers = data.users;
	  }
	};
  
	onMount(() => {
	  ws.onopen = () => {
		console.log('WebSocket connection established.');
	  };
  
	  ws.onclose = () => {
		console.log('WebSocket connection closed.');
	  };
	});
  
	function sendMessage(message) {
	  if (!userName.trim()) {
		console.log('Please enter your name before sending messages.');
		return;
	  }
  
	  ws.send(JSON.stringify({ ...message, sender: userName }));
	}
  </script>
  
  <main>
	<h1>SVELTE CHAT APP</h1>
  
	{#if !hasJoinedChat}
	  <div class="input-box">
		<input type="text" bind:value={userName} placeholder="Enter your name" />
		<button on:click={() => (userName.length > 1 && (hasJoinedChat = true))}>Join Chat</button>
	  </div>
	{:else}
	  <div class="chat-container">
		<div class="user-list">
		  <h3>Online Users</h3>
		  {#each onlineUsers as user}
			<p>{user}</p>
		  {/each}
		</div>
		<ChatBox {messages} {sendMessage} {userName} />
	  </div>
	{/if}
  </main>
  
  <style>
	:global(body) {
	  margin: 0;
	  font-family: Arial, sans-serif;
	  background-color: #f5f5f5;
	}
  
	main {
	  padding: 20px;
	  max-width: 100%;
	  display: flex;
	  flex-direction: column;
	  height: 100vh;
	}
  
	h1 {
	  text-align: center;
	  margin-bottom: 20px;
	  color: darkblue;
	}
  
	.input-box {
	  display: flex;
	  margin-bottom: 20px;
	}
  
	input {
	  flex: 1;
	  padding: 10px;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	}
  
	button {
	  padding: 10px 20px;
	  border: none;
	  background-color: #007bff;
	  color: #fff;
	  border-radius: 4px;
	  cursor: pointer;
	  margin-left: 8px;
	}
  
	button:hover {
	  background-color: green;
	}
  
	.chat-container {
	  display: flex;
	  flex: 1;
	  background-color: #fff;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	  overflow: hidden;
	}
  
	.user-list {
	  padding: 10px;
	  border-right: 1px solid #ccc;
	  width: 200px;
	}
  
	.user-list h3 {
	  margin: 0;
	  margin-bottom: 10px;
	  color: purple;
	}
  
	.user-list p {
	  margin: 0;
	  margin-bottom: 5px;
	}
  </style>
  