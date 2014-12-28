package au.gov.vic.vec;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.security.GeneralSecurityException;
import java.security.SignatureException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.Timer;
import java.util.TimerTask;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.http.ParseException;
import org.bouncycastle.openpgp.PGPCompressedData;
import org.bouncycastle.openpgp.PGPException;
import org.bouncycastle.openpgp.PGPObjectFactory;
import org.bouncycastle.openpgp.PGPPublicKey;
import org.bouncycastle.openpgp.PGPPublicKeyRingCollection;
import org.bouncycastle.openpgp.PGPSignature;
import org.bouncycastle.openpgp.PGPSignatureList;
import org.bouncycastle.openpgp.PGPUtil;
import org.bouncycastle.openpgp.operator.jcajce.JcaPGPContentVerifierBuilderProvider;
import org.json.JSONObject;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

/**
 *  This Android service downloads a zip file containing the ballot draw data 
 *  for the election, and verifies that the data is valid via PGP signatures. 
 *  It unzips the contents onto the web server so that its content can be served to the EAV and VPS app.
 */
public class DownloadBundleService extends Service {

	private static final String ZIP_FILENAME = "vvote_data.zip";
	private static final String WEB_SERVER_VVOTE_PATH = "/sdcard/jetty/webapps/vVote/";
	private static final String WEB_SERVER_BUNDLE_PATH = WEB_SERVER_VVOTE_PATH + "bundle/";
	private static Date lastDownloadZipFileModDate = null;
	
	private String publicKeyPath = "";

	public static ServiceUpdateUIListener UI_UPDATE_LISTENER;
	private Timer timer = new Timer();
	private static final long UPDATE_INTERVAL = 60000;
	
	// Maximum zip file size should be set in a configuration file.  10MB is the current guess.
	private static final long MAXIMUM_ZIP_FILE_SIZE = 10000000;	
	
	private ArrayList<String> bundleFileArray = new ArrayList<String>();

	public static void setMainActivity(MainActivity activity) {
	}

	public static void setUpdateListener(ServiceUpdateUIListener l) {
	  UI_UPDATE_LISTENER = l;
	}

	public IBinder onBind(Intent intent) {
	  return null;
	}

	@Override
	public void onCreate() {
	  super.onCreate();

	  // init the service here
	  _startService();
	}

	@Override
	public void onDestroy() {
	  super.onDestroy();

	  _shutdownService();
	}

	private void _startService() {
	  timer.scheduleAtFixedRate(
	      new TimerTask() {
	        public void run() {
	        	getNominationsBundle();	          
	        }
	      }, 0, UPDATE_INTERVAL);
	}

	private void getNominationsBundle() {

	  Log.i("BUNDLE SERVICE", "******************************************************** Bundle Polling Started.");
	  
	  String bundleURL = null;

	  try {		
		StagingConfiguration stagingConfig = new StagingConfiguration();
		JSONObject stagingConfigData = stagingConfig.getStagingConfigurationData();
	    
		JSONObject event = stagingConfigData.getJSONObject("EventEntity");
		
		String proofTimeString = event.getString("ProofTime");
		Calendar proofTime = stagingConfig.toCalendar(proofTimeString);

		String pollTimeString = event.getString("PollTime");
		Calendar pollTime = stagingConfig.toCalendar(pollTimeString);
		
		Calendar now = GregorianCalendar.getInstance();

		// It's proofing time with default (unmodified, non-EB-signed) data.
		if (now.after(proofTime) && now.before(pollTime)) {
			
			System.out.println("*************************************************************** it's proofing time.");
			
			// The path on the device to vVote's public key for signature verification.
			publicKeyPath = event.getString("VVPubKeyPath");
			bundleURL = event.getString("DraftBundlePath");
			
		// It's polling time with production data.
		} else if (now.after(pollTime)) {
			
			System.out.println("*************************************************************** it's production time.");
			
			// The path on the device to EB's public key for signature verification.
			publicKeyPath = event.getString("EBPubKeyPath");
			bundleURL = event.getString("FinalBundlePath");

		} else {
			System.out.println("***************************************************************** it's too early to download any bundle yet.");
			return;
		}
		
	  } catch (ParseException e) {
		  System.out.println("Error parsing the configuration file");
		  e.printStackTrace();
		  return;
		
	  } catch (Exception e) {
		  System.out.println("Missing or invalid staging configuration file.");
		  e.printStackTrace();
		  return;
	  }

	  // Before downloading the zip, check the size of the file, and the freshness of the 
	  // file to see if it has already been downloaded and checked and found to be bad.
	  boolean validZip = checkZipHeaders(bundleURL);
	  
	  if (!validZip) {
		  System.out.println("invalid zip file.");
		  return;
	  }
	  
	  System.out.println("valid zip file.");

      downloadZipFile(bundleURL);
      
      unzipBundle();
	}
	
