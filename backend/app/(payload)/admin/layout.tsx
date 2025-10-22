import React from 'react'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '../../../src/payload.config'
import { importMap } from './importMap'

async function serverAction(args: any) {
  'use server'
  return handleServerFunctions(args)
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverAction}>
      {children}
    </RootLayout>
  )
}
