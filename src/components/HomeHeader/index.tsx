import React from 'react'
import { Container, Greeting, Message, Name, Picture } from './styles'
import { TouchableOpacity } from 'react-native'
import { Power } from 'phosphor-react-native'
import { useTheme } from 'styled-components/native'
import { useUser, useApp } from '@realm/react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function HomeHeader() {
  const { COLORS } = useTheme()
  const insets = useSafeAreaInsets()
  const paddingTop = insets.top + 32

  const user = useUser()
  const app = useApp()

  function handleLogOut() {
    app.currentUser?.logOut()
  }

  return (
    <Container style={{ paddingTop }}>
      <Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9ofbHof00ayjsay~qj[ayj@"
      />

      <Greeting>
        <Message>Olá</Message>

        <Name>{user?.profile.name}</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogOut}>
        <Power size={32} color={COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  )
}
