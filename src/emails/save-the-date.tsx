import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface SaveTheDateEmailProps {
  guestEmail: string
}

export const SaveTheDateEmail = ({ guestEmail }: SaveTheDateEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Save the Date - Yishan & Yitong Wedding</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={h1}>Save the Date!</Heading>
            
            <Text style={text}>
              You&apos;re invited to celebrate the wedding of
            </Text>
            
            <Heading style={h2}>Yishan & Yitong</Heading>
            
            <Text style={text}>
              <strong>Date:</strong> October 4th, 2025
            </Text>
            
            <Text style={text}>
              <strong>Location:</strong> San Francisco, CA
            </Text>
            
            <Text style={text}>
              We can&apos;t wait to celebrate this special day with you!
            </Text>
            <Text style={text}>
              <strong>Please RSVP:</strong> Visit our website at{' '}
              <a href="https://yishanandyitong.wedding" style={{ color: '#0070f3', textDecoration: 'underline' }}>
                yishanandyitong.wedding
              </a>{' '}
              to let us know if you can join us!
            </Text>
            <Text style={text}>
              With love,<br />
              Yishan & Yitong
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
  marginTop: '20px',
  maxWidth: '600px',
  padding: '68px 0 130px',
}

const section = {
  padding: '0 48px',
}

const h1 = {
  color: '#333',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '30px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '30px',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '20px',
}