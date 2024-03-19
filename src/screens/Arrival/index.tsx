import { useNavigation, useRoute } from '@react-navigation/native'

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
  AsyncMessage,
} from './styles'
import { getLastAsyncTimestamp } from '../../libs/asyncStorage'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import { ButtonIcon } from '../../components/ButtonIcon'
import { X } from 'phosphor-react-native'
import { LatLng } from 'react-native-maps'

import { useObject, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { BSON } from 'realm'
import { Alert } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { stopLocationTask } from '../../tasks/backgroundLocationTask'
import { getStorageLocations } from '../../libs/asyncStorage/locationStorage'
import { Map } from '../../components/Map'

type RouteParamProps = {
  id: string
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)
  const [coordinates, setCoordinates] = useState<LatLng[]>([])

  const route = useRoute()

  const { goBack } = useNavigation()

  const { id } = route.params as RouteParamProps
  const parseId = new BSON.UUID(id) as unknown as string
  const realm = useRealm()
  const historic = useObject(Historic, parseId)

  const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes'

  async function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    })

    await stopLocationTask()

    goBack()
  }

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeVehicleUsage() },
    ])
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        return Alert.alert(
          'Erro',
          'Não foi possível obter os dados para registrar a chegada do veículo.',
        )
      }

      /**
       * Interrompe o monitoramento de localização em background
       */
      await stopLocationTask()

      realm.write(() => {
        historic.status = 'arrival'
        historic.updated_at = new Date()
      })

      await stopLocationTask()

      Alert.alert('Chegada', 'Chegada registrada com sucesso.')
      goBack()
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registar a chegada do veículo.')
    }
  }

  const getLocationsInfo = useCallback(async () => {
    if (!historic) return

    const lastSync = await getLastAsyncTimestamp()
    const updatedAt = historic.updated_at.getTime()

    setDataNotSynced(updatedAt > lastSync)

    const locationsStorage = await getStorageLocations()
    setCoordinates(locationsStorage)
  }, [historic])

  useEffect(() => {
    getLocationsInfo()
  }, [getLocationsInfo])

  return (
    <Container>
      <Header title={title} />
      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>{historic?.license_plate}</LicensePlate>
        <Label>Finalidade</Label>
        <Description>{historic?.description}</Description>
      </Content>

      {historic?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da{' '}
          {historic?.status === 'departure' ? 'partida' : 'chegada'} pendente
        </AsyncMessage>
      )}
    </Container>
  )
}
