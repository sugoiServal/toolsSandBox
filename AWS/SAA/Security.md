# Security
## IAM
- IAM policy, IAM `user groups`
- Password Policy
- MFA:
    - Virtual MFA /  (U2F) Security Key 
    - protect root/ user
- Access Keys
    - use to access CLI/SDK
- IAM `Roles`
    - Provide Services permissions

- IAM Security Tools
    - IAM Credentials Report (account-level)
        -  report that lists all your account's users and their Credentials
    - IAM Access Advisor (user-level)
        - show all users' permission and last access to resource



## Encryption
### EBS Encryption (opt-in)
- what are encrypted:
    - encrypted target: `snapshot` or `EBS volumn `
    - benefit of encryption: `Data at rest + data in flight` will be protected. Encryption has a minimal impact on latency
- encryption rules:
    - `snapshots` of `an encrypted EBS` are encrypted
    - `copying a snapshot` have the chance to make it encrypted 
    - `EBS volumn` created from an `encrypted snapshot` will be encrypted
    - `snapshots` of `an unencrypted EBS` will not be encrypted
- How to Encrypt an unencrypted volumn
    - create a snapshot
    - make a `copy` to the snapshot and `choose encryption` 
    - create volumn from encrypted snapshot

- EBS Encryption leverages keys from KMS (AES-256)