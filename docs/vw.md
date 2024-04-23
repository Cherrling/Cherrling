# 自建ValutWarden

https://github.com/dani-garcia/vaultwarden/

```docker pull vaultwarden/server:latest

docker run -d --name vaultwarden -v /vw-data/:/data/ --restart unless-stopped -p 80:80 vaultwarden/server:latest```

在服务器上装好之后还需要配置域名和反向代理，因为VW要求必须走ssl

https://github.com/dani-garcia/vaultwarden/wiki/Enabling-HTTPS