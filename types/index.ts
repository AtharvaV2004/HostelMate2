export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Trip {
  id: number;
  store: string;
  location: string;
  time: string;
  slots: number;
  total: number;
  user: string;
  rating: number;
  type: string;
  upiId: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status?: 'sending' | 'sent' | 'read';
}
