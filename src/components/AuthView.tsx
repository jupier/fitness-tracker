import { useState } from 'react'
import { Alert, Button, Center, Paper, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconMail } from '@tabler/icons-react'
import { supabase } from '../lib/supabase'

export function AuthView() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const sendLink = async () => {
    if (!email) return
    setStatus('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname },
    })
    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <Center mih="100vh" p="md">
      <Paper withBorder shadow="md" p="xl" radius="md" maw={400} w="100%">
        <Stack gap="md">
          <Stack gap={4}>
            <Title order={2}>Routine</Title>
            <Text c="dimmed" size="sm">
              Suis ta routine sportive et ton poids.
            </Text>
          </Stack>
          {status === 'sent' ? (
            <Alert color="teal" title="Lien envoyé">
              Vérifie ta boîte mail ({email}) et clique le lien pour te connecter.
            </Alert>
          ) : (
            <>
              <TextInput
                label="Email"
                placeholder="toi@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                leftSection={<IconMail size={16} />}
                onKeyDown={(e) => e.key === 'Enter' && sendLink()}
              />
              {status === 'error' && (
                <Alert color="red" title="Erreur">
                  {errorMsg}
                </Alert>
              )}
              <Button onClick={sendLink} loading={status === 'sending'} disabled={!email}>
                Envoyer le lien magique
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Center>
  )
}
