import { Container, Content } from './styles'
import { HomeHeader } from '../../components/HomeHeader'
import { CarStatus } from '../../components/CardStatus'
import { useNavigation } from '@react-navigation/native'

import { useQuery } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'

import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)

  const historic = useQuery(Historic)

  const { navigate } = useNavigation()

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      navigate('arrival', { id: vehicleInUse._id.toString() })
    } else {
      navigate('departure')
    }
  }

  const fetchVehicle = useCallback(() => {
    try {
      const vehicle = historic.filtered('status="departure"')[0]
      setVehicleInUse(vehicle)
    } catch (error) {
      Alert.alert(
        'Veículo em uso',
        'Não foi possível carregar o veículo em uso.',
      )
      console.log(error)
    }
  }, [historic])

  useEffect(() => {
    fetchVehicle()
  }, [fetchVehicle])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />
      </Content>
    </Container>
  )
}
