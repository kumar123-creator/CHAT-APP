<script>
  let onlineUsers = [];
</script>

<style>
  /* Add your custom styles for the user list component here */
</style>

<div class="user-list">
  <h3>Online Users:</h3>
  {#each onlineUsers as user}
    <p class="user">{user}</p>
  {/each}
</div>
