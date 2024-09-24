'use client'

import dynamic from 'next/dynamic'

const SpeechToText = dynamic(() => import('./advanced-interview-simulation'), { ssr: false })

export default SpeechToText