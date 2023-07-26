<script>
     import { fade } from 'svelte/transition';

    export let messages;
    export let sendMessage;
    export let userName;
  
    let newMessage = '';
  
    function handleSubmit() {
      if (newMessage.trim() !== '') {
        sendMessage({
          type: 'message', // Add the 'type' property to distinguish between user info and messages
          sender: userName,
          content: newMessage,
          timestamp: new Date().toISOString(),
        });
  
        newMessage = '';
      }
    }

  </script>
  
  <div class="chat-box">
    {#each messages as message }
      <div class="message" transition:fade>
        <p class="message-sender">{message.sender}:</p>
        <p class="message-content">{message.content}</p>
        <small class="message-timestamp">{message.timestamp}</small>
      </div>
    {/each}
  
    <div class="input-box">
      <input type="text" bind:value={newMessage} on:keyup={(e) => e.key === 'Enter' && handleSubmit()} placeholder="Type your message here..." />
      <button on:click={handleSubmit}>Send</button>
    </div>
  </div>
  
  <style>
    .chat-box {
      display: flex;
      flex-direction: column;
      padding: 10px;
      flex: 1;
      max-height: calc(100vh - 200px); /* Adjust this value to leave space for the user-list and input-box */
      overflow-y: auto;
    }
  
    .message {
      background-color: #f5f5f5;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
      animation: fade-in 0.3s;
    }

    @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
    .message p {
      margin: 0;
    }
  
    .message-sender {
      color: #007bff;
      font-weight: bold;
    }
  
    .message-content {
      margin-top: 5px;
    }
  
    .message-timestamp {
      color: #888;
      font-size: 12px;
    }
  
    .input-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
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
      background-color: green;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 8px;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  </style>
  