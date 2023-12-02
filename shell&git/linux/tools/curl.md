```bash

# Perform a POST Request:
curl -XPOST 'https://www.example.com' -H 'Content-Type: application/json' -d'
{
	"timestamp": "2018-01-24 12:34:56",
	"message": "User logged in",
	"user_id": 4,
	"admin": false
}
'

# Set HTTP Header:
curl -H "Authorization: Bearer Token123" https://www.example.com

#  -u: Basic Authentication Request:
curl -u username:password https://www.example.com

# specify the path to a CA (Certificate Authority) certificate file for TLS
curl --cacert http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200/_cat/nodes

# -k: Ignore SSL Certificate Verification
curl -k https://www.example.com

# Upload a File
curl -F "file=@/path/to/local/file" https://www.example.com/upload

# -x Use a Proxy:
curl -x http://proxy-server:port https://www.example.com

# save output to a file
curl -o output.txt https://www.example.com
```
