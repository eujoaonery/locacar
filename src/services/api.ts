import { supabase } from '../lib/supabase';
import type { Vehicle, Status, Category, Client, Contract } from '../types';

// Vehicles
export const vehiclesApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, status:status_id(*), category:category_id(*)')
      .order('id');
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: number): Promise<Vehicle | null> => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, status:status_id(*), category:category_id(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicle)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  rent: async (id: number): Promise<Vehicle> => {
    // Update vehicle status to rented (assuming status_id 2 is 'Rented')
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status_id: 2 })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  sendToMaintenance: async (id: number): Promise<Vehicle> => {
    // Update vehicle status to maintenance (assuming status_id 3 is 'In Maintenance')
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status_id: 3 })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Statuses
export const statusesApi = {
  getAll: async (): Promise<Status[]> => {
    const { data, error } = await supabase
      .from('statuses')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: number): Promise<Status | null> => {
    const { data, error } = await supabase
      .from('statuses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (status: Omit<Status, 'id'>): Promise<Status> => {
    const { data, error } = await supabase
      .from('statuses')
      .insert(status)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: number, status: Partial<Status>): Promise<Status> => {
    const { data, error } = await supabase
      .from('statuses')
      .update(status)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('statuses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Categories
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: number): Promise<Category | null> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: number, category: Partial<Category>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  adjustDailyRate: async (id: number, newRate: number): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update({ daily_rate: newRate })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Clients
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: number): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: number, client: Partial<Client>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Contracts
export const contractsApi = {
  getAll: async (): Promise<Contract[]> => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:client_id(*), vehicle:vehicle_id(*)')
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: number): Promise<Contract | null> => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:client_id(*), vehicle:vehicle_id(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (contract: Omit<Contract, 'id'>): Promise<Contract> => {
    // First, update the vehicle status to rented
    await vehiclesApi.rent(contract.vehicle_id);
    
    // Then create the contract
    const { data, error } = await supabase
      .from('contracts')
      .insert(contract)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: number, contract: Partial<Contract>): Promise<Contract> => {
    const { data, error } = await supabase
      .from('contracts')
      .update(contract)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  calculateTotal: async (
    vehicleId: number, 
    startDate: string, 
    endDate: string
  ): Promise<number> => {
    // Get vehicle category to get daily rate
    const vehicle = await vehiclesApi.getById(vehicleId);
    if (!vehicle || !vehicle.category) {
      throw new Error('Vehicle or its category not found');
    }
    
    const dailyRate = vehicle.category.daily_rate;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return dailyRate * diffDays;
  },
  
  extendContract: async (
    id: number, 
    newEndDate: string
  ): Promise<Contract> => {
    const contract = await contractsApi.getById(id);
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    const newTotal = await contractsApi.calculateTotal(
      contract.vehicle_id,
      contract.start_date,
      newEndDate
    );
    
    return contractsApi.update(id, {
      end_date: newEndDate,
      total: newTotal
    });
  },
  
  endContract: async (id: number): Promise<void> => {
    const contract = await contractsApi.getById(id);
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    // Set vehicle back to available (status_id 1)
    await vehiclesApi.update(contract.vehicle_id, { status_id: 1 });
  }
};

// Dashboard
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    // Total vehicles
    const { count: totalVehicles } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true });
    
    // Available vehicles (status_id 1 = available)
    const { count: availableVehicles } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status_id', 1);
    
    // Active contracts (current date between start_date and end_date)
    const today = new Date().toISOString().split('T')[0];
    const { count: activeContracts } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .lte('start_date', today)
      .gte('end_date', today);
    
    // Total revenue (sum of all contracts)
    const { data: revenueData } = await supabase
      .from('contracts')
      .select('total');
    
    const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
    
    // Revenue by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: dailyRevenue } = await supabase
      .from('contracts')
      .select('start_date, total')
      .gte('start_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('start_date', { ascending: true });

    // Group by day and sum revenue
    const revenueByDay = [];
    const last30Days = [];
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last30Days.push(date.toISOString().split('T')[0]);
    }
    
    // Create revenue data for each day
    last30Days.forEach(day => {
      const dayRevenue = dailyRevenue?.filter(contract => 
        contract.start_date === day
      ).reduce((sum, contract) => sum + contract.total, 0) || 0;
      
      const dayFormatted = new Date(day).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      revenueByDay.push({
        day: dayFormatted,
        revenue: dayRevenue
      });
    });
    
    // Vehicles by category
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');
    
    const vehiclesByCategory = await Promise.all(
      (categories || []).map(async (category) => {
        const { count } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id);
        
        return {
          category: category.name,
          count: count || 0
        };
      })
    );
    
    return {
      totalVehicles: totalVehicles || 0,
      availableVehicles: availableVehicles || 0,
      activeContracts: activeContracts || 0,
      totalRevenue,
      revenueByDay,
      vehiclesByCategory
    };
  }
};

// Auth
export const authApi = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  signup: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  }
};