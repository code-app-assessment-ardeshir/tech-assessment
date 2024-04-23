export interface ILabel {
  return_address: IReturnAddress,
  order: string,
  name: string,
  language: string
}

export interface IReturnAddress {
  company: string,
  address: string,
  zip_code: string,
  city: string,
  country: string
}