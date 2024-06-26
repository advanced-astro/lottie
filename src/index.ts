import fs from 'node:fs/promises'
import type { AstroIntegration } from 'astro'
export type * from './types'

export default function lottie(): AstroIntegration {
	return {
		name: 'astro-lottie',
		hooks: {
			'astro:config:setup': async ({ injectScript }) => {
				const script = await fs.readFile(new URL('./loader.js', import.meta.url), 'utf8')
				injectScript('page', script)
			},
		},
	}
}
