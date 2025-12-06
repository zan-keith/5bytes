<script>
    // import Button from "$lib/components/ui/button/button.svelte";


    // import Input from "$lib/components/ui/input/input.svelte";

</script>
<form method="POST" action="?/login">
    <label>
      Email
      <input name="email" type="email" />
    </label>
    <label>
      Password
      <input name="password" type="password" />
    </label>
    <button>Login</button>
    <button formaction="?/signup">Sign up</button>
  </form>