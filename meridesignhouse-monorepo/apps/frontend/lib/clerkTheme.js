// apps/frontend/lib/clerkTheme.js

export const clerkTheme = {
  variables: {
    colorPrimary: "#F4B5C2",
    colorText: "#111827",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#F3F4F6",
    colorInputText: "#111827",
    colorDanger: "#DC2626",
    colorSuccess: "#059669",
    colorWarning: "#D97706",
    colorInputFocusRing: "#F4B5C2",
    borderRadius: "12px",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  },
  elements: {
    formButtonPrimary: {
      backgroundColor: "#F4B5C2",
      fontSize: "15px",
      textTransform: "none",
      borderRadius: "10px",
      boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
      "&:hover": {
        backgroundColor: "#E5A6B4",
      },
    },
    headerTitle: { display: "none" },
    headerSubtitle: { display: "none" },
    card: {
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      borderRadius: "12px",
      border: "1px solid #F3F4F6",
    },
    formFieldInput: {
      borderRadius: "8px",
      border: "1px solid #E5E7EB",
      backgroundColor: "#F3F4F6",
      color: "#111827",
      "&:focus": {
        borderColor: "#F4B5C2",
        boxShadow: "0 0 0 1px #F4B5C2",
      },
    },
    formFieldLabel: {
      fontSize: "0.85rem",
      color: "#374151",
      fontWeight: 500,
      marginBottom: "6px",
    },
    formFieldHintText: {
      fontSize: "0.8rem",
      color: "#6B7280",
    },
    formFieldErrorText: {
      fontSize: "0.8rem",
      color: "#DC2626",
      marginTop: "6px",
    },
    formFieldSuccessText: {
      fontSize: "0.8rem",
      color: "#059669",
      marginTop: "6px",
    },
    footerActionText: {
      color: "#6B7280",
      fontSize: "0.9rem",
    },
    footerActionLink: {
      color: "#DB2777",
      textDecoration: "none",
      fontWeight: 600,
      "&:hover": {
        color: "#BE185D",
        textDecoration: "underline",
      },
    },
    dividerText: {
      color: "#6B7280",
      fontSize: "0.8rem",
      fontWeight: 500,
    },
    dividerLine: {
      backgroundColor: "#E5E7EB",
    },
    socialButtonsBlockButton: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: "10px",
      color: "#111827",
      boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      "&:hover": {
        backgroundColor: "#F9FAFB",
      },
    },
    socialButtonsIconButton: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: "10px",
      color: "#111827",
      "&:hover": {
        backgroundColor: "#F9FAFB",
      },
    },
    formResendCodeLink: {
      color: "#DB2777",
      fontWeight: 600,
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
    otpCodeFieldInput: {
      borderRadius: "10px",
      border: "1px solid #E5E7EB",
      backgroundColor: "#F9FAFB",
      color: "#111827",
      fontSize: "20px",
      lineHeight: "2.5rem",
      "&:focus": {
        borderColor: "#F4B5C2",
        boxShadow: "0 0 0 1px #F4B5C2",
      },
    },
    badge: {
      backgroundColor: "#FCE7F3",
      color: "#9D174D",
      borderRadius: "9999px",
      fontWeight: 600,
    },
    alert: {
      borderRadius: "10px",
      border: "1px solid #FEE2E2",
      backgroundColor: "#FEF2F2",
      color: "#991B1B",
    },
    alertText: {
      color: "#991B1B",
    },
    avatarBox: {
      boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
    },
    // UserButton & Popover
    userButtonBox: {
      borderRadius: "9999px",
      border: "1px solid #F3F4F6",
      boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
    },
    userButtonTrigger: {
      borderRadius: "9999px",
    },
    userButtonPopoverCard: {
      borderRadius: "12px",
      border: "1px solid #F3F4F6",
      boxShadow: "0 8px 16px rgba(16,24,40,0.12)",
    },
    userButtonPopoverActionButton: {
      borderRadius: "10px",
      color: "#111827",
      "&:hover": { backgroundColor: "#F9FAFB" },
    },
    userButtonPopoverActionButtonText: {
      color: "#111827",
      fontWeight: 500,
    },
    userButtonPopoverFooter: {
      borderTop: "1px solid #F3F4F6",
      color: "#6B7280",
    },
    userPreviewMainIdentifier: {
      color: "#111827",
      fontWeight: 600,
    },
    userPreviewSecondaryIdentifier: {
      color: "#6B7280",
    },
    // UserProfile (if used later)
    profileSectionPrimaryButton: {
      backgroundColor: "#F4B5C2",
      color: "#FFFFFF",
      borderRadius: "10px",
      "&:hover": { backgroundColor: "#E5A6B4" },
    },
    profileSectionSecondaryButton: {
      backgroundColor: "#FFFFFF",
      border: "1px solid #E5E7EB",
      color: "#111827",
      borderRadius: "10px",
      "&:hover": { backgroundColor: "#F9FAFB" },
    },
    profileSectionTitleText: {
      color: "#111827",
      fontWeight: 700,
    },
    // Organization components (future-proof)
    organizationSwitcherTrigger: {
      borderRadius: "10px",
      border: "1px solid #E5E7EB",
      backgroundColor: "#FFFFFF",
      "&:hover": { backgroundColor: "#F9FAFB" },
    },
    organizationSwitcherPopoverCard: {
      borderRadius: "12px",
      border: "1px solid #F3F4F6",
      boxShadow: "0 8px 16px rgba(16,24,40,0.12)",
    },
    organizationSwitcherPopoverActionButton: {
      borderRadius: "10px",
      color: "#111827",
      "&:hover": { backgroundColor: "#F9FAFB" },
    },
  },
}


