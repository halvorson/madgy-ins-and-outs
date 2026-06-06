export interface Trackable {
  id: string
  displayName: string
  type: 'pill' | 'activity'
}

export async function getTrackables(): Promise<Trackable[]> {
  return [
    { id: 'carprofen',  displayName: 'Carprofen',  type: 'pill' },
    { id: 'gabapentin', displayName: 'Gabapentin', type: 'pill' },
    { id: 'trazodone',  displayName: 'Trazodone',  type: 'pill' },
    { id: 'ate',        displayName: 'Ate',        type: 'activity' },
    { id: 'peed',       displayName: 'Peed',       type: 'activity' },
    { id: 'pooped',     displayName: 'Pooped',     type: 'activity' },
  ]
}
