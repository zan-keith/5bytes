<script lang="ts">
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  const teamMembers = ["Abiram", "Samar", "Sangeeth", "Sahithi Reddy", "Prem"];

  const learningHighlights = [
    "Provides a learning path",
    "Step-by-step explanations tailored to your level",
    "Interactive problem-solving sessions",
    "Progress tracking and adaptive learning paths"
  ];

  const challenges = [
    {
      title: "The problem",
      description:
        "Millions of students lack access to quality tutoring. Only a small fraction can afford private tutors, leaving many behind."
    },
    {
      title: "Learning pace",
      description:
        "Traditional classrooms move at fixed speeds. Students who need more time or want to accelerate are underserved."
    },
    {
      title: "24/7 support",
      description:
        "Learning does not stop at 3 PM. Students need help when homework is due at midnight or inspiration strikes on weekends."
    }
  ];

  const impactStats = [
    {
      value: "10x",
      label: "Cost reduction",
      description: "Making quality tutoring affordable and accessible to everyone, anywhere."
    },
    {
      value: "24/7",
      label: "Always available",
      description: "Learning support whenever students need it, not just during school hours."
    },
    {
      value: "100%",
      label: "Personalized",
      description: "Every interaction is tailored to individual learning styles and knowledge levels."
    }
  ];

  const nextSteps = [
    "Expanding subject coverage",
    "Adding voice interaction",
    "Building collaborative learning features"
  ];
</script>

<svelte:head>
  <title>ByteBuddy | Your AI-Powered Learning Companion</title>
  <meta
    name="description"
    content="ByteBuddy is an AI-powered educational platform delivering personalized tutoring, interactive problem solving, and adaptive learning paths."
  />
</svelte:head>

<main class="flex min-h-screen flex-col bg-gradient-to-b from-primary/5 via-background to-background text-foreground">
  <section class="relative overflow-hidden border-b border-border/60">
    <div class="mx-auto grid max-w-6xl gap-16 px-6 py-24 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
      <div class="space-y-10">
        <div class="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" class="rounded-full px-3 py-1 text-sm font-semibold">
            Track-C | Next-gen education
          </Badge>
          <span class="text-sm uppercase tracking-[0.24em] text-muted-foreground">Team | 5 Bytes</span>
        </div>

        <div class="space-y-6">
          <h1 class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            ByteBuddy
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Your AI-powered learning companion
            </span>
          </h1>
          <p class="max-w-xl text-lg text-muted-foreground">
            An intelligent tutoring system that adapts to your learning style, pace, and knowledge gaps. ByteBuddy delivers
            personalized notes, interactive quizzes, and real-time support so you can learn confidently wherever you are.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <Button href="/auth" class="w-full sm:w-auto">
            Start learning
            <ArrowRight />
          </Button>
          <Button
            href="https://github.com/zan-keith/5bytes"
            variant="outline"
            class="w-full sm:w-auto"
            rel="noreferrer"
            target="_blank"
          >
            View code on GitHub
            <ChevronRight />
          </Button>
        </div>

        <div class="rounded-2xl border border-border/70 bg-background/70 p-6 shadow-sm backdrop-blur-sm">
          <h2 class="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Team 5 Bytes</h2>
          <ul class="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {#each teamMembers as member}
              <li class="flex items-center gap-2">
                <span class="size-1.5 rounded-full bg-primary/80" aria-hidden="true"></span>
                {member}
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="relative">
        <div class="absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-3xl"></div>
        <div class="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-lg backdrop-blur">
          <h2 class="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Why it resonates</h2>
          <p class="mt-6 text-lg font-semibold text-foreground">
            "ByteBuddy adapts to every student, delivering support the moment curiosity strikes."
          </p>
          <p class="mt-4 text-sm text-muted-foreground">
            Whether you need a late-night study partner, concise notes, or interactive practice, ByteBuddy keeps learning
            personal and always within reach.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="border-b border-border/60 bg-card/60">
    <div class="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr,1.2fr] lg:items-center">
      <div class="space-y-5">
        <h2 class="text-3xl font-semibold sm:text-4xl">What is ByteBuddy?</h2>
        <p class="text-base text-muted-foreground">
          ByteBuddy is an AI-powered educational platform that provides personalized tutoring across any subject. It understands
          how you learn, highlights knowledge gaps, and guides you through each lesson with clarity and care.
        </p>
        <p class="text-base text-muted-foreground">
          Unlike traditional tools, ByteBuddy delivers an adaptive experience that blends intelligent note-taking, quizzes, and
          notifications delivered straight to the channels you use most.
        </p>
      </div>

      <div class="grid gap-4">
        {#each learningHighlights as highlight}
          <div class="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm">
            <div class="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true"></div>
            <p class="text-base text-foreground">{highlight}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="border-b border-border/60">
    <div class="mx-auto max-w-6xl px-6 py-20">
      <h2 class="text-center text-3xl font-semibold sm:text-4xl">Why ByteBuddy matters</h2>
      <p class="mx-auto mt-4 max-w-2xl text-center text-base text-muted-foreground">
        We are closing the gap between eager learners and the support they deserve. ByteBuddy brings dependable, personal help
        to every student, whenever it is needed.
      </p>
      <div class="mt-12 grid gap-6 md:grid-cols-3">
        {#each challenges as item}
          <div class="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-foreground">{item.title}</h3>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>


  <section class="border-b border-border/60">
    <div class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
        <div class="space-y-6">
          <h2 class="text-3xl font-semibold sm:text-4xl">How it works</h2>
          <p class="text-base text-muted-foreground">
            ByteBuddy blends AI-driven insights with human-centric design. From the first assessment, we tailor each learning path
            with interactive quizzes, personalized notes, and actionable guidance that keeps students progressing confidently.
          </p>
          <Button
            href="https://github.com/zan-keith/5bytes"
            variant="outline"
            class="w-full sm:w-auto"
            rel="noreferrer"
            target="_blank"
          >
            Explore our build
            <ChevronRight />
          </Button>
        </div>

        <div class="space-y-4 rounded-3xl border border-border/60 bg-card/80 p-8 shadow-sm">
          <h3 class="text-lg font-semibold text-foreground">Join the learning revolution</h3>
          <p class="text-sm text-muted-foreground">
            Our vision is a world where every student experiences world-class tutoring, regardless of location, income, or
            schedule. ByteBuddy makes personalized education a reality today.
          </p>
          <div class="space-y-3">
            <h4 class="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">What's next</h4>
            <ul class="space-y-2 text-sm text-foreground">
              {#each nextSteps as step}
                <li class="flex items-start gap-3">
                  <span class="mt-1 size-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span>
                  {step}
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-4xl px-6 py-20 text-center">
    <div class="rounded-3xl border border-border/60 bg-card/80 p-12 shadow-sm">
      <h2 class="text-3xl font-semibold sm:text-4xl">Thank you for your time!</h2>
      <p class="mt-4 text-base text-muted-foreground">
        Questions? Let&rsquo;s chat about how ByteBuddy can transform education together. Reach out any time &mdash; 24/7 support.
      </p>
      <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="mailto:hello@bytebuddy.ai" class="w-full sm:w-auto">
          Connect with the team
          <ArrowRight />
        </Button>
        <Button href="/auth" variant="ghost" class="w-full sm:w-auto">
          Explore the platform
          <ChevronRight />
        </Button>
      </div>
    </div>
  </section>
</main>
