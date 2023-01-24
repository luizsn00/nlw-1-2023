import { ActivityIndicator, View } from "react-native"

export function Loading() {
  return (
  <View 
    className="flex-1 justify-center items-center bg-zinc-900">
      <ActivityIndicator color={"#7C3AED"}></ActivityIndicator>
    </View>
  )
}