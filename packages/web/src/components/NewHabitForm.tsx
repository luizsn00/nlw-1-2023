import { FormEvent, useState } from "react"

import { Check } from "phosphor-react"
import { CheckboxComp } from "./Checkbox"
import { api } from "../lib/axios"

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

export  function  NewHabitForm() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  async function createNewHabit(event: FormEvent) {
    event.preventDefault()

    if(!title || !weekDays.length) return

    try {
      await api.post('/habits', {
        title,
        weekDays
      })
  
      alert('Hábito criado com sucesso')
      setTitle('')
      setWeekDays([])
    } catch(e) {
      alert('Não foi possível cadastrar o hábito')
    }
  }

  function handleSelectWeekDay(weekDayIndex: number) {
    if(weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
      return;
    }

    setWeekDays(prevState => [...prevState, weekDayIndex])
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 focus:ring-offset-zinc-900"
        autoFocus
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => (
          <CheckboxComp 
            key={weekDay} 
            title={weekDay} 
            onCheckedChange={() => handleSelectWeekDay(index)} 
            checked={weekDays.includes(index)}  
          />
        ))}
      </div>

      <button type="submit" className="mt-6 p-4 rounded-lg flex justify-center items-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2  focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900">
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  )
}