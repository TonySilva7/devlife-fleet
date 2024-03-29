import React, { useEffect, useRef, useState } from 'react'
import { CarSimple } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '@realm/react'
import { Alert, ScrollView, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  useForegroundPermissions,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords,
} from 'expo-location'

import { Header } from '../../components/Header'
import { LocationInfo } from '../../components/LocationInfo'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { TextAreaInput } from '../../components/TextAreaInput'
import { Container, Content, Message, MessageContent } from './styles'
import { useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { Loading } from '../../components/Loading'
import { Button } from '../../components/Button'
import { licensePlateValidate } from '../../utils/licensePlateValidate'
import { getAddressLocation } from '../../utils/getAddressLocation'
import { Map } from '../../components/Map'
import { startLocationTask } from '../../tasks/backgroundLocationTask'
import { openSettings } from '../../utils/openSettings'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null)

  const realm = useRealm()
  const user = useUser()
  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions()

  const { goBack } = useNavigation()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  async function handleDepartureRegister() {
    const isValidPlate = licensePlateValidate(licensePlate)

    try {
      if (!isValidPlate) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informe a placa correta.',
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo',
        )
      }

      if (!currentCoords) {
        return Alert.alert(
          'Localização',
          'Não foi possível obter a localização atual. Por favor, tente novamente.',
        )
      }

      setIsRegistering(true)

      const backgroundPermissions = await requestBackgroundPermissionsAsync()

      if (!backgroundPermissions.granted) {
        setIsRegistering(false)
        return Alert.alert(
          'Localização',
          'É necessário permitir que o App tenha acesso localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo."',
          [{ text: 'Abrir configurações', onPress: openSettings }],
        )
      }

      // Monitora a localização em background
      await startLocationTask()

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user.id,
            license_plate: licensePlate.toUpperCase(),
            description,
            coords: [
              {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                timestamp: new Date().getTime(),
              },
            ],
          }),
        )
      })

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso.')

      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não possível registrar a saída do veículo.')
      setIsRegistering(false)
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return
    }

    let subscription: LocationSubscription

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords)

        getAddressLocation(location.coords).then((address) => {
          if (address) {
            setCurrentAddress(address)
          }
        })
      },
    )
      .then((response) => (subscription = response))
      .finally(() => setIsLoadingLocation(false))

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [locationForegroundPermission?.granted])

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <MessageContent>
          <Message>
            Você precisa permitir que o aplicativo tenha acesso a localização
            para acessar essa funcionalidade. Por favor, acesse as configurações
            do seu dispositivo para conceder a permissão ao aplicativo.
          </Message>

          <Button title="Abrir configurações" onPress={openSettings} />
        </MessageContent>
      </Container>
    )
  }

  if (isLoadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}
          {/* {currentCoords && (
            <Map
              coordinates={[
                { latitude: -29.6993, longitude: -52.4425 },
                { latitude: -29.6951, longitude: -52.4425 },
                { latitude: -29.6949, longitude: -52.4399 },
                { latitude: -29.6935, longitude: -52.4398 },
                { latitude: -29.6936, longitude: -52.4438 },
              ]}
            />
          )} */}

          <Content>
            {currentAddress && (
              <LocationInfo
                icon={CarSimple}
                label="Localização atual"
                description={currentAddress}
              />
            )}
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => {
                descriptionRef.current?.focus()
              }}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              onChangeText={setDescription}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
            />

            <Button
              title="Registar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
}
