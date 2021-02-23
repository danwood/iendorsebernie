#!/bin/sh

# IEN_USERNAME and IEN_PORT and IEN_HOST must be defined for this to work.

# SOURCE is directory to publish
SOURCE="build"

# DIRNAME is public_html unless this script has 'staging' in its name
DIRNAME="/home/public"

if [[ ${BASH_SOURCE[0]} == *"staging"* ]]; then
    DIRNAME="staging_html"
fi


cd "$( dirname "${BASH_SOURCE[0]}" )"
cd $SOURCE

echo 'Fixing file ownership...'
sudo chown -R $USER:staff *

echo 'Fixing file permissions... All files but commands to 644'
find . -type f ! -name '*.command' -exec chmod 644 {} \;

echo 'But CACHE files are 666 to be rewritable'
find . -path '*CACHE/*' -exec chmod 666 {} \;

echo 'Fixing directory permissions...'
find . -type d -exec chmod 755 {} \;


# -v = verbose
# -u = skip files that are newer on receiver.
#       This forces rsync to skip any files which exist on the destination and have a modified time that is newer than the source file
# -a = archive mode equals -rlptgoD ; you want recursion and want to preserve almost everything
#       -r = recursive
#       -l = copy symlinks as symlinks
#       -p = preserve permissions
#       -t = preserve modification times
#       -g = preserve group
#       -o = preserve owner
#       -D = preserve device files and special files
# -z = compress
# -e = specify the remote shell to use


# Put most files up on IEN_HOST
# Skip files that are newer on the server (-u), in case somebody has made changes there, they won't be obliterated.

echo
echo
echo 'Sending changed files to remote server...'

#       --checksum \

shopt -s dotglob

rsync   --exclude '.DS*' \
        --exclude 'CACHE/*' \
        --exclude '.git' \
        --exclude '.git/*' \
        --exclude '*.scss' \
        --exclude '*.pug' \
        --exclude 'htaccess.txt' \
        --exclude 'README.txt' \
        --exclude '*sublime*' \
        --exclude '*.command' \
        --exclude '*.codekit3' \
        -vuaze "ssh -p $IEN_PORT" \
        * $IEN_USERNAME@$IEN_HOST:$DIRNAME

# Re-do without the '-u' above to force everything to be uploaded to the server even if it seems newer on the server

echo
echo
echo 'Listing files that maybe should be deleted from remote -- SHOULD DO THIS MANUALLY ...'

#       --checksum \

rsync   --dry-run \
        --delete \
        --exclude '.htaccess' \
        --exclude 'CACHE/*' \
        --exclude '.git/*' \
        -vuaze "ssh -p $IEN_PORT" \
        * $IEN_USERNAME@$IEN_HOST:$DIRNAME | grep 'deleting '


# The rest of this just doesn't work well. Not sure why, but quite a few files end up seeming to be changed on the server.
# Not clear. 

# So instead, just sync back the latest version of the CACHE directory, and assume nothing else is changing on the server.

echo
echo
echo 'Fetching latest CACHE files from server ...'

rsync   -vuaze "ssh -p $IEN_PORT" \
        $IEN_USERNAME@$IEN_HOST:$DIRNAME/CACHE/ CACHE/


### # Now put any new files from the server to the local machine. Just in case, skip files that are new here (-u)
### 
### echo
### echo
### echo 'DRY-RUN Getting files from remote server that somebody may have uploaded, e.g. updated CACHE...'
### 
### #       --checksum \
### 
### rsync   --exclude '.*' \
###         -icvaze "ssh -p $IEN_PORT" \
###         $IEN_USERNAME@$IEN_HOST:$DIRNAME/* .
### 
### 
### echo
### echo
### echo 'Listing files that maybe should be deleted from local -- BUT ARENT ...'
### 
### #       --checksum \
### 
### rsync   --dry-run \
###         --delete \
###         --exclude '.*' \
###         --exclude 'CACHE' \
###         -vuaze "ssh -p $IEN_PORT" \
###         $IEN_USERNAME@$IEN_HOST:$DIRNAME/* .


echo 'Restoring file permissions for local system...'
find . -path '*CACHE/*' -exec chmod 666 {} \;


echo 'Sleeping for 10 seconds...'

sleep 10
