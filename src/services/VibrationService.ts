import { Vibration } from 'react-native'

export function successVibration() {
    const PATTERN = [100, 100, 100, 100]
    Vibration.vibrate(PATTERN)
}

export function errorVibration() {
    Vibration.vibrate(1000)
}
