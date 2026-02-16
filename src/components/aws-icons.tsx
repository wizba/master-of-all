import React from 'react';

const IAMIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="iam-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#759C3E" />
        <stop offset="100%" stopColor="#9ECA4A" />
      </linearGradient>
    </defs>
    <rect fill="url(#iam-grad)" width="80" height="80" rx="4"/>
    <path fill="#FFFFFF" d="M40 20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 28c-5 0-9.3-2.6-11.8-6.4 1.4-3.9 5.1-6.6 9.3-6.6h5c4.2 0 7.9 2.7 9.3 6.6C49.3 51.4 45 54 40 54z"/>
  </svg>
);

const EC2Icon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="ec2-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C8511B" />
        <stop offset="100%" stopColor="#F58536" />
      </linearGradient>
    </defs>
    <rect fill="url(#ec2-grad)" width="80" height="80" rx="4"/>
    <rect x="20" y="20" width="40" height="40" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="3"/>
    <rect x="28" y="28" width="24" height="24" rx="1" fill="#FFFFFF"/>
    <line x1="30" y1="35" x2="50" y2="35" stroke="url(#ec2-grad)" strokeWidth="2"/>
    <line x1="30" y1="40" x2="50" y2="40" stroke="url(#ec2-grad)" strokeWidth="2"/>
    <line x1="30" y1="45" x2="50" y2="45" stroke="url(#ec2-grad)" strokeWidth="2"/>
  </svg>
);

const S3Icon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="s3-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#569A31" />
        <stop offset="100%" stopColor="#8CC63F" />
      </linearGradient>
    </defs>
    <rect fill="url(#s3-grad)" width="80" height="80" rx="4"/>
    <path fill="#FFFFFF" d="M40 20L20 30v20l20 10 20-10V30L40 20zm0 6l14 7-14 7-14-7 14-7zm-16 10l14 7v14l-14-7V36zm18 21V43l14-7v14l-14 7z"/>
  </svg>
);

const LambdaIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="lambda-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C8511B" />
        <stop offset="100%" stopColor="#F58536" />
      </linearGradient>
    </defs>
    <rect fill="url(#lambda-grad)" width="80" height="80" rx="4"/>
    <text x="40" y="55" fontSize="42" fontWeight="bold" fill="#FFFFFF" textAnchor="middle" fontFamily="Arial">λ</text>
  </svg>
);

const DynamoDBIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="dynamo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2E5E9E" />
        <stop offset="100%" stopColor="#527FFF" />
      </linearGradient>
    </defs>
    <rect fill="url(#dynamo-grad)" width="80" height="80" rx="4"/>
    <ellipse cx="40" cy="30" rx="20" ry="8" fill="none" stroke="#FFFFFF" strokeWidth="3"/>
    <ellipse cx="40" cy="40" rx="20" ry="8" fill="none" stroke="#FFFFFF" strokeWidth="3"/>
    <ellipse cx="40" cy="50" rx="20" ry="8" fill="none" stroke="#FFFFFF" strokeWidth="3"/>
    <line x1="20" y1="30" x2="20" y2="50" stroke="#FFFFFF" strokeWidth="3"/>
    <line x1="60" y1="30" x2="60" y2="50" stroke="#FFFFFF" strokeWidth="3"/>
  </svg>
);

const CloudWatchIcon = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full">
    <defs>
      <linearGradient id="cw-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B0084D" />
        <stop offset="100%" stopColor="#FF4F8B" />
      </linearGradient>
    </defs>
    <rect fill="url(#cw-grad)" width="80" height="80" rx="4"/>
    <circle cx="40" cy="40" r="18" fill="none" stroke="#FFFFFF" strokeWidth="3"/>
    <polyline points="40,25 40,40 50,45" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const icons: Record<string, React.FC> = {
  'iam': IAMIcon,
  'ec2': EC2Icon,
  's3': S3Icon,
  'lambda': LambdaIcon,
  'dynamodb': DynamoDBIcon,
  'cloudwatch': CloudWatchIcon
};

export const getAWSIcon = (iconName: string): React.FC | null => {
  return icons[iconName] || null;
};
