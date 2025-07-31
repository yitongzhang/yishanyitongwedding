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
  guestName?: string | null;
}

export const SaveTheDateEmail = ({
  guestEmail,
  guestName,
}: SaveTheDateEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Save the Date - Yishan & Yitong Wedding</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with corner text */}
          <Section style={headerSection}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <tr>
                <td
                  style={{
                    ...headerTextStyle,
                    textAlign: "left",
                    color: "#807349",
                    width: "33.33%",
                  }}
                >
                  Family style
                </td>
                <td
                  style={{
                    ...headerTextStyle,
                    textAlign: "center",
                    color: "#807349",
                    width: "33.33%",
                  }}
                >
                  3000 20th St, SF, CA
                </td>
                <td
                  style={{
                    ...headerTextStyle,
                    textAlign: "right",
                    color: "#807349",
                    width: "33.33%",
                  }}
                >
                  Penny Roma
                </td>
              </tr>
            </table>
          </Section>

          {/* Main content section */}
          <Section style={mainSection}>
            {/* Names */}
            <Section style={namesContainer}>
              <Img
                src="https://i.imgur.com/UHFvnNP.png"
                alt="Yishan and Yitong"
                style={namesImage}
              />
            </Section>

            {/* Main invitation text */}
            <Text style={{ ...invitationText, color: "#FCF3D6" }}>
              warmly invite you to our wedding celebration in San Francisco on
              October 4th, 2025
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <table style={buttonRow}>
                <tr>
                  <td style={{ ...buttonTableCell, width: "120px" }}>
                    <Img
                      src="https://i.imgur.com/r2J8pdv.png"
                      alt="Left decoration"
                      style={sideImage}
                    />
                  </td>
                  <td
                    style={{
                      ...buttonTableCell,
                      width: "240px",
                      padding: "0 20px",
                    }}
                  >
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_SITE_URL ||
                        "https://yishanandyitong.wedding"
                      }`}
                    >
                      <Img
                        src="https://i.imgur.com/hMQTwMZ.png"
                        alt="Count me in!"
                        style={buttonImage}
                      />
                    </a>
                  </td>
                  <td style={{ ...buttonTableCell, width: "120px" }}>
                    <Img
                      src="https://i.imgur.com/ku4aCHm.png"
                      alt="Right decoration"
                      style={sideImage}
                    />
                  </td>
                </tr>
              </table>
            </Section>

            {/* Decorative elements note */}
          </Section>

          {/* Footer with corner text */}
          <Section style={footerSection}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <tr>
                <td
                  style={{
                    ...headerTextStyle,
                    textAlign: "left",
                    color: "#807349",
                    width: "33.33%",
                  }}
                >
                  October 4th
                </td>
                <td
                  style={{
                    ...headerTextStyle,
                    textAlign: "center",
                    color: "#807349",
                    width: "33.33%",
                  }}
                >
                  RSVP now, more info soon!
                </td>
                <td
                  style={{
                    ...headerTextStyle,
                    textAlign: "right",
                    color: "#807349",
                    width: "33.33%",
                  }}
                >
                  Family & friends
                </td>
              </tr>
            </table>
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
  top: "0px",
  left: "0",
  right: "0",
  height: "30px",
  width: "100%",
  paddingLeft: "30px",
  paddingRight: "30px",
};

const headerTextStyle = {
  color: "#F5E6B3",
  fontSize: "12px",
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: "italic",
  fontWeight: "300",
  margin: "0",
  padding: "0",
  verticalAlign: "top",
  lineHeight: "12px",
  height: "12px",
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
  width: "100%",
  paddingLeft: "30px",
  paddingRight: "30px",
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
  color: "#FCF3D6 !important",
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
  width: "100%",
  borderCollapse: "collapse" as const,
  tableLayout: "fixed" as const,
  maxWidth: "480px",
  margin: "0 auto",
};

const buttonTableCell = {
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
  padding: "0",
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
  margin: "0 auto",
  display: "block",
};
