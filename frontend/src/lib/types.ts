export type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type ContactRequest = {
  id: number;
  name: string;
  phone: string;
  tattoo_size: string;
  description: string;
  suggested_date: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type ContactRequestPayload = {
  name: string;
  phone: string;
  tattoo_size?: string;
  description: string;
  suggested_date: string;
  email?: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
};
