import React, { useState } from 'react';
import { Plus, Users, Calendar, Send, BarChart2 } from 'lucide-react';
import { useCampaignsStore } from '../store/slices/campaignsSlice';

export default function CampaignsPanel() {
  const { campaigns, addCampaign } = useCampaignsStore();
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <button
            onClick={() => setShowNewCampaign(true)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{campaign.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                campaign.status === 'running' ? 'bg-green-100 text-green-600' :
                campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                campaign.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {campaign.status}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{campaign.recipients.length} recipients</span>
              </div>
              {campaign.scheduledDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(campaign.scheduledDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-500">
                  {campaign.stats.sent}
                </div>
                <div className="text-xs text-gray-500">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-500">
                  {campaign.stats.delivered}
                </div>
                <div className="text-xs text-gray-500">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-500">
                  {campaign.stats.read}
                </div>
                <div className="text-xs text-gray-500">Read</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-500">
                  {campaign.stats.responded}
                </div>
                <div className="text-xs text-gray-500">Responded</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}