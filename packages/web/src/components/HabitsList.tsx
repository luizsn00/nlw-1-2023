import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { CheckboxComp } from "./Checkbox"

interface HabitsListProps {
  date: Date
  onCompletedChange(completed: number): void 
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string
    title: string
    created_at: string
  }>
  completedHabits: string[]
}

export function HabitsList({ date, onCompletedChange }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  useEffect(() => {
    api
      .get("day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((response) => setHabitsInfo(response.data))
  }, [date])

  async function handleToggleCheckHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`)

    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)

    let completedHabits: string[] = []

    if(isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(completedHabit => completedHabit !== habitId)
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    })

    onCompletedChange(completedHabits.length)
  }

  const isDayInPast = dayjs(date).endOf('day').isBefore(new Date())

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((possibleHabit) => (
        <CheckboxComp
          key={possibleHabit.id}
          title={possibleHabit.title}
          checked={habitsInfo.completedHabits.includes(possibleHabit.id)}
          disabled={isDayInPast}
          throughToCheck
          onCheckedChange={() => handleToggleCheckHabit(possibleHabit.id)}
        />
      ))}
    </div>
  )
}
