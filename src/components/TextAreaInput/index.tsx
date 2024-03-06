import { TextInput } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Container, Input, Label } from './styles'
import { ComponentProps, forwardRef, ForwardRefRenderFunction } from 'react'

type InputProps = ComponentProps<typeof Input> & {
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
        placeholderTextColor={COLORS.GRAY_400}
        multiline
        autoCapitalize="sentences"
        ref={ref}
        {...rest}
      />
    </Container>
  )
}

export const TextAreaInput = forwardRef<TextInput, InputProps>(CustomInput)
