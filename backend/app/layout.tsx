import React from 'react';
import type { Metadata } from 'next';
import '@payloadcms/next/css';

export const metadata: Metadata = {
  title: 'Payload CMS',
  description: 'Headless CMS Backend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
