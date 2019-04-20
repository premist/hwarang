FROM nginx:1.15-alpine

COPY dist /usr/share/nginx/html
COPY .entrypoint.sh /opt/entrypoint.sh

CMD ["/opt/entrypoint.sh"]
