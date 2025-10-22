import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '../../../../src/payload.config'
import { importMap } from '../importMap'

export const generateMetadata = (args: any) => generatePageMetadata({ config: configPromise, params: args?.params, searchParams: args?.searchParams })

export default function AdminPage(props: any) {
  return RootPage({ ...props, config: configPromise, importMap })
}
