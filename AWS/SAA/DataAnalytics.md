# Athena (Serverless)
- `SQL query` document stored in `S3`
    - usage: BI, analysis logs, etc
    - misc: 
        - file format: CSV, JSON, ORC, Avro, and `Parquet(preferred)` 
        - pay for data scanned
        - integration: Quicksight(BI dashboard)

- Athena Query Performance Improvement
    - use `columnar data for cost-savings` (less scan)
    - use `parquet or ORC data format`(`Glue` to convert data)
    - `Compress data` for smaller retrievals
    - `Partition datasets in S3` for easy querying
    - Use `larger files` for quicker scan


- Athena – Federated Query
    - `federated SQL query` for AWS/on-premises RDB, non-RDB, S3...
    - use `Data Source Connectors` that run on AWS Lambda to run Federated Queries
    - able to store query result to S3


# Redshift
- `data warehousing + analytics`(`OLAP – online analytical processing`)
    - Redshift Cluster
        - Leader node: for `query planning`, `results aggregation`
        - Compute node: for `performing the queries` (send results to leader)
    - data source:
        - Kinesis Data Firehose
        - S3 Bucket (through Internet or VPC)
        - EC2 (JDBC driver)
    - misc:
        - Redshift has `“Multi-AZ” mode` for some clusters
        - data is `Columnar`   
        - integrate: Quicksight for BI
        - `Redshift vs Athena`: 
            - `faster` queries / joins / aggregations thanks to `indexes`

- Redshift Spectrum
    - `Query` data in `S3` `without loading data` into `Redshift`
        - Must have a `Redshift cluster` available 
        - `Redshift Spectrum nodes` conducts the query

- Redshift snapshot
    - snapshot is point-in-time `backups of a cluster`
    - misc
        - Manual/Automated snapshot 
        - can `automatically copy snapshots to another AWS Region`
        - incremental (only what has changed is saved)

# OpenSearch (old name ElasticSearch)
- `search/pattern matching`, (real-time or non real-time) for 
    - `Kinesis` Data Streams & Kinesis Data Firehose
    - `CloudWatch Logs`
    - `DynamoDB Table`
    - AWS IoT
- misc
    - Does not support SQL 
    - OpenSearch Dashboards (visualization)
    - Security through Cognito & IAM, KMS encryption, TLS

# EMR (Elastic MapReduce)
- `Hadoop clusters, MapReduce` (Big Data) 
    - Use cases: `big data`… (data processing, machine learning, web indexing)
    - EMR cluster nodes
        - Master Node(coordinate), Core Node(manage data), Task Node(runner)
    - Node options
        - `On-demand:` 
        - `Reserved` (min 1 year): Master Node/Core Node
        - `Spot Instances`: good for Task Node(runner)
    - misc: 
        - managed, AWS provision resources(EC2, ASG...)

# QuickSight (serverless)
- BI, dashboards
    - `dashboard` is read-only snapshot of an analysis
    - can share the dashboard with `QuickSight Users` or `QuickSight Groups`
    - misc:
        - `In-memory computation using SPICE`
        - `Enterprise edition`: Possibility to setup `Column-Level security (CLS)`
    - data source:
        - Redshift, Athena, OpenSearch
        - RDS/Aurora
        - S3


# Glue (serverless)
- extract, transform, and load `(ETL) service`
    - destination: mostly `Redshift/Athena`
- things to know at a high-level
    - `Glue Data Catalog`: catalog of datasets
    - `Glue Job Bookmarks`: track `previous jobs, prevent re-processing` 
    - `Glue Elastic Views`: Combine data across multiple data stores (SQL)
    - `Glue DataBrew`:` clean and normalize data functions` 
    - `Glue Studio`: `GUI` to control ETL jobs 
    - `Glue Streaming ETL`: run job as `streaming job` instead of batch job `(Kinesis Data Streaming, Kafka, MSK)` 

# Lake Formation
- Data lake = central place to have all your data for analytics purposes
    - `data source` (with template)`: S3, RDS, Relational & NoSQL DB…
    - destination: mostly `Redshift/Athena, EMR`
    - Fine-grained Access Control (`row and column-level Access Control`)

# Kinesis Data Analytics
- Real-time `analytics` on `Kinesis Data Streams & Firehose` using `SQL`
    - Use cases: `Real-time analytics`, Time-series analytics
    - misc:
        - Output: Kinesis Data Streams& Firehose 
        - Add reference data from Amazon S3 

- Kinesis Data Analytics for `Apache Flink`
    - `Streaming data` Analytics with `Apache Flink`
    - source: Kinesis Data Streams, Apache Kafka (Amazon MSK)



# Managed Streaming for Apache Kafka (Amazon MSK)
- Apache Kafka: Amazon Kinesis stream Alternative
    - usage: `migrate existing Apache Kafka` to AWS
    - misc
        - `you manage`(create resources, deployment...), or `serverless`(without managing the capacity)
        - `Data is stored on EBS volumes` for as long as you want
        - Consumers: Kinesis Data Analytics, Glus, application(Lambda/EC2/ECS...)
- Kinesis vs MSK
    - Use Flink (Java, Scala or SQL) to process and analyze streaming data  
        - Flink: more powerful than SQL, need provisioning compute resources
|Kinesis|MSK|
|-|-|
|1MB message size|more than 1MB ability |
|limited retention|keep as long as you want|
|use Shards to stream|use Topics and Partitions|



# Machine Learning-----------------
## Rekognition
- CV: objects recognition, Facial, text...
- `Content Moderation`:
    - `Detect visual content that is inappropriate`, unwanted, or offensive (image and videos)
    - Set a `Minimum Confidence Threshold` to flag for review (manual review `Amazon Augmented AI (A2I)`)
## Transcribe
- speech to text
    - remove `Personally Identifiable Information (PII)` using `Redaction`
    - Automatic `Language Identification `for `multi-lingual` audio

## Polly
- text to speech 
- Polly `Lexicon`
    - `Pronunciation lexicons`: syntax to Customize the `pronunciation` and  `aberration`
    - upload `lexicons` and do `SynthesizeSpeech`
- use `Speech Synthesis Markup Language (SSML)`  
    - Customize more emphasizing, pronunciation...


## Translate
- language translation
## Lex
- Alexa, Speech Recognition (ASR) + Natural Language Understanding

## Connect
- Receive calls, create contact flows, cloud-based `virtual contact center`

## Comprehend (serverless)
-  Natural Language Processing application
    - group articles, sentimental analysis...

- `Comprehend Medical`
    - detects and returns useful `information` in unstructured `clinical text`
    - detects `Protected Health Information (PHI)` – Detect PHI API

## SageMaker (serverless)
- ML models, data science
    - prediction, etc...

## Forecast
- forecasts model
    - Use cases: Product Demand Planning, Financial Planning, Resource Planning, …
## Personalize
- Fully managed personalized recommendations
    - Same technology used by Amazon.com

## Textract
- extracts text, handwriting, and data from any `scanned documents` 

## Kendra
- `Natural language document search engine` powered by ML 
    - answers question from knowledge from `documents`
    - `Learn from user interactions/feedback` to promote preferred results (Incremental Learning)