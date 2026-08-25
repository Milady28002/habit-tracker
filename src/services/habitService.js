import API_URL from "./api"
import { getToken } from "./auth"

function getHeaders(withJson = true) {
  const headers = {
    "X-AUTH-TOKEN": getToken(),
  }

  if (withJson) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

export async function fetchHabits(date) {
  const response = await fetch(`${API_URL}/habits?date=${date}`, {
    method: "GET",
    headers: getHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Impossible de récupérer les habitudes")
  }

  return response.json()
}

export async function createHabit(habitData) {
  const response = await fetch(`${API_URL}/habits`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(habitData),
  })

  if (!response.ok) {
    throw new Error("Impossible de créer l’habitude")
  }

  return response.json()
}

export async function toggleHabit(id, date) {
  const response = await fetch(`${API_URL}/habits/${id}/toggle?date=${date}`, {
    method: "PATCH",
    headers: getHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Impossible de modifier le statut")
  }

  return response.json()
}

export async function deleteHabit(id) {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
  })

  if (!response.ok) {
    throw new Error("Impossible de supprimer l’habitude")
  }

  return response.json()
}

export async function updateHabit(id, habitData) {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(habitData),
  })

  if (!response.ok) {
    throw new Error("Impossible de modifier l’habitude")
  }

  return response.json()
}
  