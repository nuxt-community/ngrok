import { addServerPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Config } from '@ngrok/ngrok'
import { defu } from 'defu'

import { connect } from '@ngrok/ngrok'
import { colors } from 'consola/utils'
import { consola } from 'consola'

export interface ModuleOptions extends Config {
  /**
   * Port, network address, url, or named pipe. Defaults to nuxt devServer
   * Examples: "3000", "localhost:3000", "https://192.168.1.100:8443", "unix:/tmp/my.sock", "pipe://./my-pipe"
   */
  addr?: number | string

  /**
   * enable ngrok in production mode
   * @default false
   */
  production?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-ngrok',
    configKey: 'ngrok',
  },
  defaults: {},
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const config = _nuxt.options.runtimeConfig

    config.ngrok = defu(config.ngrok || {}, {
      // authtoken_from_env: import.meta.env?.NGROK_AUTHTOKEN ? true : false,
      addr: _nuxt.options.devServer.port,
      production: false,
      ..._options,
    })

    if (_nuxt.options.dev) {
      _nuxt.hook('listen', async () => createNgrokConnection(config.ngrok))
    }
    else if (config.ngrok.production) {
      addServerPlugin(resolve('./runtime/server/plugins/ngrok'))
    }
  },
})

export function createNgrokConnection(options: ModuleOptions) {
  connect({
    ...options,
  }).then((listener) => {
    consola.success(colors.green('Ngrok connected at'), colors.blue(listener.url() ?? 'undefined'))
  }).catch((error) => {
    consola.error(colors.red('Ngrok connection error:'), error)
  })
}
