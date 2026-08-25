import { useState } from "react"
import { fetchHistory } from "../services/historyService"

export default function History() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [history, setHistory] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  async function handleLoadHistory() {
    if (!startDate || !endDate) {
      setErrorMessage("Veuillez sélectionner une période.")
      return
    }

    try {
      const data = await fetchHistory(startDate, endDate)
      setHistory(data)
      setErrorMessage("")
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("fr-FR")
    }

  return (
    <section className="history-container">
      <h2>Historique des habitudes</h2>

      <div className="history-filters">
        <input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />

        <button className="btn btn-filter" onClick={handleLoadHistory}>
          Afficher
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {history && (
        <div className="history-results">
          <p>
            Période : {formatDate(history.period.start)} au {formatDate(history.period.end)}
          </p>

          {history.habits.length === 0 ? (
            <p>Aucune donnée sur cette période.</p>
          ) : (
            history.habits.map((habit) => (
              <div className="history-card" key={habit.habit}>
                <h3>{habit.habit}</h3>
                <p>Validée {habit.completed} fois sur {habit.plannedDays} jours prévus</p>
                <p>Taux : {habit.completionRate}%</p>
                <p
                    className={
                        habit.completionRate >= 80
                        ? "history-status good"
                        : habit.completionRate >= 40
                        ? "history-status medium"
                        : "history-status bad"
                    }
                    >
                    {
                        habit.completionRate >= 80
                        ? "Bonne régularité"
                        : habit.completionRate >= 40
                        ? "Régularité moyenne"
                        : "Faible régularité"
                    }
                    </p>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                        width: `${habit.completionRate}%`,
                        backgroundColor:
                            habit.completionRate >= 80
                            ? "#22c55e"
                            : habit.completionRate >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                        }}
                    />
                    </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}