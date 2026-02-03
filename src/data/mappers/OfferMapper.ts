import type { Offer } from '@/domain/entities/Offer'
import type { OfferDTO } from '@/data/dto/OfferDTO'

export class OfferMapper {
  static toDomain(dto: OfferDTO): Offer {
    return {
      offerId: dto.offer_id,
      merchantId: dto.merchant_id,
      offerName: dto.offer_name,
      description: dto.description,
      previewUrl: dto.preview_url,
      logoUrl: dto.logo_url,
      currency: dto.currency,
      offerType: dto.offer_type,
      countries: dto.countries,
      categories: dto.categories,
      applicationStatus: dto.application_status,
      offerStatus: dto.offer_status,
      validationTerms: dto.validation_terms,
      paymentTerms: dto.payment_terms,
      trackingLink: dto.tracking_link,
      lastSyncedAt: dto.last_synced_at,
      commissions: dto.commissions,
      commissionCapped: dto.commission_capped,
    }
  }

  static toDTO(domain: Offer): OfferDTO {
    return {
      offer_id: domain.offerId,
      merchant_id: domain.merchantId,
      offer_name: domain.offerName,
      description: domain.description,
      preview_url: domain.previewUrl,
      logo_url: domain.logoUrl,
      currency: domain.currency,
      offer_type: domain.offerType,
      countries: domain.countries,
      categories: domain.categories,
      application_status: domain.applicationStatus,
      offer_status: domain.offerStatus,
      validation_terms: domain.validationTerms,
      payment_terms: domain.paymentTerms,
      commissions: domain.commissions,
      commission_capped: domain.commissionCapped,
      tracking_link: domain.trackingLink,
      last_synced_at: domain.lastSyncedAt,
    }
  }
}
