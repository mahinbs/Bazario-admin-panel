import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Keyboard } from '@capacitor/keyboard'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

export const useMobile = () => {
  const [isNative, setIsNative] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const checkPlatform = async () => {
      const platform = Capacitor.getPlatform()
      setIsNative(Capacitor.isNativePlatform())
      setIsIOS(platform === 'ios')
      setIsAndroid(platform === 'android')

      if (Capacitor.isNativePlatform()) {
        // Listen for keyboard events
        Keyboard.addListener('keyboardWillShow', (info) => {
          setKeyboardHeight(info.keyboardHeight)
        })

        Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardHeight(0)
        })

        // Listen for app state changes
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive)
        })

        App.addListener('appUrlOpen', (data) => {
          console.log('App opened with URL:', data.url)
        })
      }
    }

    checkPlatform()

    return () => {
      if (Capacitor.isNativePlatform()) {
        Keyboard.removeAllListeners()
        App.removeAllListeners()
      }
    }
  }, [])

  const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style })
      } catch (error) {
        console.log('Haptics not available')
      }
    }
  }

  const exitApp = async () => {
    if (Capacitor.isNativePlatform()) {
      await App.exitApp()
    }
  }

  return {
    isNative,
    isIOS,
    isAndroid,
    keyboardHeight,
    hapticFeedback,
    exitApp
  }
}
