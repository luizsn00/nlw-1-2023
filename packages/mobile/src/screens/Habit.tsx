import { useRoute } from "@react-navigation/native"
import { View, ScrollView, Text, Alert } from "react-native"
import { BackButton } from "../components/BackButton"

import dayjs from "dayjs"
import { ProgressBar } from "../components/ProgressBar"
import { Checkbox } from "../components/Checkbox"
import { useEffect, useState } from "react"
import { Loading } from "../components/Loading"
import { api } from "../lib/axios"
import { generateProgressPercentage } from "../utils/generate-progress-percentage"
import { HabitsEmpty } from "../components/HabitsEmpty"
import clsx from "clsx"

interface Params {
  date: string
}

interface HabitInfoProps {
  completedHabits: string[]
  possibleHabits: Array<{
    id: string
    title: string
    created_at: string
  }>
}

export function Habit() {
  const route = useRoute()
  const {
    date
  } = route.params as Params

  const parsedDate = dayjs(date)
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())

  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  const [isLoading, setIsLoading] = useState(true)
  const [habitInfo, setHabitInfo] = useState<HabitInfoProps>()  

  async function fetchHabits() {
    try {
      setIsLoading(true)

      const { data } = await api.get('day', {
        params: {
          date
        }
      }) 

      setHabitInfo(data)
    } catch(error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível buscar os hábitos do dia')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    let completedHabits: string[] = []
    
    if(habitInfo?.completedHabits.includes(habitId)) {
      completedHabits = habitInfo!?.completedHabits.filter(habit => habit !== habitId)
    } else {
      completedHabits = [...habitInfo!?.completedHabits, habitId]
    }
    
    setHabitInfo({ 
      possibleHabits: habitInfo!?.possibleHabits,
      completedHabits
    })

    try {
      await api.patch(`/habits/${habitId}/toggle`)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  const amountAccomplishedPercentage = habitInfo!?.possibleHabits.length > 0 
  ? generateProgressPercentage(habitInfo!?.possibleHabits.length, habitInfo!?.completedHabits.length )
  : 0
 
  if(isLoading) return <Loading />

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text 
          className="mt-6 text-zinc-400 font-semibold text-base lowercase"
        >
          {dayOfWeek}
        </Text>
        <Text 
          className="text-white font-extrabold text-3xl"
        >
          {dayAndMonth}
        </Text>

        <ProgressBar progress={amountAccomplishedPercentage} />

        <View className={clsx("mt-6 ", {
          ["opacity-70"]: isDateInPast 
        })}>
          {habitInfo?.possibleHabits ?
            habitInfo.possibleHabits.map(habit => (
              <Checkbox
                key={habit.id}
                disabled={isDateInPast}
                title={habit.title}
                checked={habitInfo.completedHabits.includes(habit.id)}
                onPress={() => handleToggleHabit(habit.id)}
              />
            )) : (
              <HabitsEmpty />
            )
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode editar um hábito de uma data passada
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}
