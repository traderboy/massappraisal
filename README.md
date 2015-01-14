# massappraisal
Mass appraisal Node.  Provides tools for doing multiple regression.

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs

rhc scp  massappraisal upload plr.zip app-root/data

#Merge local git with openshift
git push ssh://54b1c9de5973ca47ad000163@massappraisal-reais.rhcloud.com/~/git/massappraisal.git/ master

http://arvelmhale.blogspot.com/2015/01/compiling-mapcache-node-mapserv-node.html
http://arvelmhale.blogspot.com/2015/01/installing-r-statistical-software-in.html

See docs folder for installation guides.

$OPENSHIFT_DATA_DIR
rpm2cpio $pkg.rpm | cpio -idmv

yum --installroot=$OPENSHIFT_DATA_DIR install $pkg.rpm

ftp://rpmfind.net/linux/epel/6/x86_64/R-3.1.2-1.el6.x86_64.rpm

# Install R
Download R to $OPENSHIFT_DATA_DIR
wget http://cran.wustl.edu/src/base/R-3/R-3.1.2.tar.gz

tar zvfz R-3.1.2.tar.gz
cd R-3.1.2

./configure --enable-R-shlib --prefix=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data
make
make install DESTDIR=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data

# Install PLR
Download plr from:
http://www.joeconway.com/plr/
wget http://www.joeconway.com/plr/plr-8.3.0.15.tar.gz
tar xvfz plr-8.3.0.15.tar.gz
cd plr
export R_HOME=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2


./configure --prefix=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data
USE_PGXS=1 make
USE_PGXS=1 make install DESTDIR=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data

rhc env set PATH=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/runtime/repo/node_modules/.bin:/var/lib/openshift/54b1c9de5973ca47ad000163//.node_modules/.bin:/opt/rh/node
js010/root/usr/bin:/opt/rh/postgresql92/root/usr/bin:/bin:/usr/bin:/usr/sbin:/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2/bin -a massappraisal

-rhc env set LD_LIBRARY_PATH=/opt/rh/postgresql92/root/usr/lib64:/opt/rh/nodejs010/root/usr/lib64:/opt/rh/v8314/root/usr/lib64:/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2/lib:/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/opt/rh/postgresql92/root/usr/lib64/pgsql/ -a massappraisal

rhc env set LD_LIBRARY_PATH=/opt/rh/postgresql92/root/usr/lib64:/opt/rh/nodejs010/root/usr/lib64:/opt/rh/v8314/root/usr/lib64:/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/lib -a massappraisal

import os, sys
sys.path.append('/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/gyp/lib/python2.6/site-packages/')
import gyp

rhc env set PYTHONPATH=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/gyp/lib/python2.6/site-packages/ -a massappraisal
rhc env set R_HOME=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2 -a massappraisal
--rhc env set GDAL_DATA=/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2 -a massappraisal

rhc app restart -a massappraisal


ln -s /var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2/lib/libR.so 
psql -f /var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/opt/rh/postgresql92/root/usr/share/pgsql/extension/plr.sql


ls /var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/opt/rh/postgresql92/root/usr/lib64/pgsql/plr.so

set dynamic_library_path = '/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2/lib/:/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/opt/rh/postgresql92/root/usr/lib64/pgsql/:$libdir';


set dynamic_library_path = '/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/lib:/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/R-3.1.2/lib/:$libdir';
set dynamic_library_path = '/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/lib:$libdir';

ALTER ROLE dbuser SET search_path TO reaisincva,public;
ALTER ROLE dbuser SET dynamic_library_path TO '/var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/lib:$libdir';

#upload/download

rhc scp tileserver download ./ /var/lib/openshift/54510e5ce0b8cd182600047b/app-root/repo/node_modules/node-mapserv.zip
rhc scp tileserver download ./ /var/lib/openshift/54510e5ce0b8cd182600047b/app-root/data/lib/*

rhc scp massappraisal upload C:\enide\ws\openshift\lib.zip /var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/
rhc scp massappraisal upload  C:\enide\ws\openshift\node-mapserv.zip /var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/


rhc scp massappraisal download ./ /var/lib/openshift/54b1c9de5973ca47ad000163/app-root/data/lib.zip
rhc scp massappraisal download ./ /tmp/R.zip

rhc scp tileserver upload C:\enide\ws\openshift\lib.zip /var/lib/openshift/54510e5ce0b8cd182600047b/app-root/data/
rhc scp tileserver upload C:\enide\ws\openshift\R.zip /var/lib/openshift/54510e5ce0b8cd182600047b/app-root/data/
rhc env set LD_LIBRARY_PATH=/opt/rh/postgresql92/root/usr/lib64:/opt/rh/nodejs010/root/usr/lib64:/opt/rh/v8314/root/usr/lib64:/var/lib/openshift/54510e5ce0b8cd182600047b/app-root/data/lib -a tileserver



