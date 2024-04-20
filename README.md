# Astro × Lottie

The next level 🔥 experience of Astro 🚀 in a frenzy of Lottie wizardry 🪄

## Getting started 🎯

```sh
(bunx|npx|pnpx) astro add @advanced-astro/lottie
```

### Manual Installation 🧑‍💻

**@advanced-astro/lottie** requires **lottie-web** to be installed as well

```sh
(bun|npm|pnpm) i @advanced-astro/lottie lottie-web
```

Add it to your `astro.config` integrations list

```ts
import { defineConfig } from "astro/config";
import lottie from "@advanced-astro/lottie";

export default defineConfig({
  integrations: [
    lottie(), // <-- now you're ready!
  ]
});
```

### Type support 🏷️

This integration defines the `astroLottie` global object to interact with your animations inside a page.
Details on the [dedicated section](#accessing-the-lottie-player).
You can have full type info of the `astroLottie` object with an environment reference.

Create an `env.d.ts` or, if you already have one, add the following line:

```ts
/// <reference types="@advanced-astro/lottie/env" />
```

### Component 🧩

Inside your astro page or component, you can import the Lottie component.
It supports props autocompletion and type checking.

```astro
---
import Lottie from "@advanced-astro/lottie/Lottie.astro";
---
<div class="container">
    <Lottie src="assets/animation.json" />
</div>
```

### Styling, sizing and constraints

You can use a parent `div` as a container to set the size and set additional styling (background, ...).

You can either use the `style` attribute or reference a css `class`.

```html
<!-- with css class -->
<div class="container">
    <Lottie src="assets/animation.json" />
</div>

<!-- or style -->
<div style="height: 256px; width: 256px;">
    <Lottie src="assets/animation.json"  />
</div>
```

## How `Astro Lottie` works

### Player loading

The lottie player is not bundled within your page.
It's asynchronously fetched only when a page contains at least one lottie animation.

This package allows to load two players:

- `light`: small player with only svg rendering
- `full`: all featured player, with all capabilities

You can read more about lottie players in the [Lottie repository](https://github.com/airbnb/lottie-web).

When a page contains multiple animations with different players specified, the _greater_ player will be loaded.
So to load the light player, all animation musts set the `player="light"` (or no player at all, as the default one is the `"light"`).

The lottie player is locally saved in the public folder (it's handled under the hood by astro/vite) so no external request is sent.

### Animation loading

The lottie animations are not bundled in your page.
They're asynchronously fetched when the page loading ends, when a small loader script is run.

The loader will

- check if the page has any lottie animations
- fetch the lottie player
- download the animations (if one is used multiple times, it's downloaded once)
- setup each the animation on the page
- if the autoplay is `true`, the animation is started right away, otherwise the animation will play only when it's visible and paused when it exits the screen.
This is achieved thanks to `IntersectionObserver`, with a visibility filter 0.01.
- raise a document event `astro-lottie-loaded` when all animations are loaded and ready

### Accessing the Lottie Player

This plugin registers a `astroLottie` global object for the page.

```ts
const astroLottie = window.astroLottie;
if (!astroLottie) {
  // lottie is not registered! Either ...
  // - no lottie animation is present on this page
  // - lottie library failed to load
} else {
  const animation = astroLottie.getAnimation("my-animation");
  animation.player.play();
}
```

The `AstroLottie` has two features:

- getting a specific animation by a key
- getting all animations present in the page

The full specification is:

```ts
export type AstroLottie = {
    /**
     * Get animation by the configured id
     */
    getAnimation(id: string): Lottie | undefined

    /**
     * Get animation from the hosting element container
     */
    getAnimation(from: { container: HTMLElement }): Lottie | undefined

    /**
     * Get animation from the hosting element container
     */
    getAnimation(from: { elementId: string }): Lottie | undefined

    /**
     * Get all animations for the current page
     */
    getAllAnimations(): Lottie[]
}
```

`Lottie` represents a single animation registered for the current page and is defined with:

```ts
export type Lottie = Readonly<{
  id: string             // the specified id es: <Lottie id="my-animation" />
  config: LottieConfig   // the full lottie configuration of the Lottie element
  container: HTMLElement // the hosting dom element container
  isLoaded: boolean      // specify if the animation is successfully loaded
  player?: AnimationItem // this is the real Lottie player. It's defined when isLoaded is true
}>
```

The `player` property is the Lottie player, typed by the Lottie library itself.
You can checkout [Lottie](https://github.com/airbnb/lottie-web#usage) repository for the documentation.

For example if you need to start an animation on demand when a button is clicked.

```ts
document.querySelector("#play-button").addEventListener("click", () => {
  const animation = astroLottie.getAnimation("my-animation");
  if (animation && animation.isLoaded) {
    animation.player.play();
  }
});
```

### Animation ready event

The loader emit a document event `astro-lottie-loaded` when all animations are loaded and ready.
The `details` property of the event, is the `astroLottie` global object.

```ts
document.addEventListener("astro-lottie-loaded", e => {
  const astroLottie = e.details;
  const animations = astroLottie.getAllAnimations();
});
```

## Reference

### LottieConfig --> the Lottie component Props

| property | type                  | usage                 | description                                      |
|:---------|:----------------------|:----------------------|:-------------------------------------------------|
| id       | `string`              | optional              | access the relative lottie player via javascript |
| src      | `string`              | required              | path from where the animation will be downloaded |
| player   | `"light"` \| `"full"` | optional(`"light"`)   | which lottie player to load                      |
| loop     | `boolean`             | optional(`true`)      | play the animation on loop                       |
| autoplay | `true` \| `"visible"` | optional(`"visible"`) | start as soon it loads or only when it's visible |
| visibleThreshold | `number` | optional(`0`) | Range[0-1] for the visibility to start the animation: 1 means 100% visible, 0 means that just 1px will make the animation play. When multiple animations on the same page use different thresholds, the minimum will be used for all |

## Tech Stack

- [Astro][astro]
- [Lottie][lottie]
- [Typescript][ts]

## License 

[MIT](LICENSE.md) © 2024 [Marc Redwerkz][rdwz], © 2022 [Giuseppe La Torre][giuseppelt]

[astro]: https://astro.build
[lottie]: https://airbnb.io/lottie
[ts]: https://www.typescriptlang.org/
[rdwz]: https://github.com/rdwz
[giuseppelt]: https://github.com/giuseppelt
