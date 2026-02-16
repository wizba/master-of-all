import type { Task } from './types';

export const domain1Tasks: Task[] = [
  {
    id: 'task-1.1',
    name: 'Task 1.1: Design Secure Access to AWS Resources',
    cards: [
      {
        id: 'iam-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u{1F510}',
        awsIcon: 'iam',
        question: 'Which IAM entity provides temporary credentials that automatically expire?',
        options: [
          'IAM User',
          'IAM Group', 
          'IAM Role',
          'IAM Policy'
        ],
        correctAnswer: 2,
        explanation: '**IAM Roles** provide temporary credentials that automatically expire (15 min to 12 hours). IAM Users have long-term credentials that require manual rotation.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'iam-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u{1F464}',
        awsIcon: 'iam',
        question: 'A company has 50 developers who all need the same S3 and EC2 permissions. What is the MOST efficient approach?',
        options: [
          'Create an IAM policy for each developer',
          'Add all developers to an IAM group and attach the policy to the group',
          'Grant permissions directly to each developer\'s user account',
          'Create a single IAM user for all developers to share'
        ],
        correctAnswer: 1,
        explanation: '**IAM Groups** simplify permission management. Attach policies once to the group, and all members inherit those permissions automatically.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'polp-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F6E1}\uFE0F',
        awsIcon: 'iam',
        question: 'A backup application needs to read from and write to the S3 bucket "company-backups". Which permission set follows the Principle of Least Privilege?',
        options: [
          'Full S3 administrator access',
          's3:* on all buckets',
          's3:PutObject and s3:GetObject on "company-backups/*"',
          'Read-only access to all S3 buckets'
        ],
        correctAnswer: 2,
        explanation: 'This grants ONLY the specific actions needed (read/write) on ONLY the required resource. Full S3 access would allow deleting or modifying other buckets.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'polp-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F3AF}',
        awsIcon: 'iam',
        question: 'What is the PRIMARY benefit of implementing the Principle of Least Privilege?',
        options: [
          'Reduced application development time',
          'Lower AWS service costs',
          'Limited blast radius if credentials are compromised',
          'Faster API response times'
        ],
        correctAnswer: 2,
        explanation: 'Least privilege contains damage from compromised credentials. If an attacker steals credentials, they only have access to minimal resources, not your entire infrastructure.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F510}',
        awsIcon: 'iam',
        question: 'Which AWS account requires MFA as the HIGHEST priority?',
        options: [
          'Individual IAM user accounts',
          'The root account',
          'Billing administrator accounts',
          'EC2 service accounts'
        ],
        correctAnswer: 1,
        explanation: 'The **root account** has unrestricted access to all AWS resources and cannot be limited by IAM policies. If compromised, an attacker has full control of your entire AWS environment.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F3AF}',
        awsIcon: 'iam',
        question: 'An employee\'s password was stolen in a phishing attack. What prevents the attacker from accessing AWS resources if MFA is enabled?',
        options: [
          'The attacker cannot bypass MFA without the physical device or app',
          'AWS automatically blocks all access after password theft',
          'The password becomes invalid immediately',
          'The account is locked for 24 hours'
        ],
        correctAnswer: 0,
        explanation: 'MFA requires a second factor (something you have) in addition to the password (something you know). Password alone is insufficient for access.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'fed-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Federated Access and IAM Identity Center',
        icon: '\u{1F465}',
        awsIcon: 'iam',
        question: 'What is the PRIMARY advantage of using federated access instead of creating IAM users for every employee?',
        options: [
          'It eliminates the need for IAM policies',
          'It provides centralized identity management across multiple AWS accounts',
          'It costs less than IAM users',
          'It automatically grants administrator access'
        ],
        correctAnswer: 1,
        explanation: 'Federation allows you to manage users in one place (corporate directory). When an employee leaves, disable them once and access is revoked from ALL AWS accounts automatically.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'fed-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Federated Access and IAM Identity Center',
        icon: '\u{23F3}',
        awsIcon: 'iam',
        question: 'When a user authenticates through AWS IAM Identity Center, what type of credentials do they receive?',
        options: [
          'Permanent IAM user access keys',
          'Root account credentials',
          'Temporary security credentials that expire',
          'Encrypted passwords stored in AWS'
        ],
        correctAnswer: 2,
        explanation: 'IAM Identity Center provides **temporary credentials** that automatically expire (typically 1-12 hours). This eliminates long-term credentials that could be stolen.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'sts-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Cross-Account Access and AWS STS',
        icon: '\u{1F510}',
        awsIcon: 'iam',
        question: 'Which AWS service issues temporary credentials for cross-account access?',
        options: [
          'AWS KMS',
          'AWS STS (Security Token Service)',
          'AWS IAM',
          'AWS Secrets Manager'
        ],
        correctAnswer: 1,
        explanation: '**AWS STS** generates temporary credentials that include an Access Key ID, Secret Access Key, and Session Token for cross-account access.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'sts-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Cross-Account Access and AWS STS',
        icon: '\u{1F517}',
        awsIcon: 'iam',
        question: 'An application in Account A needs to read from an S3 bucket in Account B. What must be configured?',
        options: [
          'An IAM user in Account B with credentials shared with Account A',
          'An IAM role in Account B with a trust policy allowing Account A, plus an IAM policy in Account A allowing the role',
          'A VPC peering connection between the accounts',
          'Public access enabled on the S3 bucket'
        ],
        correctAnswer: 1,
        explanation: 'Cross-account access requires BOTH: 1) A resource policy/role trust policy in the target account allowing the source account, AND 2) Permission in the source account to assume that role.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'sts-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Cross-Account Access and AWS STS',
        icon: '\u{1F512}',
        awsIcon: 'iam',
        question: 'What is the purpose of an "External ID" in cross-account role trust policies?',
        options: [
          'To encrypt the temporary credentials',
          'To prevent the "confused deputy" problem',
          'To extend the session duration beyond 12 hours',
          'To bypass MFA requirements'
        ],
        correctAnswer: 1,
        explanation: 'The **External ID** acts as a shared secret that prevents a malicious third party from tricking a trusted account into accessing your resources (confused deputy attack).',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'tower-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Multi-Account Security: Control Tower & SCPs',
        icon: '\u{1F3E2}',
        awsIcon: 'organizations',
        question: 'Which statement accurately describes Service Control Policies (SCPs)?',
        options: [
          'SCPs grant permissions to IAM users',
          'SCPs apply only to the root user of each account',
          'SCPs set permission boundaries that apply to ALL IAM entities, including the root user',
          'SCPs are optional recommendations with no enforcement'
        ],
        correctAnswer: 2,
        explanation: 'SCPs act as central guardrails at the organization level, defining the MAXIMUM permissions for all IAM entities (including root) in member accounts.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'tower-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Multi-Account Security: Control Tower & SCPs',
        icon: '\u{1F30D}',
        awsIcon: 'organizations',
        question: 'A company wants to prevent any resources from being created outside of us-east-1 across all their AWS accounts. What is the MOST effective solution?',
        options: [
          'Configure each account\'s IAM policies individually',
          'Apply an SCP that denies actions in unapproved regions',
          'Create a support ticket with AWS to restrict regions',
          'Use AWS Config rules to detect and delete resources in other regions'
        ],
        correctAnswer: 1,
        explanation: 'SCPs provide **preventative controls** at the organization level, blocking unauthorized actions BEFORE they happen across ALL accounts.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'policies-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Resource Policies vs. IAM Policies',
        icon: '\u{1F4DC}',
        awsIcon: 'iam',
        question: 'An IAM user has full S3 permissions in their IAM policy, but the specific S3 bucket they are trying to access has a bucket policy that explicitly denies access to that user. What happens?',
        options: [
          'Access is granted because IAM policy takes precedence',
          'Access is denied because the bucket policy denies it',
          'Access is granted because the user is in the same account',
          'It depends on which policy was created first'
        ],
        correctAnswer: 1,
        explanation: 'Access requires permission from **BOTH** IAM policies AND resource policies. An explicit deny in either policy blocks access.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'policies-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Resource Policies vs. IAM Policies',
        icon: '\u{1F6A8}',
        awsIcon: 's3',
        question: 'A company accidentally configured an S3 bucket policy with "Principal": "*" and "Effect": "Allow" for s3:GetObject. Their IAM policies are strictly configured with least privilege. What is the result?',
        options: [
          'Only authenticated IAM users can access the bucket',
          'No one can access the bucket because IAM denies it',
          'Anyone on the internet can read objects in the bucket',
          'Access is denied due to conflicting policies'
        ],
        correctAnswer: 2,
        explanation: 'When a resource policy specifies "Principal": "*", it grants **public access** that completely bypasses IAM authentication.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'waf-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'AWS WAF',
        icon: '\u{1F6E1}\uFE0F',
        awsIcon: 'waf',
        question: 'Which AWS service protects web applications from common exploits like SQL injection and cross-site scripting (XSS)?',
        options: [
          'AWS Shield',
          'AWS WAF (Web Application Firewall)',
          'AWS Firewall Manager',
          'Network ACLs'
        ],
        correctAnswer: 1,
        explanation: '**AWS WAF** is a web application firewall that helps protect web applications from common web exploits that could affect availability or compromise security.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'waf-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'AWS WAF',
        icon: '\u{1F30D}',
        awsIcon: 'waf',
        question: 'A company has an Application Load Balancer in front of their web application. They want to block requests from specific countries due to licensing restrictions. What should they use?',
        options: [
          'Security groups with IP restrictions',
          'Network ACLs with country CIDR blocks',
          'AWS WAF with geo-match conditions',
          'VPC endpoints'
        ],
        correctAnswer: 2,
        explanation: '**AWS WAF** supports geo-match conditions that can block or allow requests based on the country of origin, making it the right choice for geographic restrictions.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'shield-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'AWS Shield',
        icon: '\u{1F6E1}\uFE0F',
        awsIcon: 'shield',
        question: 'What is the primary purpose of AWS Shield?',
        options: [
          'Protect against SQL injection attacks',
          'Protect against DDoS (Distributed Denial of Service) attacks',
          'Encrypt data at rest',
          'Manage firewall rules across multiple accounts'
        ],
        correctAnswer: 1,
        explanation: '**AWS Shield** is a managed DDoS protection service that safeguards applications running on AWS from denial of service attacks.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'inspector-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Amazon Inspector',
        icon: '\u{1F50D}',
        awsIcon: 'inspector',
        question: 'Which AWS service automatically assesses applications for vulnerabilities, deviations from best practices, and unintended network exposure?',
        options: [
          'AWS Config',
          'Amazon GuardDuty',
          'Amazon Inspector',
          'AWS Trusted Advisor'
        ],
        correctAnswer: 2,
        explanation: '**Amazon Inspector** is an automated vulnerability management service that scans workloads for software vulnerabilities and unintended network exposure.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'ssm-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'AWS Systems Manager',
        icon: '\u{1F527}',
        awsIcon: 'ssm',
        question: 'A company needs to patch hundreds of EC2 instances across multiple environments. Which AWS Systems Manager capability should they use?',
        options: [
          'Systems Manager Parameter Store',
          'Systems Manager Patch Manager',
          'Systems Manager Session Manager',
          'Systems Manager Automation'
        ],
        correctAnswer: 1,
        explanation: '**Patch Manager** automates the process of patching managed nodes with both security-related and other types of updates across your fleet.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'ssm-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'AWS Systems Manager',
        icon: '\u{1F4BB}',
        awsIcon: 'ssm',
        question: 'Which AWS Systems Manager capability allows secure shell access to EC2 instances without opening inbound ports or managing SSH keys?',
        options: [
          'Systems Manager Run Command',
          'Systems Manager Session Manager',
          'Systems Manager State Manager',
          'Systems Manager Inventory'
        ],
        correctAnswer: 1,
        explanation: '**Session Manager** provides secure, auditable shell access to EC2 instances without needing open inbound ports, bastion hosts, or SSH keys.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'ec2-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'EC2 Security',
        icon: '\u{1F4BB}',
        awsIcon: 'ec2',
        question: 'What acts as a stateful virtual firewall at the EC2 instance level?',
        options: [
          'Network ACL',
          'Security group',
          'VPC Flow Logs',
          'AWS WAF'
        ],
        correctAnswer: 1,
        explanation: '**Security groups** act as stateful firewalls controlling inbound and outbound traffic at the instance level. Stateful means return traffic is automatically allowed.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'ec2-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'EC2 Security',
        icon: '\u{1F4BB}',
        awsIcon: 'ec2',
        question: 'How does a security group differ from a Network ACL in terms of state?',
        options: [
          'Security groups are stateless; Network ACLs are stateful',
          'Security groups are stateful; Network ACLs are stateless',
          'Both are stateful',
          'Both are stateless'
        ],
        correctAnswer: 1,
        explanation: '**Security groups are stateful** (return traffic automatically allowed), while **Network ACLs are stateless** (return traffic must be explicitly allowed by rules).',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'ec2-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'EC2 Security',
        icon: '\u{1F512}',
        awsIcon: 'ec2',
        question: 'An application on EC2 needs to access an S3 bucket. What is the MOST secure way to provide credentials?',
        options: [
          'Hardcode access keys in the application code',
          'Store credentials in environment variables',
          'Attach an IAM role to the EC2 instance',
          'Create an IAM user and share credentials'
        ],
        correctAnswer: 2,
        explanation: '**IAM roles** provide temporary, automatically rotated credentials to EC2 instances without storing long-term credentials on the instance.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'container-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Container Security',
        icon: '\u{1F433}',
        awsIcon: 'ecs',
        question: 'What is the PRIMARY security benefit of using AWS Fargate for containers?',
        options: [
          'Lower cost compared to EC2',
          'No need to patch the underlying host operating system',
          'Faster container startup times',
          'Built-in DDoS protection'
        ],
        correctAnswer: 1,
        explanation: '**Fargate is serverless**—AWS manages the underlying infrastructure, including patching the host OS, shifting that security responsibility to AWS.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'lambda-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Lambda Security',
        icon: '\u{1F4C4}',
        awsIcon: 'lambda',
        question: 'What is the security best practice for granting permissions to an AWS Lambda function?',
        options: [
          'Store AWS credentials in the Lambda environment variables',
          'Create an IAM user and embed credentials in the deployment package',
          'Attach an IAM execution role with least privilege permissions',
          'Use the Lambda function\'s source code to authenticate directly'
        ],
        correctAnswer: 2,
        explanation: 'Lambda functions should **assume an IAM execution role** that grants only the specific permissions needed, following least privilege.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 's3-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'S3 Security',
        icon: '\u{1F4BE}',
        awsIcon: 's3',
        question: 'A company wants to ensure all S3 buckets block public access by default. What should they enable at the account level?',
        options: [
          'S3 versioning',
          'S3 Block Public Access',
          'S3 server access logging',
          'S3 lifecycle policies'
        ],
        correctAnswer: 1,
        explanation: '**S3 Block Public Access** provides account-level and bucket-level controls to ensure buckets cannot be made public, overriding any bucket policies or ACLs.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 's3-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'S3 Security',
        icon: '\u{1F512}',
        awsIcon: 's3',
        question: 'Which S3 feature automatically encrypts objects at rest using S3-managed keys without requiring any application changes?',
        options: [
          'S3 client-side encryption',
          'S3 server-side encryption with SSE-S3',
          'AWS KMS with customer-managed keys',
          'S3 versioning'
        ],
        correctAnswer: 1,
        explanation: '**SSE-S3** provides baseline encryption with Amazon S3-managed keys and requires no application modifications—every object is automatically encrypted.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 's3-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'S3 Security',
        icon: '\u{1F4C5}',
        awsIcon: 's3',
        question: 'A company needs to ensure S3 objects are automatically archived to Glacier after 30 days and deleted after 1 year. Which S3 feature should they use?',
        options: [
          'S3 versioning',
          'S3 lifecycle policies',
          'S3 cross-region replication',
          'S3 event notifications'
        ],
        correctAnswer: 1,
        explanation: '**Lifecycle policies** automate transitioning objects between storage classes and expiring them based on defined rules.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'kms-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Encryption (KMS)',
        icon: '\u{1F512}',
        awsIcon: 'kms',
        question: 'Which AWS service provides centralized key management for encryption across AWS services?',
        options: [
          'AWS Secrets Manager',
          'AWS KMS (Key Management Service)',
          'AWS Certificate Manager',
          'AWS CloudHSM'
        ],
        correctAnswer: 1,
        explanation: '**AWS KMS** is a managed service for creating and controlling encryption keys used across AWS services and applications.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'kms-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Encryption (KMS)',
        icon: '\u{1F512}',
        awsIcon: 'kms',
        question: 'What is the PRIMARY difference between AWS KMS and AWS CloudHSM?',
        options: [
          'KMS is more expensive than CloudHSM',
          'KMS is a shared service; CloudHSM provides dedicated, single-tenant hardware',
          'KMS cannot be used with S3; CloudHSM can',
          'CloudHSM requires no management; KMS requires manual patching'
        ],
        correctAnswer: 1,
        explanation: 'KMS is a **multi-tenant managed service**, while CloudHSM provides **dedicated hardware security modules** in a single-tenant environment.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'secrets-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Secrets Management',
        icon: '\u{1F512}',
        awsIcon: 'secrets-manager',
        question: 'Which AWS service is designed specifically to rotate, manage, and retrieve database credentials throughout their lifecycle?',
        options: [
          'AWS KMS',
          'AWS Systems Manager Parameter Store',
          'AWS Secrets Manager',
          'AWS Certificate Manager'
        ],
        correctAnswer: 2,
        explanation: '**AWS Secrets Manager** helps manage the entire lifecycle of secrets, including built-in capabilities for automatic rotation of database credentials.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'secrets-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Secrets Management',
        icon: '\u{1F4B5}',
        awsIcon: 'ssm',
        question: 'A development team needs to store non-sensitive configuration data like application settings. Which service provides the lowest cost option with no additional charges?',
        options: [
          'AWS Secrets Manager',
          'AWS KMS',
          'AWS Systems Manager Parameter Store (Standard tier)',
          'Amazon S3'
        ],
        correctAnswer: 2,
        explanation: 'The **Standard tier of Systems Manager Parameter Store** is offered at no additional charge for storing configuration data and parameters.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'macie-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Data Classification',
        icon: '\u{1F50D}',
        awsIcon: 'macie',
        question: 'Which AWS service uses machine learning to automatically discover, classify, and protect sensitive data in S3?',
        options: [
          'Amazon GuardDuty',
          'AWS Config',
          'Amazon Macie',
          'AWS Security Hub'
        ],
        correctAnswer: 2,
        explanation: '**Amazon Macie** uses ML to automatically discover and classify sensitive data like PII or intellectual property stored in S3.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'backup-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Data Backup',
        icon: '\u{1F4BE}',
        awsIcon: 'backup',
        question: 'Which AWS service provides a centralized, fully managed backup service across AWS services?',
        options: [
          'AWS Storage Gateway',
          'AWS Backup',
          'Amazon S3 Glacier',
          'AWS DataSync'
        ],
        correctAnswer: 1,
        explanation: '**AWS Backup** is a fully managed backup service that centralizes and automates backups across AWS services.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'backup-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Data Backup',
        icon: '\u{1F30D}',
        awsIcon: 'backup',
        question: 'What is the PRIMARY benefit of cross-region replication for backups?',
        options: [
          'Lower storage costs',
          'Protection against region-wide disasters',
          'Faster data access',
          'Automatic data classification'
        ],
        correctAnswer: 1,
        explanation: '**Cross-region replication** protects data against region-wide outages or disasters by maintaining copies in a different geographic region.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'rds-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Database Security',
        icon: '\u{1F4BE}',
        awsIcon: 'rds',
        question: 'Which security feature encrypts an entire Amazon RDS database instance at rest, including all snapshots and automated backups?',
        options: [
          'SSL/TLS for data in transit',
          'RDS encryption using KMS',
          'Database user passwords',
          'IAM database authentication'
        ],
        correctAnswer: 1,
        explanation: '**RDS encryption using KMS** encrypts the underlying storage, automated backups, read replicas, and snapshots for a comprehensive at-rest encryption solution.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'dynamodb-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Database Security',
        icon: '\u{1F4BE}',
        awsIcon: 'dynamodb',
        question: 'How does Amazon DynamoDB encryption at rest work by default?',
        options: [
          'Encryption is optional and must be manually enabled',
          'All DynamoDB tables are automatically encrypted at rest',
          'Encryption is only available in certain regions',
          'Encryption requires client-side implementation'
        ],
        correctAnswer: 1,
        explanation: '**All DynamoDB tables are automatically encrypted at rest** using AWS KMS, with no action required from the customer.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'network-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Data in Transit',
        icon: '\u{1F4E1}',
        awsIcon: 'directconnect',
        question: 'Which AWS service is used to create a private connection between a VPC and on-premises data centers, keeping traffic off the public internet?',
        options: [
          'Internet Gateway',
          'AWS Direct Connect',
          'NAT Gateway',
          'VPC Peering'
        ],
        correctAnswer: 1,
        explanation: '**AWS Direct Connect** establishes a dedicated private network connection from on-premises to AWS, bypassing the public internet.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'compliance-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Compliance',
        icon: '\u{1F4C4}',
        awsIcon: 'artifact',
        question: 'Which AWS service helps demonstrate compliance by providing AWS\'s compliance certifications and reports?',
        options: [
          'AWS Artifact',
          'AWS Config',
          'AWS CloudTrail',
          'AWS Audit Manager'
        ],
        correctAnswer: 0,
        explanation: '**AWS Artifact** is a self-service portal for on-demand access to AWS compliance reports and agreements.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'monitoring-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Monitoring and Audit',
        icon: '\u{1F4CA}',
        awsIcon: 'cloudtrail',
        question: 'Which AWS service records API calls made in an AWS account for security analysis and audit purposes?',
        options: [
          'AWS CloudTrail',
          'Amazon CloudWatch',
          'AWS Config',
          'VPC Flow Logs'
        ],
        correctAnswer: 0,
        explanation: '**AWS CloudTrail** records all API calls made in an account, providing an audit log of who did what, when, and from where.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'monitoring-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Monitoring and Audit',
        icon: '\u{1F50D}',
        awsIcon: 'guardduty',
        question: 'A security team needs to detect and alert on suspicious API activity, such as unusual data transfers or failed login attempts. Which service should they use?',
        options: [
          'Amazon GuardDuty',
          'AWS Shield',
          'AWS WAF',
          'Amazon Inspector'
        ],
        correctAnswer: 0,
        explanation: '**Amazon GuardDuty** is a threat detection service that continuously monitors for malicious activity and unauthorized behavior using machine learning and threat intelligence.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'monitoring-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Monitoring and Audit',
        icon: '\u{1F4E1}',
        awsIcon: 'vpc',
        question: 'What is the purpose of VPC Flow Logs?',
        options: [
          'Log DNS queries within the VPC',
          'Capture information about IP traffic going to and from network interfaces',
          'Log all API calls in the account',
          'Monitor CPU utilization of EC2 instances'
        ],
        correctAnswer: 1,
        explanation: '**VPC Flow Logs** capture metadata about IP traffic flowing to and from network interfaces, helping with network monitoring and security analysis.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'monitoring-4',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Monitoring and Audit',
        icon: '\u{1F4CA}',
        awsIcon: 'securityhub',
        question: 'A company needs to centralize security findings from GuardDuty, Inspector, and Macie into a single dashboard. Which service should they use?',
        options: [
          'Amazon CloudWatch',
          'AWS Security Hub',
          'AWS Config',
          'AWS Trusted Advisor'
        ],
        correctAnswer: 1,
        explanation: '**AWS Security Hub** aggregates, organizes, and prioritizes security findings from multiple AWS services and third-party tools in a single place.',
        type: 'multiple-choice',
        difficulty: 'application'
      }
    ]
  },
  {
    id: 'task-1.2',
    name: 'Task 1.2: Design Secure Workloads and Applications',
    cards: [
      // Additional cards for Task 1.2 would go here
    ]
  },
  {
    id: 'task-1.3',
    name: 'Task 1.3: Determine Appropriate Data Security Controls',
    cards: [
      // Additional cards for Task 1.3 would go here
    ]
  }
];