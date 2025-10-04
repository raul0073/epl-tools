import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  url: string;
  host: string;
}

export function EmailTemplate({ firstName, url, host }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#333" }}>Hi {firstName},</h1>
      <p>
        Someone just requested to sign in to <b>{host}</b> using this email
        address.
      </p>
      <p>
        Click the button below to sign in. This link will expire in{" "}
        <b>1 hour</b>.
      </p>

      <p style={{ textAlign: "center", margin: "30px 0" }}>
        <a
          href={url}
          style={{
            display: "inline-block",
            padding: "12px 20px",
            backgroundColor: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          Sign in to {host}
        </a>
      </p>

      <p>If you didn’t request this email, you can safely ignore it.</p>

      <p style={{ fontSize: "12px", color: "#666", marginTop: "20px" }}>
        Sent by EPL Prediction League
      </p>
    </div>
  );
}
