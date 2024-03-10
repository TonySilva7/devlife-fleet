/* eslint-disable camelcase */
import 'react-native-get-random-values'
import './src/libs/dayjs'

import { AppProvider, UserProvider } from '@realm/react'
import { ThemeProvider } from 'styled-components/native'
import SignIn from './src/screens/SignIn'
import theme from './src/theme'
import { WifiSlash } from 'phosphor-react-native'

import { ANDROID_CLIENT_ID, REALM_APP_ID } from '@env'
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import React from 'react'
import { StatusBar } from 'react-native'
import { Loading } from './src/components/Loading'
import { Routes } from './src/routes'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RealmProvider, syncConfig } from './src/libs/realm'
import { TopMessage } from './src/components/TopMessage'

export default function App() {
  console.log(ANDROID_CLIENT_ID)

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <TopMessage title="Você está off-line" icon={WifiSlash} />
          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
