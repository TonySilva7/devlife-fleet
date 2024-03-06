import React, { useRef, useState } from 'react'
import { Container, Content } from './styles'
import { Header } from '../../components/Header'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { TextAreaInput } from '../../components/TextAreaInput'
import { Button } from '../../components/Button'
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { licensePlateValidate } from '../../utils/licensePlateValidate'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')

  const keyboardAvoidingViewBehavior =
    Platform.OS === 'android' ? 'height' : 'position'

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    const isValidPlate = licensePlateValidate(licensePlate)

    if (!isValidPlate) {
      licensePlateRef.current?.focus()
      return Alert.alert(
        'Placa inválida',
        'A placa é inválida. Por favor, informa a placa correta.',
      )
    }
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
      >
        <ScrollView>
          <Content>
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

            <Button title="Registar Saída" onPress={handleDepartureRegister} />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}
