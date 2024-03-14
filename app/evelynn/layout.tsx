import { Metadata } from "next";

export const metadata: Metadata = {
  // title: "evelynn",
  description: "a timer of her existence",
};

export default function EvelynnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  )
}