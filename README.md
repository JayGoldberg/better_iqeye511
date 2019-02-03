# better_iqeye511
Upgraded web UI for IQinvision IQeye511 cameras.

I'm a big fan of the classic IQinvision cameras and just wanted to remove the annoying Java `alert()` and be able to set windows on {crop,exposure,motion,masking} without a Java applet. This is firmware Version B2.8/901(091222).

The newer IQ7XX/IQ8XX cameras have fully HTML/Javascript controls for these functions, that were never backported to the most recent IQ5XX firmware B2.8/901(091222), though I estimate about 6hrs of work to do it.

An copy of `rom/shared/web` from IQeye7XX Version V3.1/4(140528) firmware is incleded in `reference/` and is completely unmodified.

## Usage

Be on the most recent firmware B2.8/901(091222). I have not tested with others.

FTP all files from `flash/` in the Git repo to `flash/` on the camera. These will then be loaded before the shipped firmware pages from `rom/shared/web/` (immutable) when visiting the camera configuration web UI.
