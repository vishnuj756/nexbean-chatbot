
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { AuthGuard } from "./services/authgurd";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthGuard>
             <ToastContainer />
            {children}
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}