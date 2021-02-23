#!/bin/sh

# PAMELA_USERNAME and PAMELA_PORT and PAMELA_HOST must be defined for this to work.

# SOURCE is directory to publish
SOURCE="."

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


# Put most files up on PAMELA_HOST
# Skip files that are newer on the server (-u), in case somebody has made changes there, they won't be obliterated.

echo
echo
echo 'Sending changed files to remote server...'

#       --checksum \

shopt -s dotglob

rsync   --exclude '.DS*' \
        --exclude '.git' \
        --exclude '.git/*' \
        --exclude '*.scss' \
        --exclude '*.pug' \
        --exclude 'htaccess.txt' \
        --exclude 'README.txt' \
        --exclude '*sublime*' \
        --exclude '*.command' \
        --exclude '*.codekit3' \
        -vuaze "ssh -p $PAMELA_PORT" \
        * $PAMELA_USERNAME@$PAMELA_HOST:$DIRNAME

# Re-do without the '-u' above to force everything to be uploaded to the server even if it seems newer on the server

echo
echo
echo 'Listing files that maybe should be deleted from remote -- SHOULD DO THIS MANUALLY ...'

#       --checksum \

rsync   --dry-run \
        --delete \
        --exclude '.htaccess' \
        --exclude '.git/*' \
        -vuaze "ssh -p $PAMELA_PORT" \
        * $PAMELA_USERNAME@$PAMELA_HOST:$DIRNAME | grep 'deleting '


### # Now put any new files from the server to the local machine. Just in case, skip files that are new here (-u)
### 
### echo
### echo
### echo 'DRY-RUN Getting files from remote server that somebody may have uploaded, e.g. updated CACHE...'
### 
### #       --checksum \
### 
### rsync   --exclude '.*' \
###         -icvaze "ssh -p $PAMELA_PORT" \
###         $PAMELA_USERNAME@$PAMELA_HOST:$DIRNAME/* .
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
###         -vuaze "ssh -p $PAMELA_PORT" \
###         $PAMELA_USERNAME@$PAMELA_HOST:$DIRNAME/* .


echo 'Restoring file permissions for local system...'
find . -path '*CACHE/*' -exec chmod 666 {} \;


echo 'Sleeping for 10 seconds...'

sleep 10
