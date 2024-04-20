import type { AnimationItem } from 'lottie-web'

export interface LottieConfig {
	id?: string
	src: string
	player?: 'light' | 'full'
	loop?: boolean
	autoplay?: boolean | 'visible'
	visibleThreshold?: number
}

export type Lottie = Readonly<
	{
		id: string
		config: LottieConfig
		container: HTMLElement
	} & (
		| {
				isLoaded: true
				player: AnimationItem
		  }
		| {
				isLoaded: false
				player: undefined
		  }
	)
>

export type AstroLottie = {
	/**
	 * Get an animation by the configured id
	 */
	getAnimation(id: string): Lottie | undefined

	/**
	 * Get an animation from the hosting element container
	 */
	getAnimation(from: { container: HTMLElement }): Lottie | undefined

	/**
	 * Get an animation from the hosting element container
	 */
	getAnimation(from: { elementId: string }): Lottie | undefined

	/**
	 * Get all animation for the current page
	 */
	getAllAnimations(): Lottie[]

	// /**
	//  * Get the current player mode
	//  */
	// getPlayerMode(): 'light' | 'full'

	// /**
	//  * Get the current observer
	//  */
	// getObserver(): IntersectionObserver | undefined
}
