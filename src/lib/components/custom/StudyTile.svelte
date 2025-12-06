<script>
    import Settings_2 from "@lucide/svelte/icons/settings-2";
    import Badge from "../ui/badge/badge.svelte";

    let {study={}} = $props()
    console.log("StudyTile study:", study);
</script>

<a href="/private/dash/study/{study.id}" class="space-y-2 ">
<div class="flex items-center gap-2 ">
    <Settings_2 class="size-4" />

    <h3 class="text-sm font-medium">{study.title}</h3>
</div>
<Badge class="text-sm">
    {study.paths?.length || 0} learning paths
</Badge>
</a>