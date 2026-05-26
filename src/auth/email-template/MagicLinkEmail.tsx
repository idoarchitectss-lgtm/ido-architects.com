/**
 * MagicLinkEmail
 * Email template cho IDO Architects – dùng @react-email/components.
 * Render bằng @react-email/render trước khi gửi qua Resend.
 */
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function MagicLinkEmail({ url, email }: { url: string; email: string }) {
  return (
    <Html lang="vi">
      <Head />
      <Preview>Đăng nhập vào hệ thống IDO Architects</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>

          {/* ── Header ── */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>IDO ARCHITECTS</Text>
            <Text style={styles.tagline}>
              Kiến Trúc Tinh Tế – Không Gian Sống Đẳng Cấp
            </Text>
          </Section>

          {/* ── Content ── */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>Xin chào! 👋</Text>

            <Text style={styles.paragraph}>
              Bạn đã yêu cầu đăng nhập vào hệ thống quản lý của{" "}
              <strong style={{ color: "#C9A96E" }}>IDO Architects</strong>{" "}
              bằng địa chỉ email <strong>{email}</strong>.
            </Text>

            <Text style={styles.paragraph}>
              Nhấn vào nút bên dưới để đăng nhập ngay:
            </Text>

            {/* CTA Button */}
            <Section style={styles.buttonContainer}>
              <Button href={url} style={styles.button}>
                🔑 Đăng nhập vào IDO Architects
              </Button>
            </Section>

            <Text style={styles.linkLabel}>
              Hoặc sao chép đường dẫn sau vào trình duyệt:
            </Text>
            <Link href={url} style={styles.link}>
              {url}
            </Link>

            {/* Security notice */}
            <Section style={styles.securityBox}>
              <Text style={styles.securityText}>
                🔒 <strong>Lưu ý bảo mật:</strong> Liên kết này sẽ hết hạn sau{" "}
                <strong>24 giờ</strong> và chỉ sử dụng được một lần.
              </Text>
              <Text style={styles.securityText}>
                Nếu bạn không yêu cầu đăng nhập, vui lòng bỏ qua email này.
                Tài khoản của bạn vẫn được bảo mật.
              </Text>
            </Section>
          </Section>

          {/* ── Footer ── */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} IDO Architects. All rights reserved.
            </Text>
            <Text style={styles.footerText}>
              Đà Nẵng, Việt Nam ·{" "}
              <Link href="https://ido-architects.io" style={styles.footerLink}>
                ido-architects.io
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: "#F5F0E8",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  container: {
    margin: "40px auto",
    maxWidth: "600px",
    backgroundColor: "#FFFFFF",
    borderRadius: "4px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#1A1A1A",
    padding: "36px 40px",
    textAlign: "center",
    borderBottom: "3px solid #C9A96E",
  },
  logoText: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#C9A96E",
    letterSpacing: "4px",
  },
  tagline: {
    margin: "8px 0 0 0",
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: "1px",
  },
  content: {
    padding: "40px 40px 32px",
  },
  greeting: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#1A1A1A",
    margin: "0 0 16px 0",
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#444444",
    margin: "12px 0",
  },
  buttonContainer: {
    textAlign: "center",
    margin: "32px 0",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#1A1A1A",
    color: "#C9A96E",
    fontSize: "15px",
    fontWeight: 700,
    textDecoration: "none",
    padding: "14px 36px",
    borderRadius: "2px",
    border: "1px solid #C9A96E",
    letterSpacing: "1px",
  },
  linkLabel: {
    fontSize: "13px",
    color: "#888888",
    margin: "24px 0 6px 0",
  },
  link: {
    fontSize: "13px",
    color: "#C9A96E",
    textDecoration: "underline",
    wordBreak: "break-all",
  },
  securityBox: {
    backgroundColor: "#F9F6F0",
    border: "1px solid #E8DCC8",
    borderLeft: "3px solid #C9A96E",
    borderRadius: "2px",
    padding: "16px 20px",
    margin: "32px 0 0 0",
  },
  securityText: {
    fontSize: "13px",
    lineHeight: "20px",
    color: "#666666",
    margin: "6px 0",
  },
  footer: {
    backgroundColor: "#1A1A1A",
    padding: "24px 40px",
    textAlign: "center",
    borderTop: "3px solid #C9A96E",
  },
  footerText: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
    margin: "4px 0",
  },
  footerLink: {
    color: "#C9A96E",
    textDecoration: "none",
  },
};
