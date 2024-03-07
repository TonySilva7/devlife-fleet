import { Container, Content } from './styles'
import { HomeHeader } from '../../components/HomeHeader'
import { CarStatus } from '../../components/CardStatus'
import { useNavigation } from '@react-navigation/native'

import { useQuery, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'

import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { HistoricCard } from '../../components/HistoricCard'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)

  const realm = useRealm()
  const historic = useQuery(Historic)

  const { navigate } = useNavigation()

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      navigate('arrival', { id: vehicleInUse._id.toString() })
    } else {
      navigate('departure')
    }
  }

  const fetchVehicleInUse = useCallback(() => {
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

  function fetchHistoric() {
    const response = historic.filtered("status='arrival' SORT(created_at DESC)")
    console.log(response)
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, [fetchVehicleInUse])

  useEffect(() => {
    realm.addListener('change', fetchVehicleInUse)

    return () => {
      realm.removeListener('change', fetchVehicleInUse)
    }
  }, [fetchVehicleInUse, realm])

  useEffect(() => {
    fetchHistoric()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historic])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />

        <HistoricCard
          data={{ created: '20/04', licensePlate: 'XXX1234', isSync: false }}
        />
      </Content>
    </Container>
  )
}
