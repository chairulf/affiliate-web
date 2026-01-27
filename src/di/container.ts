import { OfferRepositoryImpl } from '@/data/repositories/OfferRepositoryImpl'
import { DeeplinkRepositoryImpl } from '@/data/repositories/DeeplinkRepositoryImpl'
import type { IOfferRepository } from '@/domain/repositories/IOfferRepository'
import type { IDeeplinkRepository } from '@/domain/repositories/IDeeplinkRepository'

class DIContainer {
  private static instance: DIContainer
  private offerRepository: IOfferRepository
  private deeplinkRepository: IDeeplinkRepository

  private constructor() {
    this.offerRepository = new OfferRepositoryImpl()
    this.deeplinkRepository = new DeeplinkRepositoryImpl()
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  getOfferRepository(): IOfferRepository {
    return this.offerRepository
  }

  getDeeplinkRepository(): IDeeplinkRepository {
    return this.deeplinkRepository
  }
}

export default DIContainer
