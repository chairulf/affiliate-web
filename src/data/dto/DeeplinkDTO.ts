export interface DeeplinkRequestDTO {
  offer_id: number
  url: string
  user_id: string
}

export interface DeeplinkResponseDTO {
  data: {
    tracking_link: string
  }
  status: string
}
