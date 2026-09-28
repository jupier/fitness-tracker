import {
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core'
import { IconCheck, IconLogout, IconMoon, IconSun } from '@tabler/icons-react'
import { THEME_OPTIONS } from '../lib/theme'
import { useThemeChoice } from '../lib/themeContext'
import { supabase } from '../lib/supabase'

export function OptionsPage() {
  const { themeId, setThemeId } = useThemeChoice()
  const { colorScheme, toggleColorScheme, setColorScheme } = useMantineColorScheme()

  const pickTheme = (theme: (typeof THEME_OPTIONS)[number]) => {
    setThemeId(theme.id)
    if (theme.forceColorScheme) setColorScheme(theme.forceColorScheme)
  }

  return (
    <Stack gap="lg" py="md">
      <Divider label="Thème" labelPosition="left" />
      <SimpleGrid cols={2} spacing="sm">
        {THEME_OPTIONS.map((theme) => {
          const selected = theme.id === themeId
          return (
            <UnstyledButton key={theme.id} onClick={() => pickTheme(theme)}>
              <Paper
                withBorder
                radius="md"
                p="sm"
                style={{
                  borderColor: selected ? theme.swatch : undefined,
                  borderWidth: selected ? 2 : undefined,
                }}
              >
                <Stack gap={6}>
                  <Group justify="space-between" wrap="nowrap">
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: theme.swatch,
                        flexShrink: 0,
                      }}
                    />
                    {selected && <IconCheck size={16} color={theme.swatch} />}
                  </Group>
                  <Text size="sm" fw={600}>
                    {theme.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {theme.description}
                  </Text>
                </Stack>
              </Paper>
            </UnstyledButton>
          )
        })}
      </SimpleGrid>
      <Text size="xs" c="dimmed">
        D'autres thèmes arriveront plus tard, à débloquer en utilisant l'app.
      </Text>

      <Divider label="Apparence" labelPosition="left" />
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between">
          <div>
            <Text size="sm" fw={500}>
              Mode sombre
            </Text>
            <Text size="xs" c="dimmed">
              Bascule entre thème clair et sombre.
            </Text>
          </div>
          <Button
            variant="light"
            size="xs"
            leftSection={colorScheme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
            onClick={() => toggleColorScheme()}
          >
            {colorScheme === 'dark' ? 'Clair' : 'Sombre'}
          </Button>
        </Group>
      </Paper>

      <Divider label="Compte" labelPosition="left" />
      <Button
        variant="light"
        color="red"
        leftSection={<IconLogout size={16} />}
        onClick={() => supabase.auth.signOut()}
        style={{ alignSelf: 'flex-start' }}
      >
        Déconnexion
      </Button>
    </Stack>
  )
}
