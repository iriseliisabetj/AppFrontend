import type { ReactNode } from "react";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";

export function PageLayout({
  children,
  showFooter = true,
}: {
  children: ReactNode;
  showFooter?: boolean;
}) {
  return (
    <div className="page">
      <div className="container">
        <Header />
        {children}
        {showFooter && <Footer />}
      </div>
    </div>
  );
}