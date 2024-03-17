import * as TaskManager from 'expo-task-manager'
import {
  Accuracy,
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location'

type ICoords = {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number | null
  heading: number | null
  speed: number | null
}

type ILocation = {
  coords: ICoords
  timestamp: number
}

type IData = {
  locations: ILocation[]
}

export const BACKGROUND_TASK_NAME = 'location-tracking'

TaskManager.defineTask<IData>(BACKGROUND_TASK_NAME, async ({ data, error }) => {
  try {
    if (error) {
      throw error
    }

    const { coords, timestamp } = data.locations[0]

    const currentLocation = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp,
    }

    console.log(currentLocation)
  } catch (error) {
    console.log(error)
  }
})

/* -------------- FUNÇÕES PARA INICIAR/INTERROMPER MONITORAMENTO DE LOCALIZAÇÃO ------------- */
/**
 * Inicia o monitoramento de localização em background
 */
export async function startLocationTask() {
  try {
    const hasStarted =
      await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)

    if (hasStarted) {
      await stopLocationTask()
    }

    await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Accuracy.Highest,
      distanceInterval: 1,
      timeInterval: 1000,
    })
  } catch (error) {
    console.log(error)
  }
}

/**
 * Interrompe o monitoramento de localização em background
 */
export async function stopLocationTask() {
  try {
    const hasStarted =
      await hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME)

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME)
    }
  } catch (error) {
    console.log()
  }
}
