import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 18 * 7 // 18 weeks
const amountDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = Array<{
  id: string
  date: string
  amount: number
  completed: number
}>

export function SummaryTable() {
  const [summaryData, setSummaryData] = useState<Summary>([])

  useEffect(() => {
    (async () => {
      const response = await api.get('/summary')
      setSummaryData(response.data)
    })()
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => (
          <div 
            key={`${weekDay}-${index}`}
            className="text-zinc-400 font-bold text-xl h-10 w-10 flex items-center justify-center"
          >
            {weekDay}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryData.length && summaryDates.map(date => {
          const dayInSummary = summaryData.find(day => dayjs(date).isSame(day.date, 'day'))

          return <HabitDay key={date.toString()}
            date={date}
            defaultCompleted={dayInSummary?.completed}
            amount={dayInSummary?.amount}
          />
        })}

        {amountDaysToFill > 0 && Array.from({ length: amountDaysToFill }).map((_, index) => {
          return <div key={index} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"/>
        })}
      </div>
    </div>
  )
}