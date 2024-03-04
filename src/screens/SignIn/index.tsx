import { Container, Title, Slogan } from './styles'
import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button'
import { useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { Alert } from 'react-native'

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
})

export default function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true)
      const { idToken } = await GoogleSignin.signIn()

      if (idToken) {
        console.log(idToken)
      } else {
        Alert.alert('Ops!', 'Não foi possível realizar o login com Google')
        setIsAuthenticating(false)
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Ops!', 'Houve um erro inesperado ao logar com o Google')
      setIsAuthenticating(false)
    }
  }

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>
      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </Container>
  )
}
