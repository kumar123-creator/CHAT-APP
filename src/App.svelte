<script>
	import { onMount, afterUpdate } from 'svelte';
	import ChatBox from './ChatBox.svelte';
	import ErrorMessage from './ErrorMessage.svelte';

	let messages = [];
	let userName = '';
	let hasJoinedChat = false;
	let onlineUsers = [];
	let errorMessage = '';
	let isNewMessageNotificationEnabled = false; 

	const ws = new WebSocket('ws://localhost:5000');
	const maxMessageLength = 10;
  
	ws.onmessage = (event) => {
	  const data = JSON.parse(event.data);
	  console.log('Received data:', data); 
	  if (Array.isArray(data)) {
		messages = data;
	  } else if (data.type === 'userList') {
		onlineUsers = data.users;
	  } else if (data.type === 'message') {
		messages.push(data);
		if (!document.hasFocus() && isNewMessageNotificationEnabled) {
		  showNewMessageNotification(data.sender, data.content);
		}
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
  
	// Function to show a browser notification for new messages
	function showNewMessageNotification(sender, content) {
	  if (Notification.permission === 'granted') {
		const notification = new Notification(`New message from ${sender}`, {
		  body: content,
		});
	  }
	}
  
	// Request permission to show notifications
	function requestNotificationPermission() {
	  Notification.requestPermission().then((permission) => {
		isNewMessageNotificationEnabled = permission === 'granted';
	  });
	}
  
	// Check if the page is focused or not
	let isPageFocused = true;
  
	window.addEventListener('focus', () => {
	  isPageFocused = true;
	});
  
	window.addEventListener('blur', () => {
	  isPageFocused = false;
	});
	
	// This will update isNewMessageNotificationEnabled when the permission is already granted or denied
	afterUpdate(() => {
	  isNewMessageNotificationEnabled = Notification.permission === 'granted';
	});
  

	function sendMessage(message) {
    if (!userName.trim()) {
      showError('Please enter your name before sending messages.');
      return;
    }

    if (message.content.trim() === '') {
      showError('Please enter a non-empty message.');
      return;
    }

    if (message.content.length > maxMessageLength) {
      showError(`Message length should be less than ${maxMessageLength} characters.`);
      return;
    }

    clearError();
    try {
      ws.send(JSON.stringify({ ...message, sender: userName }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle the error, e.g., display a notification to the user about the failure.
      showError('Failed to send the message. Please try again later.');
    }
  }

  function showError(message) {
    errorMessage = message;
	document.querySelector('.input-box').classList.add('error');
  }


  function clearError() {
    errorMessage = '';
	document.querySelector('.input-box').classList.remove('error');
  }

	
  
	function joinChat() {
	  if (userName.length > 1) {
		// Send user information to the server
		ws.send(JSON.stringify({ type: 'user', user: userName }));
		hasJoinedChat = true;
		requestNotificationPermission();
	  } else {
		console.log('Please enter your name before joining the chat.');
	  }
	}
  </script>
  
  <main>
	<h1>SVELTE CHAT APP</h1>
  
	{#if !hasJoinedChat}
	  <div class="input-box">
		<input type="text" bind:value={userName} placeholder="Enter your name" />
		<button on:click={joinChat}>Join Chat</button>
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
		{#if errorMessage}
		 <ErrorMessage message={errorMessage} onClose={clearError} />
	  {/if}  
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
	  color: #007bff;
	}
  
	.input-box {
	  display: flex;
	  margin-bottom: 20px;
	  animation: slide-up 0.3s;
	}
  
	@keyframes slide-up {
	  from {
		transform: translateY(50px);
		opacity: 0;
	  }
	  to {
		transform: translateY(0);
		opacity: 1;
	  }
	}
  
	@keyframes slide-down {
	  from {
		transform: translateY(0);
		opacity: 1;
	  }
	  to {
		transform: translateY(50px);
		opacity: 0;
	  }
	}
  
	input[type="text"] {
	  flex: 1;
	  padding: 10px;
	  border: 1px solid #ccc;
	  border-radius: 4px;
	  font-size: 16px;
	  outline: none;
	}
  
	button {
	  padding: 10px 20px;
	  border: none;
	  background-color: #007bff;
	  color: #fff;
	  border-radius: 4px;
	  cursor: pointer;
	  font-size: 16px;
	  transition: background-color 0.3s;
	}
  
	button:hover {
	  background-color: #0056b3;
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
	  color: #007bff;
	}
  
	.user-list p {
	  margin: 0;
	  margin-bottom: 5px;
	}
  </style>