- [video](https://www.youtube.com/watch?v=7VAI73roXaY)
- Nginx is a gateway to distribute net traffic to the server, a **reverse proxy**
![](https://imgur.com/FWmXFc2.jpg)
- why: 
  - When the traffic is huge, it needs to distribute the service into different servers so we need an proxy to distribute the traffic to different services
  - Nginx helps encrypt the traffic (HTTPS)
- how: 
  - client only talk to Nginx
  - Nginx forward request to any available server, **a load balancer**
  - response server send response to Nginx
  - Nginx encrypt the data, and send back to client

```bash
sudo apt install nginx
# is installed to /etc/nginx/
```


# Basic server
### terminologies

```
# /nginx.conf
context {
    <key value> #directive
}
```

## [Serving static content](https://youtu.be/7VAI73roXaY?t=897)
- static content: eg static html, css...

### 1. defined serving policy in nginx.conf
```bash
http {
    # when requests come from 8080, contents in /User/mysite will be served
    server {
        listen 8080;
        root /User/mysite  
    }
}
event {}
``` 

### 2. run nginx reload
```bash
nginx -s reload
# alt
sudo  nginx -t
sudo systemctl restart nginx.service
```

## [MIME type](https://youtu.be/7VAI73roXaY?t=1038)
- specify the Content-Type header to each file extension name

```bash
http {
    types{
        text/css css;
        text/html html;
    }
}
```
- In file **mime.types**, there are many pre-defined MIME

```bash
http {
    include mime.types;
}
```

## [Location Block](https://youtu.be/7VAI73roXaY?t=1359)
- serve different content according to the url
- location support [regular expression](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/)
```bash
http {
    # when requests come from 8080, contents in /User/mysite will be served
    server {
        listen 8080;
        root /User/mysite  
        location /fruits {
            alias /User/mysite/fruits   # index.html inside /User/mysite/fruit will be served    
        }
    }
}
```

```bash
http {
    # when requests come from 8080, contents in /User/mysite will be served
    server {
        listen 8080;
        root /User/mysite  
        location /vegetables {
            alias /User/mysite/vegetables;   
            try_files /vegetables/veggies.html /index.html =404; # try to server veggies.html if the file exist, otherwise server /index.html, otherwise throw 404
        }
    }
}
```

### Redirects
- Redirect client to other url when client request specific url

```bash
http {
    # when requests come from 8080, contents in /User/mysite will be served
    server {
        listen 8080;
        root /User/mysite;  
        location /fruits {
            alias /User/mysite/fruits;   # index.html inside /User/mysite/fruit will be served    
        }
        location /crops {
            retrun 307 /fruits; # 307 is HTTP code stands for redirect
        }
    }
}
```
- an similar function is [Rewrites](https://docs.nginx.com/nginx/admin-guide/web-server/web-server/) 
  - rewrite serve another location content, but does not change the url






# [HTTP Load Balancer](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)
- [video](https://youtu.be/7VAI73roXaY?t=2599)

1. specific **load balancing algorithm** is usually executed in real life, eg vanilla round robin
2. a common way to throw multiple server instance is through **docker container**
- see the video for work flow
  - run multiple container of same image in one machine through port forward [vid](https://youtu.be/7VAI73roXaY?t=2762) 
  - nginx configration [vid](https://youtu.be/7VAI73roXaY?t=2846)

- round robin in nginx

```bash
    http {
        # specifiy available upstream servers accessed through different port
        upstream backendserver {
            server 127.0.0.1:1111;
            server 127.0.0.1:2222;
            server 127.0.0.1:3333;
            server 127.0.0.1:4444;
        }
        server {
            # round robin serving the 4 servers when client request '/'
            location / {
                proxy_pass http://backendserver/;
            }
        }
    }
```

### choose different load balancing method [link](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#choosing-a-load-balancing-method)

# encryption with reverse proxy
## [Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
## [vid](https://youtu.be/wQcSql62zRo?t=48)
```
 To add SSL encryption to your Nginx server, you will need to follow these steps:

1. Obtain a SSL certificate: You can get an SSL certificate from a certificate authority (CA) or you can create a self-signed certificate. If you want to use a certificate from a CA, you will need to follow the CA's instructions to request and install the certificate. If you want to create a self-signed certificate, you can use the OpenSSL tool to generate one.

2. Install the SSL certificate: Once you have obtained the SSL certificate, you will need to install it on your Nginx server. This usually involves placing the certificate files in a specific location on the server and updating the Nginx configuration to use the certificate.

3. Update the Nginx configuration: In your Nginx configuration file, you will need to add a server block that listens on port 443 (the default port for HTTPS) and specifies the SSL certificate and key. You will also need to update any existing server blocks that serve HTTP traffic to redirect to HTTPS.

4. Test the SSL configuration: After updating the Nginx configuration, you should test the SSL configuration to make sure it is working properly. You can do this by accessing your website using HTTPS and checking for any errors.

5. Restart Nginx: After you have tested the SSL configuration, you will need to restart the Nginx server to apply the changes. You can do this by running the systemctl restart nginx command (on systems that use Systemd) or the service nginx restart command (on systems that use SysV).
```


1. this generate ssl key pair
```bash
cd /etc/nginx
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -sha384 -keyout server-cert.key -out server-cert.crt
```
2. this Nginx config uses ssl_certification 
```bash
# HTTPS server

server {
    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate /path/to/ssl_certificate.crt;
    ssl_certificate_key /path/to/ssl_certificate.key;

    root /var/www/html;
    index index.html index.htm;

    server_name example.com;

    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP to HTTPS redirect

server {
    listen 80;
    listen [::]:80;

    server_name example.com;

    return 301 https://$server_name$request_uri;
}
```

2. this Nginx config uses load balancer as well as ssl_certification
```bash
# HTTPS load balancer

upstream backend {
    server server1.example.com;
    server server2.example.com;
    server server3.example.com;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate /path/to/ssl_certificate.crt;
    ssl_certificate_key /path/to/ssl_certificate.key;

    root /var/www/html;
    index index.html index.htm;

    server_name example.com;

    location / {
        proxy_pass http://backend;
    }
}

# HTTP to HTTPS redirect

server {
    listen 80;
    listen [::]:80;

    server_name example.com;

    return 301 https://$server_name$request_uri;
}

```
This configuration file includes three server blocks: one for the load balancer, one for HTTPS traffic, and another for redirecting HTTP traffic to HTTPS.

The upstream block defines the backend servers that the load balancer will distribute traffic to. In this example, traffic will be distributed across three servers: server1.example.com, server2.example.com, and server3.example.com.

The second server block listens on port 443 (the default port for HTTPS) and specifies the SSL certificate and key using the ssl_certificate and ssl_certificate_key directives. It also specifies the root directory for the server and the server name. The location block in this server block uses the proxy_pass directive to pass traffic to the backend servers defined in the upstream block.

The third server block listens on port 80 (the default port for HTTP) and redirects all traffic to the HTTPS version of the website using a permanent 301 redirect.


