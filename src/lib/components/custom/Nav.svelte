  <script>
    import { cn } from "$lib/utils";
  import { scrollY } from "svelte/reactivity/window";
  import Menu from "@lucide/svelte/icons/menu";
  import X from "@lucide/svelte/icons/x";
    import Button from "../ui/button/button.svelte";
//   let menuItems= [
//     { name: "Dashboard", href: "/dashboard" },
//     { name: "Solution", href: "#a" },
//     { name: "Pricing", href: "#a" },
//     { name: "About", href: "#a" },
//   ];

  let menuState = $state(false);
  let isScrolled = $derived.by(() => {
    if (scrollY.current !== undefined && scrollY.current > 50) {
      return true;
    }
    return false;
  });
  </script>
<ul>
    <li>
        <a href="/">Home</a>
        <a href="/private">Private</a>
        <a href="/auth">Login</a>
    </li>
</ul>