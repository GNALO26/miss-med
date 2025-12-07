import { useState, useEffect, useCallback } from 'react'

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventPassed: false,
    totalSeconds: 0
  })

  const calculateTimeLeft = useCallback(() => {
    const target = new Date(targetDate).getTime()
    const now = new Date().getTime()
    const difference = target - now

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEventPassed: true,
        totalSeconds: 0
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
    const totalSeconds = Math.floor(difference / 1000)

    return {
      days,
      hours,
      minutes,
      seconds,
      isEventPassed: false,
      totalSeconds
    }
  }, [targetDate])

  const formatTime = useCallback((value) => {
    return value.toString().padStart(2, '0')
  }, [])

  const getProgressPercentage = useCallback((startDate, endDate) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()

    if (now <= start) return 0
    if (now >= end) return 100

    const total = end - start
    const elapsed = now - start
    return Math.min(100, (elapsed / total) * 100)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const formattedTime = {
    days: formatTime(timeLeft.days),
    hours: formatTime(timeLeft.hours),
    minutes: formatTime(timeLeft.minutes),
    seconds: formatTime(timeLeft.seconds)
  }

  const isLessThan = (unit, value) => {
    const unitMap = {
      days: timeLeft.days,
      hours: timeLeft.hours,
      minutes: timeLeft.minutes,
      seconds: timeLeft.seconds
    }
    return unitMap[unit] < value
  }

  const getTimeString = useCallback((format = 'full') => {
    const { days, hours, minutes, seconds } = timeLeft
    
    switch (format) {
      case 'short':
        if (days > 0) return `${days}j ${hours}h`
        if (hours > 0) return `${hours}h ${minutes}m`
        if (minutes > 0) return `${minutes}m ${seconds}s`
        return `${seconds}s`
      
      case 'compact':
        if (days > 0) return `${days} jours`
        if (hours > 0) return `${hours} heures`
        if (minutes > 0) return `${minutes} minutes`
        return `${seconds} secondes`
      
      case 'full':
      default:
        return `${days} jours, ${hours} heures, ${minutes} minutes, ${seconds} secondes`
    }
  }, [timeLeft])

  return {
    ...timeLeft,
    formattedTime,
    isLessThan,
    getProgressPercentage,
    getTimeString,
    hasEnded: timeLeft.isEventPassed,
    isEndingSoon: timeLeft.days < 7
  }
}