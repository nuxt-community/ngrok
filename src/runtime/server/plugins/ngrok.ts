/**
 * Due to an upstream bug in Nuxt 3 we need to stub the plugin here, track:https://github.com/nuxt/nuxt/issues/18556
 */
import type { NitroApp } from 'nitropack'

import { createNgrokConnection } from '../../../module'

import { useRuntimeConfig } from '#imports'
import type { ModuleOptions } from '~/src/module'

type NitroAppPlugin = (nitro: NitroApp) => void

function defineNitroPlugin(def: NitroAppPlugin): NitroAppPlugin {
  return def
}

export default defineNitroPlugin((_nitro) => {
  const options = useRuntimeConfig().ngrok as ModuleOptions

  createNgrokConnection(options)
})
