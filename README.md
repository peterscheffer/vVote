vVote\_EVC
==========

Client application to provide voting- and administrative- interfaces for voting centres (EVCs)
----------------------------------------------------------------------------------------------

This is part of the vVote design. It has been implemented by the Victorian Electoral Commission. It consists of HTML / CSS and Javascript content for a browser (Firefox-fennec 25).

It relies on SuVote\_AndroidClient from the University of Surrey to provide:

*   connectivity off the voting client platform back to SuVote services
    
*   event detection for QR codes put under the webcam
    
*   Driver for printing with the printer
    

The EVC software provides:

*   Visual voting interface (VIS) which has some introductory audio
    
*   VIS support for multiple languages (currently 20) and provides ordered placement for variable interpolation in dynamic messages; it provides for plural, dual and singular messages
    
*   Audio voting interfaces (AUI): a gesture-based audio interface (GVS) and a telephone keypad audio interface (TVS).
    
*   Provides dynamic audio and textual feedback for help systems
    
*   Plays OGG videos in the visual system
    

Additionally:

*   EVC software is configured entirely with JSON and MP3 files
    
*   Candidates and parties are sought from WBB or WBBM via the SuVote\_Client in a configuration bundle
    
*   The configuration bundle must be signed
    
*   Provides two ballots (currently Victorian Lower- and Upper-house ballots)

Link to full project: https://bitbucket.org/vvote/workspace/repositories/
