# Run the Privly Firefox extension in a Docker container

# To create the image:
#    docker build -t privly-jetpack .

# To run the container:
#    docker run -ti --rm -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix privly-jetpack

FROM ubuntu:14.04
MAINTAINER Sambuddha Basu

RUN apt-get update && apt-get install -y firefox git nodejs npm python-pip

# Install jpm
RUN npm install jpm --global
RUN ln -s "$(which nodejs)" /usr/bin/node

RUN export uid=1000 gid=1000 && \
	mkdir -p /home/developer && \
	echo "developer:x:${uid}:${gid}:Developer,,,:/home/developer:/bin/bash" >> /etc/passwd && \
	echo "developer:x:${uid}:" >> /etc/group && \
	echo "developer ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/developer && \
	chmod 0440 /etc/sudoers.d/developer && \
	chown ${uid}:${gid} -R /home/developer

USER developer
ENV HOME /home/developer

# Clone the privly-jetpack repo and build privly-applications
RUN cd /home/developer ; git clone --recursive https://github.com/privly/privly-jetpack.git
RUN cd /home/developer/privly-jetpack/chrome/content/privly-applications ; sudo pip install -r requirements.txt
RUN cd /home/developer/privly-jetpack/chrome/content/privly-applications ; python build.py --platform=firefox

CMD cd /home/developer/privly-jetpack ; jpm run -b /usr/bin/firefox
