export default function Stats({ totalTodayHabits, completedTodayHabits }) {
  const completionRate =
    totalTodayHabits > 0
      ? ((completedTodayHabits / totalTodayHabits) * 100).toFixed(2)
      : "0.00"

  return (
    <section className="stats-container">
      <h2 className="stats-title">Statistiques</h2>

      <div className="stats-grid">
        <div className="stats-card">
          <span className="stats-label">
            Habitudes suivies aujourd’hui
          </span>

          <strong className="stats-value">
            {totalTodayHabits}
          </strong>
        </div>

        <div className="stats-card">
          <span className="stats-label">
            Habitudes validées aujourd’hui
          </span>

          <strong className="stats-value">
            {completedTodayHabits}
          </strong>
        </div>

        <div className="stats-card">
          <span className="stats-label">
            Taux de réussite du jour
          </span>

          <strong className="stats-value">
            {completionRate}%
          </strong>
        </div>
      </div>
    </section>
  )
}