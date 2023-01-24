import { View, ScrollView, Text, Alert } from "react-native";
import HabitDay from "../components/HabitDay";
import { Header } from "../components/Header";

import { DAY_SIZE } from "../components/HabitDay";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const daysFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDateSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDateSize - daysFromYearStart.length;

type SummaryType = Array<{
  date: Date;
  completed: number;
  amount: number;
}>;

export function Home() {
  const { navigate } = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryType>([]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const { data } = await api.get("/summary");
      setSummary(data);
    } catch (err) {
      console.log(err);
      Alert.alert("Ops", "Não foi possível carregar os dados dos hábitos");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2 ">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {summary && (
          <View className="flex-row flex-wrap ">
            {daysFromYearStart.map((date) => {
              const daysWithHabits = summary.find(summaryDay => dayjs(date).isSame(summaryDay.date, 'day'))

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amountOfHabits={daysWithHabits?.amount}
                  amountCompleted={daysWithHabits?.completed}
                  onPress={() =>
                    navigate("habit", {
                      date: date.toISOString(),
                    })
                  }
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
