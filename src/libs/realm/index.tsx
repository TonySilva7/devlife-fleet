import { createRealmContext } from '@realm/react'

import { Historic } from './schemas/Historic'
import {
  // AnyUser,
  OpenRealmBehaviorConfiguration,
  OpenRealmBehaviorType,
  // SyncConfiguration,
} from 'realm'

const behaviorAccess: OpenRealmBehaviorConfiguration = {
  type: OpenRealmBehaviorType.OpenImmediately,
}

// export const syncConfig: SyncConfiguration = {
export const syncConfig: any = {
  // tipo de sincronização que será utilizada
  flexible: true,
  // define como o banco vai ser aberto para novos arquivos (após o download dos dados ou imediatamente)
  newRealmFileBehavior: behaviorAccess,
  // define como o banco vai ser aberto para arquivos existentes (após o download dos dados ou imediatamente)
  existingRealmFileBehavior: behaviorAccess,
  // user: null as unknown as AnyUser,
}

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic],
  })
