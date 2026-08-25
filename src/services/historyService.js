import API_URL from "./api"
import { getToken } from "./auth"

export async function fetchHistory(startDate, endDate) {
  const token = getToken()

  const response = await fetch(
    `${API_URL}/stats/history?start=${startDate}&end=${endDate}`,
    {
      headers: {
        "X-AUTH-TOKEN": token,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Erreur lors du chargement de l’historique")
  }

  return response.json()
}