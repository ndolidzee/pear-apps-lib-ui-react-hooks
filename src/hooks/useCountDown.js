import { useState, useEffect, useRef } from 'react'

import { MS_PER_SECOND, SECONDS_PER_MINUTE } from '../constants/time'

/**
 * @param {{
 *  initialSeconds: number,
 *  onFinish?: () => void
 * }} params
 * @returns {string}
 */
export const useCountDown = ({ initialSeconds, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    setTimeLeft(initialSeconds)

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (typeof clearInterval !== 'undefined') {
            clearInterval(intervalId)
          }

          onFinishRef.current?.()

          return 0
        }

        return prev - 1
      })
    }, MS_PER_SECOND)

    return () => {
      if (typeof clearInterval !== 'undefined') {
        clearInterval(intervalId)
      }
    }
  }, [initialSeconds])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE)
    const remainingSeconds = seconds % SECONDS_PER_MINUTE

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return formatTime(timeLeft)
}

export default useCountDown
