import "./globals.css";

import { InterFont } from "@/providers/fonts";

export const metadata = {
  title: "life",
  description: "dedicated to ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${InterFont.className} scrollbar`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