	// Checks the size of the zip file and the freshness of the file if the last downloaded file was not valid.
	private boolean checkZipHeaders (String bundleURL) {
		boolean isValid = true;
		
		URL url;
		URLConnection conn;

		try {
			url = new URL(bundleURL);
			conn = url.openConnection();
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("unable to connect to zip file.");
			return false;
		}
		
		// Get header metadata for the zip file.
		String fileLengthStr = conn.getHeaderField("Content-Length");
		String lastModifiedStr = conn.getHeaderField("Last-Modified");
		
		if (fileLengthStr == null || lastModifiedStr == null) {
			System.out.println("zip file is empty or missing.");
			return false;
		}
		
		try {
			Long fileLength = Long.parseLong(fileLengthStr);
			SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, dd MMM yyyy hh:mm:ss");
			Date modDate = dateFormat.parse(lastModifiedStr);
			
			// If the file length is greater than the maximum size, declare this zip file invalid.
			if (fileLength > MAXIMUM_ZIP_FILE_SIZE) {
				isValid = false;
				System.out.println("zip file too fat to fit through the interweb.");
			}			
			
			// If this is the same zip file as downloaded last time, declare this zip file invalid. 
			if (lastDownloadZipFileModDate != null) {
				if (modDate.before(lastDownloadZipFileModDate) || modDate.equals(lastDownloadZipFileModDate)) {
					isValid = false;
					System.out.println("same zip file or not more recent.");
				}
			}
			
			lastDownloadZipFileModDate = modDate;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		
		return isValid;
	}

	private void _shutdownService() {
	  if (timer != null) timer.cancel();
	  Log.i("BUNDLE SERVICE", "******************************************************** Bundle Polling Stopped.");
	}
	
	/**
	 * Downloads a zipped bundle file from the WBB.
	 */
	private void downloadZipFile(String bundleURL) {

		try {
			URL url = new URL(bundleURL);
	        URLConnection conn = url.openConnection();
	        InputStream in = conn.getInputStream();
	        FileOutputStream out =  openFileOutput(ZIP_FILENAME, Context.MODE_PRIVATE);
	        byte[] b = new byte[1024];
	        int count;
	        while ((count = in.read(b)) >= 0) {
	            out.write(b, 0, count);
	        }
	        out.flush(); 
	        out.close(); 
	        in.close();                   

	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	}
	
	/**
	 *  Unzips and examines the bundle.zip file by performing PGP checks on the files in it.
	 *  If it fails, the polling continues.  If it succeeds, the polling ends.
	 */
	private void unzipBundle () {
		
		boolean successfullyUnpacked = unpackZip("/" + ZIP_FILENAME);

		if (successfullyUnpacked) {
			try {

				Log.i("BUNDLE SERVICE", "*************************************************** keyIn file: " + publicKeyPath);

				File inputKeyFile = new File(publicKeyPath);
				FileInputStream keyFis = new FileInputStream(inputKeyFile);
				BufferedInputStream keyBis = new BufferedInputStream(keyFis);

				// Iterate over the list of unzipped files and verify that each one has an associated .bpg extension.
				Iterator<String> it = bundleFileArray.iterator();
				while (it.hasNext()) {

					String inputFileName = it.next();
					
					// Skip the .bpg (signature) files and find the original content first.
					if (inputFileName.indexOf(".bpg") > 0) {
						continue;
					}

					// Find the associated signature file.
					String signatureFileName = inputFileName + ".bpg";

					boolean validSignature = verifyFile(inputFileName, signatureFileName, keyBis);
					if (!validSignature) {
						throw new Exception("File failed signature check: " + inputFileName);
					}
					
					// Reset to the start of the signature file.
					keyBis.reset();
				}
				
				keyBis.close();				
				
			} catch (Exception e) {
				e.printStackTrace();
				return;
			}
			
			// Once everything passes the checks, we can shutdown this service.
			_shutdownService();
		}
	}

    /**
     * Verify the passed in file as being correctly signed.
     */
    private static boolean verifyFile(
            String fileName,
            String signatureFileName,
            InputStream keyIn)
            throws GeneralSecurityException, IOException, PGPException, SignatureException {

    	InputStream in = null;
    	InputStream signatureFileBis = null;
    	
    	try {
			signatureFileBis = new BufferedInputStream(new FileInputStream(signatureFileName));
			in = PGPUtil.getDecoderStream(signatureFileBis);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return false;
		}
    	
        PGPObjectFactory pgpFact = new PGPObjectFactory(in);
        PGPSignatureList p3;

        Object o = pgpFact.nextObject();
        if (o instanceof PGPCompressedData) {
            PGPCompressedData c1 = (PGPCompressedData)o;
            pgpFact = new PGPObjectFactory(c1.getDataStream());            
            p3 = (PGPSignatureList)pgpFact.nextObject();
        } else {
            p3 = (PGPSignatureList)o;
        }

        PGPPublicKeyRingCollection  pgpPubRingCollection = new PGPPublicKeyRingCollection(PGPUtil.getDecoderStream(keyIn));
        InputStream dIn = new BufferedInputStream(new FileInputStream(fileName));
        PGPSignature sig = p3.get(0);
		PGPPublicKey key = pgpPubRingCollection.getPublicKey(sig.getKeyID());
        
        sig.init(new JcaPGPContentVerifierBuilderProvider().setProvider("BC"), key);

        int ch;
        while ((ch = dIn.read()) >= 0) {
            sig.update((byte)ch);
        }

        dIn.close();
		signatureFileBis.close();

        if (sig.verify()) {
        	System.out.println("********************************************** signature is valid for " + fileName);
            return true;
        } else {
        	System.out.println("********************************************** signature is NOT valid for " + fileName);
            return false;
        }
    }

	/**
	 * Unpacks the zipped bundle file to the web server on the SD card in the correct directory structure.
	 * 
	 * @param inputFile - the local data file path to the bundle.zip file.
	 * @return success flag
	 */
	private boolean unpackZip(String inputFile) {
		
	     InputStream is;
	     ZipInputStream zis;
	     
	     try {	    	 
	         String filename;
	         File outputPath = getFilesDir();
	         
	         is = new FileInputStream(outputPath.getAbsolutePath() + inputFile);
	         zis = new ZipInputStream(new BufferedInputStream(is));          
	         ZipEntry zipEntry;
	         byte[] buffer = new byte[1024];
	         int count;
            
             // Create the folder structure required for the bundle files on the web server.
             File bundleDirectory = new File(WEB_SERVER_BUNDLE_PATH);
             bundleDirectory.mkdirs();

             while ((zipEntry = zis.getNextEntry()) != null) {
	        	 
	             filename = zipEntry.getName();

	             // Construct new directory if required.
	             if (zipEntry.isDirectory()) {
	            	 File fmd = new File(WEB_SERVER_VVOTE_PATH + filename);
	            	 fmd.mkdirs();
	            	 continue;
	             }

	             bundleFileArray.add(new String(WEB_SERVER_VVOTE_PATH + filename));
	             File output = new File(WEB_SERVER_VVOTE_PATH + filename);
	             FileOutputStream fout = new FileOutputStream (output);

	             while ((count = zis.read(buffer)) != -1) {
	                 fout.write(buffer, 0, count);             
	             }
	             
	             fout.flush();
	             fout.close();               
	             zis.closeEntry();
	         }

	         zis.close();
	     } 
	     catch(IOException e) {
	         e.printStackTrace();
	         return false;
	     }

	    return true;
	}
}
