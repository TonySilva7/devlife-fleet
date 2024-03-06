import { Container, Content } from './styles'
import { HomeHeader } from '../../components/HomeHeader'
import { CarStatus } from '../../components/CardStatus'
import { useNavigation } from '@react-navigation/native'

export function Home() {
  const { navigate } = useNavigation()

  function handleRegisterMovement() {
    navigate('departure')
  }

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus licensePlate="XXX-1234" onPress={handleRegisterMovement} />
      </Content>
    </Container>
  )
}
