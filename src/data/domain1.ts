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
        question: 'What are the 4 core components of AWS IAM?',
        answer: '1. **Users** \u{1F464} - Individual entities with long-term credentials\n2. **Groups** \u{1F465} - Collections of users for simplified permission management\n3. **Roles** \u{1F3AD} - Temporary permissions without permanent credentials\n4. **Policies** \u{1F4DC} - JSON documents defining permissions',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'iam-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u{1F464}',
        awsIcon: 'iam',
        question: 'What is an IAM User?',
        answer: 'An IAM User is an individual entity (person or application) with **long-term credentials** (password, access keys) for direct AWS interaction.\n\n**Key Point**: Users have permanent credentials that should be rotated regularly.',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'iam-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u{1F465}',
        awsIcon: 'iam',
        question: 'What is an IAM Group and why use it?',
        answer: 'An IAM Group is a collection of IAM users.\n\n**Purpose**: Simplifies permission management by attaching policies to groups instead of individual users.\n\n**Example**: Create a "Developers" group with S3 and EC2 permissions - all users in the group inherit these permissions.',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'iam-4',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u{1F3AD}',
        awsIcon: 'iam',
        question: 'What is an IAM Role and when should you use it?',
        answer: 'An IAM Role grants **temporary permissions** to AWS services or trusted external entities **without permanent credentials**.\n\n**Use Cases**:\n\u2022 EC2 instance accessing S3 \u2705\n\u2022 Lambda function accessing DynamoDB \u2705\n\u2022 Cross-account access \u2705\n\u2022 External identity federation \u2705',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'iam-5',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u{1F4DC}',
        awsIcon: 'iam',
        question: 'What is an IAM Policy?',
        answer: 'A **JSON document** that defines specific permissions (allowed or denied actions on resources).\n\n**Attached to**: Users, Groups, or Roles\n\n**Example Structure**:\n```json\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": "s3:GetObject",\n    "Resource": "arn:aws:s3:::mybucket/*"\n  }]\n}\n```',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'polp-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F6E1}\uFE0F',
        awsIcon: 'iam',
        question: 'What is the Principle of Least Privilege (PoLP)?',
        answer: 'The Principle of Least Privilege grants **only the minimum permissions needed** for a user or service to perform its task.\n\n**Benefits**:\n\u2022 Reduces attack surface \u{1F3AF}\n\u2022 Limits blast radius of breaches \u{1F4A5}\n\u2022 Easier to audit \u{1F4CB}\n\u2022 Contains compromised credentials \u{1F512}',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'polp-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u26A0\uFE0F',
        awsIcon: 'iam',
        question: 'What is the main problem with granting `*` permissions on `*` resources?',
        answer: '**This creates a massive security hole!** \u{1F6A8}\n\nGranting all actions (`*`) on all resources (`*`) means:\n\u2022 User can do ANYTHING in your AWS account\n\u2022 No containment if credentials are compromised\n\u2022 Violates least privilege principle\n\u2022 Difficult to audit what\'s actually being used\n\n**Never do this in production!**',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'polp-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F3AF}',
        awsIcon: 'iam',
        question: 'What are the 3 key benefits of implementing Least Privilege?',
        answer: '1. **Reduced Attack Surface** \u{1F3AF}\n   Fewer ways for attackers to exploit privileges\n\n2. **Limited Blast Radius** \u{1F4A5}\n   If credentials are compromised, damage is contained\n\n3. **Improved Auditability** \u{1F4CA}\n   Easier to understand and review access patterns',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'iam-mc-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u2753',
        awsIcon: 'iam',
        question: 'Which IAM entity provides temporary credentials?',
        options: [
          'IAM User',
          'IAM Group',
          'IAM Role',
          'IAM Policy'
        ],
        correctAnswer: 2,
        explanation: '**IAM Roles** provide temporary credentials. Unlike Users (permanent credentials) or Groups (just containers for users), Roles are assumed temporarily by services or users.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'iam-mc-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Fundamentals',
        icon: '\u2753',
        awsIcon: 'iam',
        question: 'What is the primary purpose of IAM Groups?',
        options: [
          'Store AWS resources',
          'Simplify permission management for multiple users',
          'Provide temporary credentials',
          'Define actions allowed on resources'
        ],
        correctAnswer: 1,
        explanation: '**IAM Groups** simplify permission management by allowing you to attach policies to a collection of users instead of managing permissions individually.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'polp-mc-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u2753',
        awsIcon: 'iam',
        question: 'Which permission set follows the Principle of Least Privilege for a backup application?',
        options: [
          'Full S3 administrator access to all buckets',
          's3:* permissions on specific backup bucket',
          's3:PutObject and s3:GetObject on specific backup bucket',
          'Read-only access to entire AWS account'
        ],
        correctAnswer: 2,
        explanation: '**s3:PutObject and s3:GetObject on specific backup bucket** follows PoLP by granting ONLY the minimum permissions needed (read/write) on ONLY the specific bucket required.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'iam-scenario-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Best Practices',
        icon: '\u{1F3AF}',
        awsIcon: 'ec2',
        question: 'SCENARIO: An application on EC2 needs to access S3. Should you hardcode AWS credentials or use an IAM role?',
        answer: '**Use an IAM Role** \u2705\n\n**Why**:\n\u2022 No hardcoded credentials in code \u{1F512}\n\u2022 Temporary credentials automatically rotated \u{1F504}\n\u2022 Follows least privilege principle \u{1F4CA}\n\u2022 More secure and maintainable \u{1F4AA}\n\n**Wrong Approach** \u274C: Hardcoding access keys in application code creates security risks and maintenance nightmares.',
        type: 'scenario',
        difficulty: 'application'
      },
      {
        id: 'iam-scenario-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Best Practices',
        icon: '\u{1F3E2}',
        awsIcon: 'iam',
        question: 'SCENARIO: You have 50 developers who all need the same S3 and EC2 permissions. What\'s the best approach?',
        answer: '**Create an IAM Group** (e.g., "Developers") and attach policies to the group \u2705\n\n**Benefits**:\n\u2022 Manage permissions in ONE place \u{1F3AF}\n\u2022 Add/remove users easily \u{1F465}\n\u2022 Consistent permissions across team \u2696\uFE0F\n\u2022 Audit trail simplification \u{1F4DD}\n\n**Wrong Approach** \u274C: Attaching policies to each individual user = management nightmare and inconsistent permissions.',
        type: 'scenario',
        difficulty: 'application'
      },
      {
        id: 'polp-scenario-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F4BE}',
        awsIcon: 's3',
        question: 'SCENARIO: A user manages S3 backups. What permissions should they have?',
        answer: '**Grant specific permissions on specific bucket** \u2705\n\nInstead of `AmazonS3FullAccess` (too broad), grant:\n\u2022 `s3:PutObject` - Upload backups\n\u2022 `s3:GetObject` - Download backups\n\u2022 `s3:ListBucket` - List backup files\n\n**Only on**: `arn:aws:s3:::backup-bucket/*`\n\n**Why**: Follows PoLP - user can only manage backups, not delete production data or access other buckets.',
        type: 'scenario',
        difficulty: 'application'
      },
      {
        id: 'polp-scenario-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u26A1',
        awsIcon: 'lambda',
        question: 'SCENARIO: A Lambda function needs to read from DynamoDB and write logs to CloudWatch. What should its execution role include?',
        answer: '**Grant only required permissions** \u2705\n\n**Required Permissions**:\n\u2022 `dynamodb:GetItem` on specific table\n\u2022 `dynamodb:Query` on specific table\n\u2022 `logs:CreateLogGroup`\n\u2022 `logs:CreateLogStream`\n\u2022 `logs:PutLogEvents`\n\n**NOT**:\n\u274C Full DynamoDB access\n\u274C All CloudWatch permissions\n\u274C Any EC2, S3, or unrelated permissions\n\n**Benefit**: If Lambda is compromised, attacker can only read that one DynamoDB table - can\'t delete data, access other services, or launch EC2 instances.',
        type: 'scenario',
        difficulty: 'advanced'
      },
      {
        id: 'polp-scenario-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F513}',
        awsIcon: 'iam',
        question: 'SCENARIO: Your team lead wants to grant a contractor full admin access "to get started quickly". What are the security risks?',
        answer: '**This violates PoLP and creates serious risks!** \u{1F6A8}\n\n**Risks**:\n\u2022 Contractor can access ALL AWS resources \u{1F631}\n\u2022 Can create/delete production infrastructure \u{1F4A3}\n\u2022 Can view sensitive data, credentials, billing \u{1F513}\n\u2022 Can create backdoor IAM users for persistence \u{1F6AA}\n\u2022 If contractor\'s credentials leak, entire AWS account is compromised \u{1F4A5}\n\n**Better Approach** \u2705:\n1. Identify specific tasks contractor needs\n2. Grant only those permissions\n3. Use IAM role with session duration limits\n4. Add condition keys (source IP, MFA, time-based)\n5. Regular access reviews',
        type: 'scenario',
        difficulty: 'advanced'
      },
      {
        id: 'iam-mc-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Best Practices',
        icon: '\u2753',
        awsIcon: 'ec2',
        question: 'An EC2 instance needs to read from an S3 bucket. What is the MOST secure approach?',
        options: [
          'Hardcode AWS access keys in the application code',
          'Store credentials in an environment variable on the instance',
          'Attach an IAM role to the EC2 instance',
          'Create an IAM user and share the password'
        ],
        correctAnswer: 2,
        explanation: '**Attach an IAM role** to the EC2 instance. This provides temporary, automatically-rotating credentials without storing permanent credentials on the instance. This follows AWS security best practices and the principle of least privilege.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'iam-policy-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Policies',
        icon: '\u{1F4C4}',
        awsIcon: 'iam',
        question: 'What does this IAM policy do?\n```json\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": [\n      "s3:GetObject",\n      "s3:PutObject"\n    ],\n    "Resource": "arn:aws:s3:::my-bucket/*"\n  }]\n}\n```',
        answer: 'This policy **allows**:\n\u2705 Reading objects (`s3:GetObject`)\n\u2705 Writing objects (`s3:PutObject`)\n\nFrom the bucket: `my-bucket`\n\n**Important**: The `/*` at the end means it applies to all objects IN the bucket, not the bucket itself.\n\n**Missing**: Permission to list the bucket (`s3:ListBucket` would need `arn:aws:s3:::my-bucket` without `/*`)',
        type: 'code-analysis',
        difficulty: 'application'
      },
      {
        id: 'iam-policy-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'IAM Policies',
        icon: '\u{1F4C4}',
        awsIcon: 'iam',
        question: 'What does this IAM policy do?\n```json\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Deny",\n    "Action": "s3:DeleteObject",\n    "Resource": "*"\n  }]\n}\n```',
        answer: 'This policy **explicitly denies** deleting any S3 object across ALL buckets (`"Resource": "*"`).\n\n**Key Point**: \u{1F6AB} **Explicit Deny always wins** - even if another policy allows `s3:DeleteObject`, this deny will override it.\n\n**Use Case**: Prevent accidental deletion of critical data across the entire AWS account.',
        type: 'code-analysis',
        difficulty: 'application'
      },
      {
        id: 'polp-policy-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F4C4}',
        awsIcon: 's3',
        question: 'Does this policy follow the Principle of Least Privilege for a backup user?\n```json\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": "s3:*",\n    "Resource": "arn:aws:s3:::backup-bucket/*"\n  }]\n}\n```',
        answer: '**No, this violates PoLP!** \u274C\n\n**Problem**: `s3:*` grants ALL S3 actions including:\n\u2022 `s3:DeleteObject` - Can delete backups \u{1F5D1}\uFE0F\n\u2022 `s3:DeleteBucket` - Can delete entire bucket \u{1F4A3}\n\u2022 `s3:PutBucketPolicy` - Can change bucket security \u{1F513}\n\n**Better Approach** \u2705:\n```json\n{\n  "Effect": "Allow",\n  "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],\n  "Resource": "arn:aws:s3:::backup-bucket/*"\n}\n```\n\nOnly grant what\'s needed for backups!',
        type: 'code-analysis',
        difficulty: 'advanced'
      },
      {
        id: 'iam-principle-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Security Principles',
        icon: '\u{1F6E1}\uFE0F',
        awsIcon: 'iam',
        question: 'What is the Least Privilege Principle in IAM?',
        answer: '**Least Privilege**: Grant only the minimum permissions needed to perform a task - nothing more.\n\n**Example**:\n\u274C Bad: Give full S3 admin access when only read access is needed\n\u2705 Good: Grant only `s3:GetObject` permission for specific buckets\n\n**Benefits**:\n\u2022 Reduces blast radius of security breaches \u{1F4A5}\n\u2022 Limits accidental damage \u{1F6E1}\uFE0F\n\u2022 Compliance requirement \u{1F4CB}',
        type: 'concept',
        difficulty: 'fundamental'
      },
      {
        id: 'polp-reflection-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'Principle of Least Privilege',
        icon: '\u{1F914}',
        awsIcon: 'lambda',
        question: 'How does applying PoLP to a Lambda function\'s execution role enhance your serverless application\'s security posture?',
        answer: '**PoLP transforms Lambda security** \u{1F680}\n\n**Without PoLP** \u274C:\n\u2022 Lambda has broad permissions\n\u2022 Compromised function = full AWS access\n\u2022 Code vulnerabilities can be exploited widely\n\u2022 Hard to audit what function actually needs\n\n**With PoLP** \u2705:\n\u2022 Function can only access specific DynamoDB table, specific S3 bucket\n\u2022 Code injection attacks are contained \u{1F512}\n\u2022 Accidental bugs can\'t destroy infrastructure \u{1F6E1}\uFE0F\n\u2022 Clear audit trail of what resources are touched \u{1F4CA}\n\u2022 Compliance: demonstrates security controls \u{1F4CB}\n\n**Defense in Depth**: Even if your Lambda code has a vulnerability, the blast radius is minimal.',
        type: 'concept',
        difficulty: 'advanced'
      },
            {
        id: 'mfa-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F510}',
        awsIcon: 'iam',
        question: 'What is Multi-Factor Authentication (MFA) in simple terms?',
        answer: '**MFA = Password + Something You Have**\n\nInstead of just typing a password (one factor), you also need a second thing—like a code from your phone or a physical security key.\n\n**Example**: \n1. Enter password \u2705\n2. Enter 6-digit code from phone app \u2705\n3. Now you\'re in! \u{1F513}',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F3AF}',
        awsIcon: 'iam',
        question: 'Why is MFA important if I already have a strong password?',
        answer: '**Even strong passwords can be stolen!** \u{1F6A8}\n\n**Password Alone**:\n\u2022 Can be phished (fake login pages)\n\u2022 Can be leaked in data breaches\n\u2022 Can be guessed by computers\n\n**With MFA**:\n\u2022 Thief needs your password AND your physical device\n\u2022 One factor compromised? Account still safe \u{1F6E1}\uFE0F\n\u2022 Blocks 99.9% of automated attacks (Microsoft research)',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F464}',
        awsIcon: 'iam',
        question: 'Which AWS account MUST have MFA enabled above all others?',
        answer: '**The Root Account** \u{1F480}\n\n**Why?**\n\u2022 Root has **unlimited power** over your entire AWS account\n\u2022 Can delete everything, change billing, lock you out\n\u2022 Cannot be restricted by IAM policies\n\n**Rule**: Enable MFA on root account **immediately** after creating your AWS account—before doing anything else!',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-4',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F4F1}',
        awsIcon: 'iam',
        question: 'What are the three main types of MFA devices AWS supports?',
        answer: '1. **Virtual MFA** \u{1F4F1}\n   Apps like Google Authenticator, Authy, Microsoft Authenticator\n   \n2. **Hardware MFA** \u{1F5A5}\uFE0F\n   Physical devices like YubiKey, RSA token\n   \n3. **SMS (Text Message)** \u{1F4E7}\n   Code sent to your phone (least secure, but better than nothing)',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-5',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F465}',
        awsIcon: 'iam',
        question: 'Should regular IAM users (not just admins) use MFA?',
        answer: '**Yes! All IAM users should use MFA.** \u2705\n\n**Best Practice**: \n\u2022 Enable MFA for **all** users with console access\n\u2022 Especially important for users with any resource permissions\n\u2022 AWS now mandates MFA for privileged accounts starting mid-2024 [^2^]\n\n**Enforcement**: You can create IAM policies that **require** MFA—users can\'t do anything until they set it up!',
        type: 'flashcard',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-mc-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u2753',
        awsIcon: 'iam',
        question: 'Which AWS account should have MFA enabled as the highest priority?',
        options: [
          'Any IAM user account',
          'The root account',
          'Only billing administrators',
          'Only EC2 service accounts'
        ],
        correctAnswer: 1,
        explanation: '**The root account** has unrestricted access to all AWS resources and cannot be limited by IAM policies. It is the most critical account to protect with MFA.',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-mc-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u2753',
        awsIcon: 'iam',
        question: 'What does MFA protect against?',
        options: [
          'Only weak passwords',
          'Only phishing attacks',
          'Stolen or compromised credentials even if the password is strong',
          'Only insider threats'
        ],
        correctAnswer: 2,
        explanation: 'MFA protects against stolen or compromised credentials because even if an attacker obtains the password, they cannot access the account without the second factor (the physical device or app).',
        type: 'multiple-choice',
        difficulty: 'fundamental'
      },
      {
        id: 'mfa-mc-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u2753',
        awsIcon: 'iam',
        question: 'Which of the following is the MOST secure MFA method for AWS?',
        options: [
          'SMS text message',
          'Virtual MFA app (Google Authenticator)',
          'Hardware security key (FIDO U2F like YubiKey)',
          'Email-based MFA code'
        ],
        correctAnswer: 2,
        explanation: '**Hardware security keys (FIDO U2F/FIDO2)** are the most secure because they are phishing-resistant. They use public key cryptography and require physical touch, making them immune to remote attacks that can affect SMS or virtual apps.',
        type: 'multiple-choice',
        difficulty: 'application'
      },
      {
        id: 'mfa-scenario-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F3E2}',
        awsIcon: 'iam',
        question: 'SCENARIO: Your company has 20 developers with IAM access. Some haven\'t enabled MFA yet. How do you enforce this without manually checking each user?',
        answer: '**Use an IAM Policy to Enforce MFA** \u2705\n\nCreate a policy that **denies all actions** unless the user has authenticated with MFA:\n\n```json\n{\n  "Effect": "Deny",\n  "NotAction": [\n    "iam:CreateVirtualMFADevice",\n    "iam:EnableMFADevice",\n    "iam:GetUser"\n  ],\n  "Resource": "*",\n  "Condition": {\n    "BoolIfExists": {\n      "aws:MultiFactorAuthPresent": "false"\n    }\n  }\n}\n```\n\n**Result**: Users can\'t do anything except set up MFA until they complete MFA setup! [^3^]',
        type: 'scenario',
        difficulty: 'application'
      },
      {
        id: 'mfa-scenario-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F4B8}',
        awsIcon: 'iam',
        question: 'SCENARIO: Your CFO is worried about AWS account security after hearing about a competitor\'s breach. They ask: "What if someone steals our admin password?" How does MFA address this concern?',
        answer: '**MFA Neutralizes Stolen Passwords** \u{1F6E1}\uFE0F\n\n**The Threat**: Attacker steals admin password via phishing\n\n**Without MFA**: \n\u2022 Attacker has full admin access immediately \u{1F4A5}\n\u2022 Can delete resources, steal data, rack up bills\n\n**With MFA**:\n\u2022 Attacker enters password... then hits a wall \u{1F6AB}\n\u2022 Needs the physical MFA device or app\n\u2022 **Cannot proceed** without the second factor\n\n**Business Value**: Password theft becomes a minor incident, not a catastrophic breach. CFO can sleep better! \u{1F4CA}',
        type: 'scenario',
        difficulty: 'application'
      },
      {
        id: 'mfa-policy-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F4C4}',
        awsIcon: 'iam',
        question: 'What does this IAM policy condition check?\n```json\n"Condition": {\n  "BoolIfExists": {\n    "aws:MultiFactorAuthPresent": "false"\n  }\n}\n```',
        answer: '**It checks: "Is MFA NOT being used?"** \u2753\n\n**Breakdown**:\n\u2022 `aws:MultiFactorAuthPresent` = Was MFA used in this request?\n\u2022 `"false"` = Check if MFA is NOT present\n\u2022 `BoolIfExists` = Also true if the key doesn\'t exist (for CLI/API calls)\n\n**Used with**: `"Effect": "Deny"` to block access when MFA is missing\n\n**Why `IfExists`?** Without it, CLI users with long-term credentials could bypass the check because they don\'t send MFA data at all! [^3^]',
        type: 'code-analysis',
        difficulty: 'application'
      },
      {
        id: 'mfa-policy-2',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F4C4}',
        awsIcon: 'iam',
        question: 'Analyze this MFA enforcement policy. What can a user do WITHOUT MFA?\n```json\n{\n  "Effect": "Deny",\n  "NotAction": [\n    "iam:CreateVirtualMFADevice",\n    "iam:EnableMFADevice",\n    "iam:ListVirtualMFADevices",\n    "iam:ResyncMFADevice",\n    "iam:GetUser",\n    "sts:GetSessionToken"\n  ],\n  "Resource": "*",\n  "Condition": {\n    "BoolIfExists": {\n      "aws:MultiFactorAuthPresent": "false"\n    }\n  }\n}\n```',
        answer: '**Users WITHOUT MFA can ONLY**:\n\u2705 Create a virtual MFA device\n\u2705 Enable/setup their MFA device\n\u2705 List their MFA devices\n\u2705 Resync MFA device (if time is off)\n\u2705 View their own user info\n\u2705 Get a session token (for CLI MFA)\n\n**Users CANNOT**:\n\u274C Access S3, EC2, or any other AWS services\n\u274C View billing information\n\u274C Modify any resources\n\n**This is a "Force MFA" policy**—it locks users out until they set up MFA! [^6^]',
        type: 'code-analysis',
        difficulty: 'application'
      },
      {
        id: 'mfa-concept-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F914}',
        awsIcon: 'iam',
        question: 'How does MFA fundamentally change the security model compared to just using passwords?',
        answer: '**From "Something You Know" to "Something You Know + Something You Have"** \n\n**Single Factor (Password)**:\n\u2022 Knowledge-based\n\u2022 Can be copied, guessed, phished\n\u2022 One point of failure\n\n**Multi-Factor**:\n\u2022 **Knowledge** (password) + **Possession** (device)\n\u2022 Must compromise TWO different things\n\u2022 Physical separation (attacker in Russia can\'t steal your phone in NYC)\n\u2022 **Asymmetric security**: Easy for legitimate user, hard for attacker\n\n**Cloud Criticality**: In AWS, credentials can spawn unlimited resources. MFA ensures that even if credentials leak, attackers cannot access the "keys to the kingdom."',
        type: 'concept',
        difficulty: 'advanced'
      },
      {
        id: 'mfa-scenario-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u26A1',
        awsIcon: 'iam',
        question: 'SCENARIO: Your DevOps team uses AWS CLI extensively with automated scripts. How can you enforce MFA without breaking automation?',
        answer: '**Different Strategies for Humans vs. Automation** \u2699\uFE0F\n\n**For Human CLI Users**:\n\u2022 Enforce MFA via IAM policy with `BoolIfExists`\n\u2022 Users run `sts get-session-token` with MFA to get temporary credentials\n\u2022 Use tools like `iam-mfa` to automate token refresh [^6^]\n\n**For Automation/Scripts**:\n\u274C **Don\'t use IAM users with MFA for automation!**\n\u2705 **Use IAM Roles** attached to EC2/Lambda/CodeBuild\n\u2705 Roles use temporary credentials automatically\n\u2705 No long-term credentials to steal\n\n**Key Insight**: MFA is for **human authentication**, not machine authentication. Machines use roles!',
        type: 'scenario',
        difficulty: 'advanced'
      },
      {
        id: 'mfa-policy-3',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F4C4}',
        awsIcon: 'iam',
        question: 'This advanced policy uses `aws:MultiFactorAuthAge`. What does it do differently?\n```json\n"Condition": {\n  "NumericLessThan": {\n    "aws:MultiFactorAuthAge": "3600"\n  }\n}\n```',
        answer: '**It enforces a "session timeout" for MFA!** \u23F0\n\n**How it works**:\n\u2022 `aws:MultiFactorAuthAge` = Seconds since MFA was entered\n\u2022 `3600` = 1 hour (3600 seconds)\n\u2022 If user authenticated with MFA more than 1 hour ago, access is denied\n\n**Use Case**: \n\u2022 High-security environments\n\u2022 Force users to re-authenticate with MFA every hour\n\u2022 Limits window of opportunity if session is hijacked\n\n**Trade-off**: More secure, but more annoying for users (constant re-auth)',
        type: 'code-analysis',
        difficulty: 'advanced'
      },
      {
        id: 'mfa-scenario-4',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F6A8}',
        awsIcon: 'iam',
        question: 'SCENARIO: A sophisticated attacker phishes your AWS admin, obtaining both their password AND their virtual MFA app\'s TOTP seed (by tricking them into scanning a malicious QR code). What MFA type would have prevented this?',
        answer: '**Hardware Security Keys (FIDO U2F/FIDO2)** \u{1F5A5}\uFE0F\n\n**Why Virtual MFA Failed**:\n\u2022 TOTP seeds can be stolen during setup\n\u2022 Attacker can generate same codes on their device\n\u2022 Phishing attack successful\n\n**Hardware Key Advantage**:\n\u2022 **Cryptographic challenge-response**: Key signs unique challenge for each login\n\u2022 **Phishing-resistant**: Won\'t work on fake sites (different domain = different key)\n\u2022 **No shared secrets**: Nothing to steal during setup\n\u2022 **Physical touch required**: Remote attackers cannot use the key\n\n**AWS Support**: FIDO2 keys are the gold standard for root account protection. [^1^]',
        type: 'scenario',
        difficulty: 'advanced'
      },
      {
        id: 'mfa-reflection-1',
        domain: 'Domain 1: Design Secure Architectures',
        topic: 'MFA Best Practices',
        icon: '\u{1F4AD}',
        awsIcon: 'iam',
        question: 'REFLECTION: Your organization wants to balance security with user convenience. The security team argues for hardware MFA keys for everyone, but developers complain about cost and carrying physical devices. How do you architect a tiered MFA strategy?',
        answer: '**Risk-Based Tiered MFA Strategy** \u2696\uFE0F\n\n**Tier 1 - Critical (Hardware Keys Required)**:\n\u2022 Root accounts\n\u2022 Billing administrators  \n\u2022 IAM administrators\n\u2022 Production database access\n\n**Tier 2 - High Risk (Virtual MFA Acceptable)**:\n\u2022 Regular admin users\n\u2022 Developers with broad permissions\n\u2022 Access to sensitive data\n\n**Tier 3 - Standard (Virtual MFA or SMS)**:\n\u2022 Read-only access users\n\u2022 Limited scope permissions\n\u2022 Temporary project access\n\n**Implementation**:\n\u2022 Use IAM policy conditions to enforce different MFA types by user group\n\u2022 Monitor with AWS Config rules for compliance\n\u2022 Regular audits of MFA device registration\n\n**Result**: Maximum protection where it matters, acceptable risk where it doesn\'t, cost-effective scaling.',
        type: 'scenario',
        difficulty: 'advanced'
      }
    ]
  },
  {
    id: 'task-1.2',
    name: 'Task 1.2: Design Secure Workloads and Applications',
    cards: []
  },
  {
    id: 'task-1.3',
    name: 'Task 1.3: Determine Appropriate Data Security Controls',
    cards: []
  }
];
