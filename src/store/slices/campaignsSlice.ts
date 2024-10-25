import { create } from 'zustand';
import { Campaign } from '../../types';

interface CampaignsState {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'stats'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  setActiveCampaign: (campaign: Campaign | null) => void;
  updateCampaignStats: (id: string, updates: Partial<Campaign['stats']>) => void;
}

export const useCampaignsStore = create<CampaignsState>((set) => ({
  campaigns: [],
  activeCampaign: null,
  
  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [
        ...state.campaigns,
        {
          ...campaign,
          id: crypto.randomUUID(),
          stats: {
            sent: 0,
            delivered: 0,
            read: 0,
            responded: 0,
          },
        },
      ],
    })),
    
  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, ...updates } : campaign
      ),
    })),
    
  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
    })),
    
  setActiveCampaign: (campaign) =>
    set({ activeCampaign: campaign }),
    
  updateCampaignStats: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              stats: { ...campaign.stats, ...updates },
            }
          : campaign
      ),
    })),
}));