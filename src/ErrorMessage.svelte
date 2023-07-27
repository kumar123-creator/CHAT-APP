<script>
 import { slide } from 'svelte/transition';

    export let message;
    export let onClose;
  </script>
  
  <div class="overlay" transition:slide>
    <div class="modal">
      <p>{message}</p>
      <button on:click={onClose}>Close</button>
    </div>
  </div>
  
  <style>
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
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
  
    .modal {
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  
    p {
      margin: 0;
      margin-bottom: 10px;
      font-size: 16px;
      color: red;
      font-weight: bold;
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
  </style>
  