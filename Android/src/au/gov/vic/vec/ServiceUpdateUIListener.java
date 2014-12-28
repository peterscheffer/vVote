package au.gov.vic.vec;

import java.util.Hashtable;

public interface ServiceUpdateUIListener {
	public void updateUI(Hashtable<String, Hashtable<String, String>> data);
}
