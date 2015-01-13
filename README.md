# massappraisal
Mass appraisal Node.  Provides tools for doing multiple regression.

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs

rhc scp  massappraisal upload plr.zip app-root/data


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
