<script>
    import { onMount } from 'svelte';
    import { getDatabase, ref, onValue } from 'firebase/database';
  
    let messages = [];
  
    const handleIncomingMessages = () => {
      const database = getDatabase();
      onValue(ref(database, 'messages'), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          messages = Object.keys(data).map((key) => data[key]);
  
          // Filter out messages with undefined sender names or message content
          messages = messages.filter((message) => message.senderName && message.messageContent);
        }
      });
    };
  
    onMount(() => {
      handleIncomingMessages();
    });

  </script>
  
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
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    animation: fade-in 0.3s;
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

  .input-box input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
  }

  .input-box button {
    padding: 10px 20px;
    border: none;
    background-color: green; /* Adjust the background color as needed */
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  .input-box button:hover {
    background-color: #0056b3;
  }
  </style>
  
  <div class="chat-box">
    {#each messages as message}
      <div class="message">
        <p class="message-sender">{message.senderName}:</p>
        <p class="message-content">{message.messageContent}</p>
        <p class="message-timestamp">
          ({new Date(message.timestamp).toLocaleTimeString()})
        </p>
      </div>
    {/each}
  
    </div>
  