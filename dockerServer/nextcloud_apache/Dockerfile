FROM nextcloud
COPY ssl-params.conf /etc/apache2/conf-available/ssl-params.conf
COPY default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
COPY localhost_docker.crt /etc/ssl/nextcloud/
COPY localhost_docker.key /etc/ssl/nextcloud/
RUN a2enmod ssl >/dev/null
RUN a2ensite default-ssl >/dev/null
RUN a2enconf ssl-params >/dev/null
RUN a2enmod headers
RUN service apache2 restart

