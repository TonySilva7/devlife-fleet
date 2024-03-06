import { TextInput, TextInputProps } from 'react-native'
import { useTheme } from 'styled-components'
import { Container, Input, Label } from './styles'
import { ForwardRefRenderFunction, forwardRef } from 'react'

type InputProps = TextInputProps & {
  label: string
}

const CustomInput: ForwardRefRenderFunction<TextInput, InputProps> = (
  { label, ...rest },
  ref,
) => {
  const { COLORS } = useTheme()

  return (
    <Container>
      <Label>{label}</Label>

      <Input
        ref={ref}
        maxLength={7}
        autoCapitalize="characters"
        placeholderTextColor={COLORS.GRAY_400}
        {...rest}
      />
    </Container>
  )
}

export const LicensePlateInput = forwardRef<TextInput, InputProps>(CustomInput)
