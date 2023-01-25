import { useEffect } from "react"
import { View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated"

interface ProgressBarProps {
  progress?: number
}

export function ProgressBar({ progress = 0}: ProgressBarProps) {
  const progressPercentage = useSharedValue(progress > 100 ? 100 : progress)  

  const style = useAnimatedStyle(() => ({
    width: `${progressPercentage.value}%`
  }))

  useEffect(() => {
    progressPercentage.value = withDelay(500, withTiming(progress))
  }, [progress])

  return (
    <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
      <Animated.View className="h-3 rounded-xl bg-violet-600"
        style={style}
      >
      </Animated.View>
    </View>
  )
}