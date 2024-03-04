import React from 'react'
import { Container, Greeting, Message, Name } from './styles'
import { TouchableOpacity } from 'react-native'
import { Power } from 'phosphor-react-native'
import { useTheme } from 'styled-components/native'

export function HomeHeader() {
  const { COLORS } = useTheme()
  return (
    <Container>
      <Greeting>
        <Message>Olá</Message>

        <Name>Rodrigo</Name>
      </Greeting>

      <TouchableOpacity>
        <Power size={32} color={COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  )
}
