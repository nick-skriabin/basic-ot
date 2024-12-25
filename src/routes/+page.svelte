<script lang="ts">
  import { OT } from "$lib/ot";
  import { useOT } from "./ot";

  const ot = new OT("something something, we win");
</script>

<div class="container">
  <textarea use:useOT={{ ot }}></textarea>

  <textarea use:useOT={{ ot }}></textarea>
</div>

<style>
  .container {
    width: 100wv;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
  textarea {
    width: 500px;
    height: 250px;
    font-size: 21px;
  }
</style>
