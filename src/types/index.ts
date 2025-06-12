export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  status_id: number;
  category_id: number;
  status?: Status;
  category?: Category;
  created_at?: string;
}

export interface Status {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  daily_rate: number;
  created_at?: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  rg: string;
  cpf: string;
  created_at?: string;
}

export interface Contract {
  id: number;
  client_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  total: number;
  client?: Client;
  vehicle?: Vehicle;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  activeContracts: number;
  totalRevenue: number;
  revenueByDay: {
    day: string;
    revenue: number;
  }[];
  vehiclesByCategory: {
    category: string;
    count: number;
  }[];
}