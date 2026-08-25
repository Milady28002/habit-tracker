import { useEffect, useState } from "react"
import HabitForm from "./components/HabitForm"
import HabitList from "./components/HabitList"
import Stats from "./components/Stats"
import History from "./components/History"
import {
  fetchHabits,
  createHabit,
  toggleHabit,
  deleteHabit,
  updateHabit
} from "./services/habitService"

import LoginForm from "./components/LoginForm"
import { getToken, loginUser, removeToken } from "./services/auth"

function App() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState("")
  const [filter, setFilter] = useState("today")
  const [selectedDays, setSelectedDays] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [authError, setAuthError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken())
  const [editingHabitId, setEditingHabitId] = useState(null)
  const [selectedFilterDay, setSelectedFilterDay] = useState("")
  const [currentPage, setCurrentPage] = useState("habits")

  const today = new Date()
    .toLocaleDateString("fr-FR", { weekday: "long" })
    .toLowerCase()

  const todayDate = new Date().toISOString().split("T")[0]

  const [currentDate, setCurrentDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  )

  const weekDays = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche"
  ]

  useEffect(() => {
    if (isLoggedIn) {
      loadHabits()
    }
  }, [isLoggedIn, currentDate])

  function handleEditHabit(habit) {
    setNewHabit(habit.title)
    setSelectedDays(habit.days || [])
    setEditingHabitId(habit.id)
    setErrorMessage("")
  }

  async function handleLogin(credentials) {
    try {
      await loginUser(credentials)
      setIsLoggedIn(true)
      setAuthError("")
      setErrorMessage("")
    } catch (error) {
      setAuthError("Connexion impossible. Vérifie tes identifiants.")
      console.error(error)
    }
  }

  function handleLogout() {
    removeToken()
    setIsLoggedIn(false)
    setHabits([])
    setNewHabit("")
    setSelectedDays([])
    setEditingHabitId(null)
  }

 async function loadHabits() {
    try {
      const data = await fetchHabits(currentDate)
      setHabits(Array.isArray(data) ? data : [])
      setErrorMessage("")
    } catch (error) {
      setHabits([])
      setErrorMessage("Impossible de charger les habitudes.")
      console.error(error)
    }
  }

  function handleToggleDay(day) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day))
      return
    }

    setSelectedDays([...selectedDays, day])
  }

  function normalizeText(text) {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }


  async function handleAddHabit() {
    const trimmedHabit = newHabit.trim()

    if (trimmedHabit === "") {
      setErrorMessage("Veuillez saisir une habitude.")
      return
    }

    const normalizedNewHabit = normalizeText(trimmedHabit)

    const habitAlreadyExists = habits.some(
      (habit) =>
        normalizeText(habit.title) === normalizedNewHabit &&
        habit.id !== editingHabitId
    )

    if (habitAlreadyExists) {
      setErrorMessage("Cette habitude existe déjà.")
      return
    }

    try {
      if (editingHabitId) {
        await updateHabit(editingHabitId, {
          title: trimmedHabit,
          days: [...selectedDays]
        })
      } else {
        await createHabit({
          title: trimmedHabit,
          days: [...selectedDays]
        })
      }

      await loadHabits()
      setNewHabit("")
      setSelectedDays([])
      setEditingHabitId(null)
      setErrorMessage("")
    } catch (error) {
      setErrorMessage(
        editingHabitId
          ? "Impossible de modifier l’habitude."
          : "Impossible de créer l’habitude."
      )
      console.error(error)
    }
  }

 async function handleDeleteHabit(idToDelete) {
    try {
      await deleteHabit(idToDelete)
      await loadHabits()

      if (editingHabitId === idToDelete) {
        setNewHabit("")
        setSelectedDays([])
        setEditingHabitId(null)
      }

      setErrorMessage("")
    } catch (error) {
      setErrorMessage("Impossible de supprimer l’habitude.")
      console.error(error)
    }
  }
  
  async function handleToggleHabit(idToToggle) {
    try {
      const data = await toggleHabit(idToToggle, currentDate)

      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === idToToggle
            ? { ...habit, done: data.habit.done }
            : habit
        )
      )

      setErrorMessage("")
    } catch (error) {
      setErrorMessage("Impossible de modifier l’habitude.")
      console.error(error)
    }
  }


  function isHabitPlannedForDay(habit, day) {
  if (!habit.days || habit.days.length === 0) {
    return true
  }

  return habit.days.includes(day)
  }

  function getDateForWeekDay(day) {
    const translations = {
      lundi: 1,
      mardi: 2,
      mercredi: 3,
      jeudi: 4,
      vendredi: 5,
      samedi: 6,
      dimanche: 0,
    }

    const todayDateObject = new Date()
    const currentDay = todayDateObject.getDay()
    const targetDay = translations[day]

    const difference = targetDay - currentDay

    todayDateObject.setDate(todayDateObject.getDate() + difference)

    return todayDateObject.toISOString().split("T")[0]
  }
  const filteredHabits = Array.isArray(habits)
    ? habits.filter((habit) => {
        if (filter === "all") {
          return true
        }

        if (filter === "today") {
          return isHabitPlannedForDay(habit, today)
        }

        if (filter === "todo") {
          return isHabitPlannedForDay(habit, today) && !habit.done
        }

        if (filter === "done") {
          return isHabitPlannedForDay(habit, today) && habit.done
        }

        if (filter === "day") {
          return isHabitPlannedForDay(habit, selectedFilterDay)
        }

        return true
      })
    : []

  const todayHabits = habits.filter((habit) =>
    isHabitPlannedForDay(habit, today)
  )

  const completedTodayHabits = todayHabits.filter((habit) => habit.done).length
  const totalTodayHabits = todayHabits.length

  const completedHabits = filteredHabits.filter((habit) => habit.done).length
  const totalHabits = filteredHabits.length

    return (
    <main className="app">
      <div className="container">
        <h1 className="app-title">Habit Tracker</h1>

        {!isLoggedIn ? (
          <LoginForm handleLogin={handleLogin} authError={authError} />
        ) : (
          <>
            <div className="app-topbar">
              <div>
                <p className="today-label">Aujourd’hui : {today}</p>
                <p className="habit-counter">
                  {completedTodayHabits} habitude{completedTodayHabits > 1 ? "s" : ""} terminée
                  {completedTodayHabits > 1 ? "s" : ""} sur {totalTodayHabits}
                </p>
              </div>

              <button className="btn btn-logout" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>

            <div className="page-tabs">
              <button
                className={currentPage === "habits" ? "btn btn-filter active" : "btn btn-filter"}
                onClick={() => setCurrentPage("habits")}
              >
                Habitudes
              </button>

              <button
                className={currentPage === "stats" ? "btn btn-filter active" : "btn btn-filter"}
                onClick={() => setCurrentPage("stats")}
              >
                Stats
              </button>

              <button
                className={currentPage === "history" ? "btn btn-filter active" : "btn btn-filter"}
                onClick={() => setCurrentPage("history")}
              >
                Historique
              </button>
            </div>

            {currentPage === "stats" && (
              <Stats
                totalTodayHabits={totalTodayHabits}
                completedTodayHabits={completedTodayHabits}
              />
            )}

            {currentPage === "history" && <History />}

            {currentPage === "habits" && (
              <>

            <div className="filters">
              <button
                className={filter === "today" ? "btn btn-filter active" : "btn btn-filter"}
                onClick={() => {setFilter("today") 
                  setSelectedFilterDay("")
                  setCurrentDate(todayDate)
                }}
              >
                Aujourd’hui
              </button>

              <button
                className={filter === "all" ? "btn btn-filter active" : "btn btn-filter"}
                onClick={() => {setFilter("all")
                  setSelectedFilterDay("")
                }}
              >
                Toutes
              </button>

              <button
                className={filter === "todo" ? "btn btn-filter active" : "btn btn-filter"}
                onClick={() => {setFilter("todo")
                  setSelectedFilterDay("")
                }}
              >
                À faire
              </button>

              <button
                className={filter === "done" ? "btn btn-filter active" : "btn btn-filter"}
                onClick={() => {setFilter("done")
                  setSelectedFilterDay("")
                }}
              >
                Terminées
              </button>
            </div>
            <p className="section-label">Consulter par jour</p>

            <div className="day-filters">
              {weekDays.map((day) => (
                <button
                  key={day}
                  className={selectedFilterDay === day ? "btn btn-day-filter active" : "btn btn-day-filter"}
                  onClick={() => {
                    setFilter("day")
                    setSelectedFilterDay(day)
                    setCurrentDate(getDateForWeekDay(day))
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <HabitForm
              newHabit={newHabit}
              setNewHabit={setNewHabit}
              handleAddHabit={handleAddHabit}
              weekDays={weekDays}
              selectedDays={selectedDays}
              handleToggleDay={handleToggleDay}
              errorMessage={errorMessage}
              editingHabitId={editingHabitId}
            />

            <HabitList
              habits={filteredHabits}
              handleToggleHabit={handleToggleHabit}
              handleDeleteHabit={handleDeleteHabit}
              handleEditHabit={handleEditHabit}
              filter={filter}
              today={today}
            />
          </>
        )}
      </>
    )}
      </div>
    </main>
  )
}

export default App