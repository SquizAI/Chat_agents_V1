import React, { useState } from 'react';
import { Search, Save, Loader } from 'lucide-react';
import { useAddressResearch } from '../hooks/useAddressResearch';
import { useContactsStore } from '../store/slices/contactsSlice';

export default function AddressResearchPanel() {
  const [address, setAddress] = useState('');
  const { isResearching, addressData, researchAddress } = useAddressResearch();
  const { addContact } = useContactsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    await researchAddress(address.trim());
  };

  const handleCreateContact = () => {
    if (!addressData?.success) return;
    
    addContact({
      name: 'New Contact',
      email: '',
      phone: '',
      tags: ['address-verified'],
      category: 'business',
      notes: JSON.stringify(addressData.data, null, 2),
      reminders: []
    });
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address to research..."
            className="flex-1 p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
          />
          <button
            type="submit"
            disabled={isResearching || !address.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isResearching ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </form>

      {addressData?.success && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {addressData.data.address.formatted}
              </h3>
              <button
                onClick={handleCreateContact}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg"
              >
                <Save size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Property Details</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type:</dt>
                    <dd>{addressData.data.propertyType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Year Built:</dt>
                    <dd>{addressData.data.yearBuilt}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Square Footage:</dt>
                    <dd>{addressData.data.squareFootage}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Lot Size:</dt>
                    <dd>{addressData.data.lotSize}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium mb-2">Area Information</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">School District:</dt>
                    <dd>{addressData.data.schoolDistrict}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Zoning:</dt>
                    <dd>{addressData.data.zoning}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Population Density:</dt>
                    <dd>{addressData.data.demographicInfo.populationDensity}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Median Income:</dt>
                    <dd>{addressData.data.demographicInfo.medianIncome}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Nearby Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {addressData.data.nearbyAmenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}