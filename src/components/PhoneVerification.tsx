import React, { useState } from 'react';
import { Loader, Send, Check } from 'lucide-react';
import { useVerification } from '../hooks/useVerification';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified?: () => void;
}

export default function PhoneVerification({ phoneNumber, onVerified }: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const { isVerifying, isSendingCode, sendVerificationCode, verifyCode } = useVerification();

  const handleSendCode = async () => {
    const success = await sendVerificationCode(phoneNumber);
    if (success) {
      setVerificationCode('');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) return;

    const success = await verifyCode(phoneNumber, verificationCode);
    if (success) {
      setIsVerified(true);
      onVerified?.();
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <Check size={20} />
        <span>Phone number verified</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handleSendCode}
          disabled={isSendingCode}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSendingCode ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
        </button>
        <span className="text-sm text-gray-500">
          {isSendingCode ? 'Sending code...' : 'Send verification code'}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit code"
          className="flex-1 p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
          maxLength={6}
        />
        <button
          onClick={handleVerifyCode}
          disabled={isVerifying || verificationCode.length !== 6}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isVerifying ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            'Verify'
          )}
        </button>
      </div>
    </div>
  );
}