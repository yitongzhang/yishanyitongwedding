import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ReminderEmailProps {
  guestEmail: string
}

export const ReminderEmail = ({ guestEmail }: ReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>RSVP Reminder - Yishan & Yitong Wedding</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={h1}>RSVP Reminder</Heading>
            
            <Text style={text}>
              Hi there!
            </Text>
            
            <Text style={text}>
              We hope you're as excited as we are about our upcoming wedding!
            </Text>
            
            <Heading style={h2}>Yishan & Yitong</Heading>
            <Text style={text}>
              <strong>Date:</strong> October 4th, 2025<br />
              <strong>Venue:</strong> Penny Roma<br />
              <strong>Address:</strong> 3000 20th St, San Francisco, CA 94110
            </Text>
            
            <Text style={text}>
              We haven't received your RSVP yet, and we'd love to know if you can join us! 
              Please visit our wedding website to let us know if you'll be attending.
            </Text>
            
            <Text style={text}>
              <Link href="https://yishanandyitong.wedding" style={link}>
                RSVP Now
              </Link>
            </Text>
            
            <Text style={text}>
              If you have any questions, please don't hesitate to reach out to us.
            </Text>
            
            <Text style={text}>
              Looking forward to celebrating with you!<br />
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

const link = {
  color: '#067df7',
  textDecoration: 'underline',
}