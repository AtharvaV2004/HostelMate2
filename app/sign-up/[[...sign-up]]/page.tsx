import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0F1412] flex items-center justify-center p-6">
      <div className="emerald-glow p-1 rounded-2xl">
        <SignUp appearance={{ 
          variables: { colorPrimary: '#10b981' },
          elements: {
            card: "bg-bg-surface border border-glass-border shadow-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-text-muted",
            socialButtonsBlockButton: "bg-bg-base border-glass-border text-white hover:bg-bg-surface transition-colors",
            formButtonPrimary: "emerald-gradient emerald-glow border-0",
            footerActionLink: "text-primary hover:text-primary/80"
          }
        }} />
      </div>
    </div>
  )
}
