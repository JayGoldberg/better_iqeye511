# better_iqeye511
Upgraded web UI for IQinvision IQeye511 cameras.

I'm a big fan of the classic IQinvision cameras and just wanted to remove the annoying Java `alert()` and be able to set windows on {crop,exposure,motion,masking} without a Java applet. This is firmware Version B2.8/901(091222).

The newer IQ7XX/IQ8XX cameras have fully HTML/Javascript controls for these functions, that were never backported to the most recent IQ5XX firmware B2.8/901(091222), though I estimate about 6hrs of work to do it.

An copy of `rom/shared/web` from IQeye7XX Version V3.1/4(140528) firmware is incleded in `reference/` and is completely unmodified.

## Usage

Be on the most recent firmware B2.8/901(091222). I have not tested with others.

FTP all files from `flash/` in the Git repo to `flash/` on the camera. These will then be loaded before the shipped firmware pages from `rom/shared/web/` (immutable) when visiting the camera configuration web UI.

## Interesting firmware things

*Falcon* seems to refer to H264 cameras including IQ732, IQ832, IQD3X (dome), IQM3X (dome), IQ03X (bullet).

*Mole* refers to IQ04X (bullet), IQ54X (pancake), IQD4X (dome). These are the most useless IQ cams that have no ability to send trigger images to FTP. It's not a software restriction, these cameras just don't have these OIDs.

*VAV* unknown

*pUnix* refers to standard IQeye cameras running a Unix-like RTOS (my favorites), this is IQ3XX (box), IQ5XX (pancake), IQ7XX (not IQX32 -- those are *Falcon*)(bullet), IQA3X (dome).

IQrecorder entitlement check partially happens in JS, and `js.dp` files are user-overridable in `/flash`. But setting an IQrecorder OID (like 1.13.8=0.05, set storage retention to 0.05GB) returns `IQ recorder is not licensed on this camera`. Getting this to work is pointless these days as IQrecorder playback requires a Java applet. However, the recording options for IQrecorder are more extensive than those offered in the standard *Trigger* including setting separate timelapse and motion capture resolutions (rather than global OID 1.2.2 downsample factor), and setting storage limits (purging old images).
