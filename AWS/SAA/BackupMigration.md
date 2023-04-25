## Backups, Restore 
- EBS: use `EBS Snapshot` to backup/restore 
- RDS/Aurora: 
    - use `RDS Snapshot` to backup/restore
    - `automatical backup transaction log`
        - every x mintue backup + rollback to any retention time point
        - set a retention period
- S3: S3 Replication - make another copy of object elsewhere
    - `Cross-Region Replication (CRR)`
    - `Same-Region Replication (SRR)`
    - `Cross Account Replication`

- Redshift snapshot
    - snapshot is point-in-time `backups of a cluster`
    - misc
        - Manual/Automated snapshot 
        - can `automatically copy snapshots to another AWS Region`
        - incremental (only what has changed is saved)
- DynamoDB
    - `Continuous` backups using `point-in-time recovery (PITR)` (any time in 35 days windows)
    - `On-demand` backups
        - manual full-backup: `long-term retention `
        - configured and managed in AWS Backup 




# Migration, transfer 
- Migration `EBS` (across AZ/region)
    - use EBS snapshot
- Migration database to `RDB/Aurora`
    - from AWS to AWS (across AZ/region)
        - use RDS/Aurora snapshot
        - (Aurora) use `Aurora Database Cloning` (`faster` than `snapshot + restore`)
    - on-premise `MySQL` to `AWS RDS`(S3->RDS)
        - Create a backup of your on-premises database
        - transfer backup to `S3`
        - Restore backup from S3 to create new RDS instance
    -  on-premise `MySQL cluster` to AWS `Aurora cluster`
        - Create a backup of your on-premises database with `Percona XtraBackup`
        - transfer backup to `S3`
        - Restore backup from S3 to create new Aurora cluster


### Transfer Family
- transfers file from/to `S3 or EFS` using the `FTP protocols`
    - support `FTP, FTPS, SFTP`
    - usage: sharing files, public datasets, CRM, ERP, …
    - misc:
        - `Pay per provisioned endpoint per hour + data transfers in GB`
        - Integrate with existing `authentication systems (Microsoft Active Directory`, LDAP, Okta, Amazon Cognito, custom
    

### Storage Gateway
- Hybrid Storage: `use one file system to manage AWS storages and on-premise storage`  (eg: expose the S3 data to on-premises)
    - usage:
        - long term cloud migration
        - Security/Compliance requirements
    - options
        - S3 File Gateway 
        - FSx File Gateway
        - Volume Gateway
        - Tape Gateway
    - on-premise gateway hardware: `Storage Gateway Hardware Appliance`
![](https://imgur.com/0i9PgQM.jpg)
    
- S3 File Gateway
    - on-premise file system access to `S3 buckets`
    - misc:
        - Windows Native
            - FS protocols: `NFS and SMB protocol(file system)`, 
            - user `authentication`:  `SMB + Active Directory (AD)` for 
        - Only `most recently` used data is cached in the file gateway
        - not support `S3 Glacier`: use `Lifecycle Policy instead`
- FSx File Gateway
    - on-premise file system access to `Amazon FSx`
    - misc:
        - Windows Native
            - FS protocols: `NFS and SMB protocol(file system)`, 
            - user `authentication`:  `SMB + Active Directory (AD)` for 
        - `most frequently` used data is cached in the file gateway
- Volume File Gateway
    - on-premise to EBS volumn:
        - on-premise -> iSCSI -> Volume Gateway -> S3 Bucket -> EBS Snapshots
        - options:
            - `Cached volumes`: low latency access to most recent data
            - `Stored volumes`: entire dataset is on premise, scheduled backups to S3
    - usage:  `backup on-premise volume storage to EBS Snapshots`
![](https://imgur.com/r1cjWaC.jpg)

- Tape Gateway
    - usage: backup on-premise `physical tape storage` to S3 as `Tape Archive`
        - `Virtual Tape Library (VTL)` backed by Amazon S3 and Glacier
        - iSCSI interface

### AWS DataSync
- `sync data(two-way replication)`: on-premise and AWS, AWS and AWS
    - target: FSx, EFS, S3(`include Glacier`)
    - usage: 
        - gradual migration over network
        - misc:
            - `ASYNC replication`
            - require `agent` for `on-premise`
            - Able to preserve `File permissions and metadata`(NFS POSIX, SMB…) in sync places

### Snow Family - Migrating large on-premise data to AWS
- If it takes `more than a week to transfer over the network`, use Snow devices!
- options
    - Snowcone:8(HDD), 14 TB
    - Snowball Edge: 42, 80 TB
    - Snowmobile: 100 PB (`more than 10 PB` good choice)
- Edge computing capability
    - Snowcone: 2 CPUs, 4 GB of memory
    - Snowball Edge - `Compute`: 52 vCPUs, 208 GiB, 42TB
    - Snowball Edge – `Storage`: 40 vCPUs, 80 GiB, 80 TB

- misc  
    - OpsHub - software 
        - GUI(management, AWS services, copy, compute, Monitor...)
    - Solution: on-premise data through `Snowball into S3 Glacier`
        - Snowball data cannot be import to S3 Glacier
        - solution: use lifecycle policy
            - `Snowball` -> S3 -> `lifecycle policy` -> S3 Glacier

