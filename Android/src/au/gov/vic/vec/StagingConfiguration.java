package au.gov.vic.vec;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.json.JSONObject;

public class StagingConfiguration {
	
	private static final String STAGING_CONFIG_FILE = "/sdcard/jetty/webapps/vVote/stagingconfig.json";
	private static JSONObject stagingConfigurationData = null;

	public StagingConfiguration () {

		try {
			File inputConfigFile = new File(STAGING_CONFIG_FILE);
			FileInputStream configFis = new FileInputStream(inputConfigFile);
			BufferedInputStream configBis = new BufferedInputStream(configFis);
		
			StringBuffer sb = new StringBuffer();
			
			// read until a single byte is available
	        while(configBis.available()>0)
	        {
	           // read the byte and convert the integer to character
	           char c = (char)configBis.read();
	           sb.append(c);
			}
	
	        configBis.close();
	
	        stagingConfigurationData = new JSONObject(sb.toString());

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public JSONObject getStagingConfigurationData () {
		return stagingConfigurationData;
	}

    public static Calendar toCalendar(final String iso8601string)
            throws ParseException {
        Calendar calendar = GregorianCalendar.getInstance();
        String s = iso8601string.replace("Z", "+00:00");
        Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm").parse(s);
        calendar.setTime(date);
        return calendar;
    }
}