import { Container, Title, Slogan } from './styles'
import backgroundImg from '../../assets/background.png'

export default function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>
    </Container>
  )
}
