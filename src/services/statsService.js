// Ce service avait été créé pour récupérer les statistiques
// depuis le backend via un endpoint dédié (/stats).
// 
// Les statistiques actuelles (jour en cours) sont désormais
// calculées directement côté frontend dans App.jsx afin
// d’éviter un appel API supplémentaire et améliorer
// les performances de l’application.
//
// Ce fichier est conservé pour une évolution future,
// notamment pour des statistiques avancées sur plusieurs
// jours (30 jours, historique, séries, graphiques, etc.).

import API_URL from "./api"
import { getToken } from "./auth"

export async function fetchStats(period = 30) {
  const token = getToken()

  const response = await fetch(`${API_URL}/stats?period=${period}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": token,
    },
  })

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des statistiques")
  }

  return response.json()
}