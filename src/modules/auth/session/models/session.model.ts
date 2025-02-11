import type { DeviceInfo, LocationInfo, SessionMetadata } from '@/src/shared/types/session-metadata.types'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LocationModel implements LocationInfo {
  @Field(() => String)
  country: string

  @Field(() => String)
  city: string

  @Field(() => Number)
  latitude: number

  @Field(() => Number)
  longitude: number
}

@ObjectType()
export class DeviceModel implements DeviceInfo {
  @Field(() => String)
  browser: string

  @Field(() => String)
  os: string

  @Field(() => String)
  type: string
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
  @Field(() => String)
  ip: string

  @Field(() => LocationModel)
  location: LocationInfo

  @Field(() => DeviceModel)
  device: DeviceInfo
}

@ObjectType()
export class SessionModel {
  @Field(() => String)
  id: string

  @Field(() => String)
  userId: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => SessionMetadataModel)
  metadata: SessionMetadataModel
}
