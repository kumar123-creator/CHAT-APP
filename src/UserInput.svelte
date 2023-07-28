<script>
    import { getDatabase, ref, push } from 'firebase/database';
  
    let newMessage = '';
    let senderName = '';
  
    // Function to handle the user sending a new message
    const handleSubmit = () => {
      if (newMessage.trim() !== '') {
        const database = getDatabase();
        const newMessageRef = push(ref(database, 'messages'), {
          senderName,
          messageContent: newMessage,
          timestamp: Date.now(),
        });
  
        newMessage = ''; // Clear the input box after sending the message
      }
    };
  </script>
  
  <style>
    /* Add your custom styles for the user input component here */
  </style>
  
  <div class="input-box">
    <input type="text" bind:value="{newMessage}" placeholder="Type your message here..." on:keyup="{(e) => e.key === 'Enter' && handleSubmit()}" />
    <button on:click="{handleSubmit}">Send</button>
  </div>
  