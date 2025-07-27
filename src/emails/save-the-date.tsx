import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

interface SaveTheDateEmailProps {
  guestEmail: string;
}

export const SaveTheDateEmail = ({ guestEmail }: SaveTheDateEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Save the Date - Yishan & Yitong Wedding</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with corner text */}
          <Section style={headerSection}>
            <Text style={cornerText}>Family style</Text>
            <Text style={centerText}>3000 20th St, SF, CA</Text>
            <Text style={cornerTextRight}>Penny Roma</Text>
          </Section>

          {/* Main content section */}
          <Section style={mainSection}>
            {/* Names */}
            <div style={namesContainer}>
              <Img
                src="https://i.imgur.com/UHFvnNP.png"
                alt="Yishan and Yitong"
                style={namesImage}
              />
            </div>

            {/* Main invitation text */}
            <Text style={invitationText}>
              warmly invite you to our wedding
              celebration in San Francisco on
              October 4th, 2025
            </Text>

            {/* CTA Button */}
            <div style={buttonContainer}>
              <div style={buttonRow}>
                <Img
                  src="https://i.imgur.com/r2J8pdv.png"
                  alt="Left decoration"
                  style={sideImage}
                />
                                        <a href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://yishanandyitong.wedding'}`}>
                  <Img
                    src="https://i.imgur.com/hMQTwMZ.png"
                    alt="Count me in!"
                    style={buttonImage}
                  />
                </a>
                <Img
                  src="https://i.imgur.com/ku4aCHm.png"
                  alt="Right decoration"
                  style={sideImage}
                />
              </div>
            </div>

            {/* Decorative elements note */}
          </Section>

          {/* Footer with corner text */}
          <Section style={footerSection}>
            <Text style={cornerText}>October 4th</Text>
            <Text style={centerText}>RSVP now, more info soon!</Text>
            <Text style={cornerTextRight}>Family & friends</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#332917",
  fontFamily: '"IBM Plex Serif", Georgia, serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#332917",
  maxWidth: "600px",
  margin: "0 auto",
  position: "relative" as const,
  minHeight: "700px",
  backgroundImage: `url('https://i.imgur.com/Mo3eq6L.png'), radial-gradient(circle at 20% 30%, rgba(228, 180, 46, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(228, 180, 46, 0.1) 0%, transparent 50%)`,
  backgroundSize: "90% 90%",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  padding: "20px",
};

const headerSection = {
  position: "absolute" as const,
  top: "6px",
  left: "0",
  right: "0",
  height: "60px",
};

const mainSection = {
  padding: "60px 30px",
  textAlign: "center" as const,
};

const footerSection = {
  position: "absolute" as const,
  bottom: "0",
  left: "0",
  right: "0",
  height: "30px",
};

const cornerText = {
  color: "#846f3b",
  fontSize: "12px",
  opacity: "0.7",
  margin: "0",
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: "italic",
  fontWeight: "300",
  position: "absolute" as const,
  top: "0px",
  left: "30px",
};

const centerText = {
  color: "#846f3b",
  fontSize: "12px",
  opacity: "0.7",
  margin: "0",
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: "italic",
  fontWeight: "300",
  textAlign: "center" as const,
  position: "absolute" as const,
  top: "00px",
  left: "50%",
  transform: "translateX(-50%)",
};

const cornerTextRight = {
  color: "#846f3b",
  fontSize: "12px",
  opacity: "0.7",
  margin: "0",
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: "italic",
  fontWeight: "300",
  textAlign: "right" as const,
  position: "absolute" as const,
  top: "00px",
  right: "30px",
};

const namesContainer = {
  textAlign: "center" as const,
  margin: "0 0 0 0",
};

const namesImage = {
  maxWidth: "400px",
  width: "100%",
  height: "auto",
  margin: "0 auto",
};

const invitationText = {
  color: "#FCF3D6",
  fontSize: "20px",
  lineHeight: "1.2",
  margin: "0 auto 10px auto",
  maxWidth: "340px",
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: "italic",
  fontWeight: "300",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0px 0",
};

const buttonRow = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
};

const buttonImage = {
  maxWidth: "200px",
  width: "100%",
  height: "auto",
  margin: "0 auto",
  display: "block",
};

const sideImage = {
  maxWidth: "80px",
  width: "100%",
  height: "auto",
};
