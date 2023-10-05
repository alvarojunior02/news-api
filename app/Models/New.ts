import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeFind,
  beforeFetch,
  column,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class New extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  @beforeFind()
  public static ignoreDeletedBeforeFind(query: ModelQueryBuilderContract<typeof New>) {
    query.whereNull('deleted_at')
  }

  @beforeFetch()
  public static ignoreDeletedBeforeFetch(query: ModelQueryBuilderContract<typeof New>) {
    query.whereNull('deleted_at')
  }

  public async softDelete(news: New) {
    news.deletedAt = DateTime.now()
    await news.save()
  }
}
